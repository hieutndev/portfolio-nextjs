"use client";

import {
  addToast,
  Button,
  DatePicker,
  Input,
  Select,
  SelectItem,
  Textarea,
  Modal,
  ModalContent,
  useDisclosure,
  Image,
} from "@heroui/react";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { DateValue, parseDate } from "@internationalized/date";
import moment from "moment";
import { useFetch, useScroll } from "hieutndev-toolkit";
import clsx from "clsx";

import CustomForm from "@/components/shared/forms/custom-form";
import { useAdminScroll } from "@/components/providers/admin-scroll-provider";
import MDXEditorClient from "@/components/shared/mdx-editor/mdx-editor-client";
import API_ROUTE from "@/configs/api";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { useS3Upload } from "@/hooks/useS3Upload";
import { IAPIResponse } from "@/types/global";
import {
  TBlogCategory,
  TBlogResponse,
} from "@/types/blog";
import { formatDate } from "@/utils/date";
import { sanitizeMarkdown } from "@/utils/mdx";
import { SAMPLE_MARKDOWN } from "@/utils/sample-data/markdown-editor";
import { generateSlug, isValidSlug } from "@/utils/slug";

interface BlogFormMarkDownProps {
  mode: "create" | "edit";
  blogId?: string;
}

export default function BlogFormMarkDownComponent({ mode, blogId }: BlogFormMarkDownProps) {

  const router = useRouter();

  // Split state to prevent unnecessary re-renders
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState(0);
  const [publishedStatus, setPublishedStatus] = useState<"draft" | "published" | "archived">("draft");
  const [featuredImage, setFeaturedImage] = useState<FileList | null>(null);

  // Editor state - kept separate and stable
  const [initArticle, setInitArticle] = useState("");
  const [initialMarkdown, setInitialMarkdown] = useState<string>("");
  const convertTextRef = useRef<string>("");
  const hasLoadedContentRef = useRef(false);

  const [listBlogCategories, setListBlogCategories] = useState<TBlogCategory[]>([]);
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState<string>("");

  const { isOpen: isImageModalOpen, onOpen: onImageModalOpen, onClose: onImageModalClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string; } | null>(null);

  /* HANDLE FETCH BLOG CATEGORIES */
  const { data: fetchBlogCategoriesResult, error: fetchBlogCategoriesError, loading: fetchingBlogCategories, fetch: fetchBlogCategories, } = useFetch<IAPIResponse<TBlogCategory[]>>(API_ROUTE.BLOG.GET_ALL_CATEGORIES);

  useEffect(() => {
    fetchBlogCategories();
  }, []);

  useEffect(() => {
    if (fetchBlogCategoriesResult && fetchBlogCategoriesResult.results) {
      setListBlogCategories(fetchBlogCategoriesResult.results);
    }

    if (fetchBlogCategoriesError) {
      const parseError = JSON.parse(fetchBlogCategoriesError);

      if (parseError.message) {
        addToast({
          title: "Error",
          description: MAP_MESSAGE[parseError.message],
          color: "danger",
        });
      }
    }
  }, [fetchBlogCategoriesResult, fetchBlogCategoriesError]);

  /* HANDLE FETCH BLOG DETAILS (for edit mode) */
  const {
    data: fetchBlogDetailResult,
    error: fetchBlogDetailError,
    loading: fetchingBlogDetail,
    fetch: fetchBlogDetail,
  } = useFetch<IAPIResponse<TBlogResponse>>(
    mode === "edit" && blogId ? API_ROUTE.BLOG.GET_ONE(blogId) : "",
    {
      skip: mode === "create" || !blogId,
    }
  );

  useEffect(() => {
    if (mode === "edit" && blogId) {
      fetchBlogDetail();
    }
  }, [mode, blogId]);

  useEffect(() => {
    if (mode === "edit" && fetchBlogDetailResult && fetchBlogDetailResult.results && !hasLoadedContentRef.current) {
      const blogData = fetchBlogDetailResult.results;

      // Update individual states instead of one large object
      setTitle(blogData.title);
      setSlug(blogData.slug);
      setExcerpt(blogData.excerpt);
      setTags(blogData.tags);
      setCategoryId(blogData.category_id ?? 0);
      setPublishedStatus(blogData.published_status);
      setCurrentFeaturedImage(blogData.featured_image);

      const articleContent = sanitizeMarkdown(blogData.content || "");

      setInitialMarkdown(articleContent);
      setInitArticle(articleContent);
      convertTextRef.current = articleContent;

      setDatePicked(parseDate(formatDate(blogData.published_date, "onlyDateReverse")));
      hasLoadedContentRef.current = true;
    } else if (mode === "create" && !hasLoadedContentRef.current) {
      // For completely new blogs, use sample markdown
      const content = sanitizeMarkdown(SAMPLE_MARKDOWN);

      setInitialMarkdown(content);
      convertTextRef.current = content;
      hasLoadedContentRef.current = true;
    }

    if (fetchBlogDetailError) {
      const parsedError = JSON.parse(fetchBlogDetailError);

      if (parsedError.message) {
        addToast({
          title: "Error",
          description: MAP_MESSAGE[parsedError.message]
        })
      }
    }
  }, [mode, fetchBlogDetailResult, fetchBlogDetailError]);

  /* HANDLE SUBMIT */
  const [formData, setFormData] = useState<FormData | null>(null);

  const {
    data: submitResult,
    error: submitError,
    loading: submitting,
    fetch: submitForm,
  } = useFetch(
    mode === "create" ? API_ROUTE.BLOG.NEW : API_ROUTE.BLOG.UPDATE_BLOG(blogId!),
    {
      method: mode === "create" ? "POST" : "PATCH",
      skip: true,
    }
  );

  useEffect(() => {
    if (submitResult) {
      addToast({
        title: "Success",
        description: MAP_MESSAGE[submitResult.message],
        color: "success",
      });

      if (mode === "create") {
        router.push(ROUTE_PATH.ADMIN.BLOG.INDEX);
      } else {
        fetchBlogDetail();
      }
    }

    if (submitError) {
      const parseError = JSON.parse(submitError);

      if (parseError.message) {
        addToast({
          title: "Error",
          description: MAP_MESSAGE[parseError.message] || parseError.message,
          color: "danger",
        });
      }
    }
  }, [submitResult, submitError, mode, router]);

  useEffect(() => {
    if (formData) {
      submitForm({
        body: formData,
        options: {
          removeContentType: true,
        },
      });

      setFormData(null);
    }
  }, [formData, submitForm]);

  /* HANDLE PARSE DATE */
  const [datePicked, setDatePicked] = useState<DateValue | null>(
    parseDate(moment().format("YYYY-MM-DD"))
  );

  const handleSubmit = useCallback(() => {
    // Validate required fields
    if (!title || !slug || !categoryId) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields",
        color: "danger",
      });

      return;
    }

    // Validate slug format
    if (!isValidSlug(slug)) {
      addToast({
        title: "Error",
        description: "Please provide a valid slug (lowercase letters, numbers, and hyphens only)",
        color: "danger",
      });

      return;
    }

    const submitFormData = new FormData();

    // Handle file uploads
    if (featuredImage && featuredImage.length > 0) {
      submitFormData.append("featured_image", featuredImage[0]);

      if (mode === "edit") {
        submitFormData.append("is_change_featured_image", "true");
      }
    } else if (mode === "edit") {
      submitFormData.append("is_change_featured_image", "false");
    }

    // Append basic blog information
    submitFormData.append("title", title);
    submitFormData.append("slug", slug);
    submitFormData.append("excerpt", excerpt);
    submitFormData.append("content", convertTextRef.current);
    submitFormData.append("published_status", publishedStatus);
    submitFormData.append("category_id", categoryId.toString());
    submitFormData.append("tags", JSON.stringify(tags));

    // Handle published date
    if (datePicked) {
      submitFormData.append("published_date", datePicked.toString());
    }

    if (mode === "edit") {
      submitFormData.append("is_change_content", convertTextRef.current !== initArticle ? "true" : "false");
    }

    setFormData(submitFormData);
  }, [title, slug, excerpt, tags, categoryId, publishedStatus, featuredImage, datePicked, mode, initArticle]);

  /* HANDLE IMAGE MODAL */
  const handleOpenImageModal = (url: string, alt: string) => {
    setSelectedImage({ url, alt });
    onImageModalOpen();
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    onImageModalClose();
  };



  const s3UploadOptions = useMemo(() => ({
    showToasts: true,
  }), []);

  const { uploadImage: handleUploadImage } = useS3Upload(s3UploadOptions);

  const handleTitleChange = useCallback((value: string) => {
    setTitle(value);
  }, []);

  const handleExcerptChange = useCallback((value: string) => {
    setExcerpt(value);
  }, []);

  const handleTagsChange = useCallback((value: string) => {
    setTags(value ? value.split(",") : []);
  }, []);

  const handleCategorySelection = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;

    setCategoryId(selectedKey ? parseInt(selectedKey) : 0);
  }, []);

  const handlePublishedStatusChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;

    setPublishedStatus(selectedKey as "draft" | "published" | "archived");
  }, []);

  const handleFeaturedImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFeaturedImage(e.target.files);
  }, []);

  // Effect to auto-generate slug from title with debouncing
  useEffect(() => {
    if (title) {
      const debounceTimer = setTimeout(() => {
        const generatedSlug = generateSlug(title);

        setSlug(generatedSlug);
      }, 300); // 300ms debounce

      return () => clearTimeout(debounceTimer);
    }
  }, [title]);

  const selectedCategoryKeys = useMemo(
    () => categoryId ? [categoryId.toString()] : [],
    [categoryId]
  );

  const selectedStatusKeys = useMemo(
    () => [publishedStatus],
    [publishedStatus]
  );

  // Stable onChange handler to prevent recreating on every render
  const handleEditorChange = useCallback((newContent: string) => {
    convertTextRef.current = newContent;
  }, []);

  // Stable onReady handler
  const handleEditorReady = useCallback(() => {
    // Editor is ready - no state needed since we use initialMarkdown
  }, []);

  // Memoized editor section - isolated from parent re-renders
  const editorSection = useMemo(() => {
    // Only render editor after content is loaded
    if (!hasLoadedContentRef.current) {
      return (
        <div className="h-[400px] border border-default-200 rounded-lg flex items-center justify-center">
          <div className="text-default-500">Loading editor...</div>
        </div>
      );
    }

    return (
      <MDXEditorClient
        className="min-h-[400px] w-full"
        initialMarkdown={initialMarkdown}
        placeholder="Write your blog article here using Markdown..."
        uploadImage={handleUploadImage}
        onChange={handleEditorChange}
        onReady={handleEditorReady}
      />
    );
  }, [initialMarkdown, handleEditorChange, handleEditorReady, handleUploadImage]);

  const isLoading = submitting || (mode === "edit" && fetchingBlogDetail);

  /* STICKY SUBMIT BUTTON */
  const { scrollContainerRef } = useAdminScroll();
  const { scrollPosition } = useScroll({
    target: scrollContainerRef?.current || undefined,
    thr: 50,
  });

  const submitButtonRef = useRef<HTMLDivElement>(null);
  const stickyButtonRef = useRef<HTMLDivElement>(null);
  const [isSubmitButtonVisible, setIsSubmitButtonVisible] = useState(true);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Cancel any pending animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Use requestAnimationFrame to throttle the expensive DOM calculations
    rafIdRef.current = requestAnimationFrame(() => {
      if (submitButtonRef.current && stickyButtonRef?.current) {
        const buttonRect = submitButtonRef.current.getBoundingClientRect();
        const stickyButtonRect = stickyButtonRef.current.getBoundingClientRect();
        const isVisible = buttonRect.bottom <= stickyButtonRect.top + 100;

        setIsSubmitButtonVisible(isVisible);
      }
    });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [scrollPosition]);

  return (
    <div className="relative">
      <div ref={submitButtonRef}>
        <CustomForm
          className={"w-full h-max flex flex-col gap-4"}
          formId={`${mode}BlogForm`}
          isLoading={isLoading}
          useCtrlSKey={true}
          useEnterKey={false}
          onSubmit={handleSubmit}
        >
          <div className={"w-full h-max flex flex-col gap-4"}>
            <h3 className={"text-xl font-semibold"}>Blog Information</h3>
            <div className={"w-full grid grid-cols-3 gap-4"}>
              <Input
                isRequired
                className={"col-span-3"}
                label={"Blog Title"}
                labelPlacement={"outside"}
                name={"title"}
                placeholder={"Enter blog title..."}
                type={"text"}
                value={title}
                variant={"bordered"}
                onValueChange={handleTitleChange}
              />
              <Input
                isReadOnly
                label={"Slug"}
                labelPlacement={"outside"}
                name={"slug"}
                placeholder={"URL-friendly version (auto-generated)"}
                type={"text"}
                value={slug}
                variant={"faded"}
              />
              <Select
                isRequired
                isLoading={fetchingBlogCategories}
                items={listBlogCategories}
                label={"Category"}
                labelPlacement={"outside"}
                placeholder={"Select blog category"}
                selectedKeys={selectedCategoryKeys}
                variant={"bordered"}
                onSelectionChange={handleCategorySelection}
              >
                {(item) => (
                  <SelectItem key={item.category_id}>{item.category_title}</SelectItem>
                )}
              </Select>
              <Select
                items={[
                  { key: "draft", label: "Draft" },
                  { key: "published", label: "Published" },
                  { key: "archived", label: "Archived" },
                ]}
                label={"Published Status"}
                labelPlacement={"outside"}
                placeholder={"Select status"}
                selectedKeys={selectedStatusKeys}
                variant={"bordered"}
                onSelectionChange={handlePublishedStatusChange}
              >
                {(item) => (
                  <SelectItem key={item.key}>{item.label}</SelectItem>
                )}
              </Select>
              <div className={"w-full col-span-3"}>
                <Textarea
                  label={"Excerpt"}
                  labelPlacement={"outside"}
                  name={"excerpt"}
                  placeholder={"Enter a brief excerpt of your blog..."}
                  value={excerpt}
                  variant={"bordered"}
                  onValueChange={handleExcerptChange}
                />
              </div>
              <DatePicker
                label={"Published Date"}
                labelPlacement={"outside"}
                value={datePicked}
                variant={"bordered"}
                onChange={setDatePicked}
              />
              <Input
                label={"Tags"}
                labelPlacement={"outside"}
                name={"tags"}
                placeholder={"Enter tags (commas allowed)"}
                type={"text"}
                value={tags.join(",") || ''}
                variant={"bordered"}
                onValueChange={handleTagsChange}
              />
              <Input
                accept={"image/*"}
                label={"Featured Image"}
                labelPlacement={"outside"}
                name={"featured_image"}
                placeholder={"Select featured image for blog"}
                type={"file"}
                variant={"bordered"}
                onChange={handleFeaturedImageChange}
              />
              {mode === "edit" && currentFeaturedImage && (
                <div className="col-span-3 mt-2">
                  <p className="text-xs text-gray-500 mb-2">Current Featured Image:</p>
                  <button
                    className="cursor-pointer transition-opacity hover:opacity-80"
                    type="button"
                    onClick={() => handleOpenImageModal(currentFeaturedImage, "Featured Blog Image")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      alt="Current featured blog thumbnail"
                      className="w-48 h-auto rounded-lg border border-default-200"
                      src={currentFeaturedImage}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="my-4">
            <div className="h-px bg-default-200" />
          </div>
          <div className={"w-full flex flex-col gap-4"}>
            <h3 className={"text-lg font-semibold"}>Blog Article</h3>
            <div className="w-full">
              <p className="text-sm text-foreground pb-1.5 block">
                Article Content
              </p>
              <div className="border border-default-200 rounded-lg overflow-hidden bg-white shadow-sm">
                {editorSection}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Use Markdown syntax to format your content. You can switch to
                source mode to see the raw markdown.
                <br />
                <strong>Image Upload:</strong> Click the image icon in the toolbar
                or drag & drop images directly into the editor. Images will be
                automatically uploaded to S3.
              </p>
            </div>
          </div>
        </CustomForm>

        <Modal
          hideCloseButton
          isOpen={isImageModalOpen}
          size="5xl"
          onClose={handleCloseImageModal}>
          <ModalContent className={"bg-transparent w-max overflow-hidden"}>
            {() => (
              <>
                {selectedImage && (
                  <Image
                    isBlurred
                    alt={selectedImage.alt}
                    className={"object-contain"}
                    height={512}
                    shadow={"sm"}
                    src={selectedImage.url}
                  />
                )}
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Sticky Submit Button */}

        <div ref={stickyButtonRef} className={clsx("fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-default-200 shadow-lg transition-all ease-in-out duration-500", {
          "-bottom-40": isSubmitButtonVisible
        })}>
          <div className="container mx-auto px-4 py-3">
            <Button
              fullWidth
              color={"primary"}
              isDisabled={isLoading}
              isLoading={isLoading}
              size={"md"}
              type={"button"}
              onPress={handleSubmit}>
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
