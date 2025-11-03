"use client";

import dynamic from "next/dynamic";
import { forwardRef, useRef } from "react";
import { type MDXEditorMethods, type MDXEditorProps } from "@mdxeditor/editor";
import {
  addToast,
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
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DateValue, parseDate } from "@internationalized/date";
import moment from "moment";
import { useFetch } from "hieutndev-toolkit";

import CustomForm from "@/components/shared/forms/custom-form";
import InitMDXEditor from "@/components/shared/mdx-editor/mdx-init-html";
import API_ROUTE from "@/configs/api";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { useS3Upload } from "@/hooks/useS3Upload";
import { IAPIResponse } from "@/types/global";
import {
  TBlogCategory,
  TBlogResponse,
  TNewBlog,
  TUpdateBlog,
} from "@/types/blog";
import { formatDate } from "@/utils/date";
import { sanitizeMarkdown } from "@/utils/mdx";
import { SAMPLE_MARKDOWN } from "@/utils/sample-data/markdown-editor";
import { generateSlug, isValidSlug } from "@/utils/slug";

const Editor = dynamic(() => import("@/components/shared/mdx-editor/mdx-editor-initialized"), {
  ssr: false,
  loading: () => <InitMDXEditor />
});

const ForwardRefEditor = forwardRef<
  MDXEditorMethods,
  MDXEditorProps & { onEditorReady?: () => void; imageUploadHandler?: (file: File) => Promise<string>; }
>((props, ref) => {

  const { onEditorReady, imageUploadHandler, ...editorProps } = props;

  useEffect(() => {
    const timer = setTimeout(() => {
      onEditorReady?.();
    }, 100);

    return () => clearTimeout(timer);
  }, [onEditorReady]);

  return (
    <Editor
      {...editorProps}
      editorRef={ref}
      imageUploadHandler={imageUploadHandler}
    />
  );
});

ForwardRefEditor.displayName = "ForwardRefEditor";

interface BlogFormMarkDownProps {
  mode: "create" | "edit";
  blogId?: string;
}

export default function BlogFormMarkDownComponent({ mode, blogId }: BlogFormMarkDownProps) {

  const router = useRouter();
  const mdxEditorRef = useRef<MDXEditorMethods>(null);
  const [initArticle, setInitArticle] = useState("");
  const [convertText, setConvertText] = useState<string>("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [pendingContent, setPendingContent] = useState<string>("");
  const [blogDetails, setBlogDetails] = useState<TNewBlog | TUpdateBlog>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    published_status: "draft",
    published_date: "",
    category_id: 0, // single category ID
    tags: [], // tags array
    featured_image: null,
  });

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
    if (mode === "edit" && fetchBlogDetailResult && fetchBlogDetailResult.results) {
      const blogData = fetchBlogDetailResult.results;

      setBlogDetails({
        title: blogData.title,
        slug: blogData.slug,
        excerpt: blogData.excerpt,
        content: blogData.content,
        published_status: blogData.published_status,
        published_date: formatDate(blogData.published_date, "onlyDateReverse"),
        category_id: blogData.category_id ?? 0,
        tags: blogData.tags,
        featured_image: null,
      });

      setCurrentFeaturedImage(blogData.featured_image);

      const articleContent = sanitizeMarkdown(blogData.content || "");

      setPendingContent(articleContent);
      setInitArticle(articleContent);

      if (isEditorReady) {
        setConvertText(articleContent);
      }

      setDatePicked(parseDate(formatDate(blogData.published_date, "onlyDateReverse")));
    } else if (mode === "create") {
      // For completely new blogs, use sample markdown
      const content = sanitizeMarkdown(SAMPLE_MARKDOWN);

      setPendingContent(content);
      if (isEditorReady) {
        setConvertText(content);
      }
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
  }, [mode, fetchBlogDetailResult, fetchBlogDetailError, isEditorReady]);

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
  }, [formData]);

  useEffect(() => {
    console.log(blogDetails.tags);
  }, [blogDetails]);

  const handleSubmit = () => {
    // Validate required fields
    if (
      !blogDetails.title ||
      !blogDetails.slug ||
      !blogDetails.category_id
    ) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields",
        color: "danger",
      });

      return;
    }

    // Validate slug format
    if (!isValidSlug(blogDetails.slug)) {
      addToast({
        title: "Error",
        description: "Please provide a valid slug (lowercase letters, numbers, and hyphens only)",
        color: "danger",
      });

      return;
    }

    const submitFormData = new FormData();

    // Handle file uploads
    if (blogDetails.featured_image && blogDetails.featured_image.length > 0) {
      submitFormData.append("featured_image", blogDetails.featured_image[0]);

      if (mode === "edit") {
        submitFormData.append("is_change_featured_image", "true");
      }
    } else if (mode === "edit") {
      submitFormData.append("is_change_featured_image", "false");
    }

    // Append basic blog information
    submitFormData.append("title", blogDetails.title);
    submitFormData.append("slug", blogDetails.slug);
    submitFormData.append("excerpt", blogDetails.excerpt);
    submitFormData.append("content", convertText);
    submitFormData.append("published_status", blogDetails.published_status);
    submitFormData.append("category_id", blogDetails.category_id.toString());
    submitFormData.append("tags", JSON.stringify(blogDetails.tags));

    // Handle published date
    if (datePicked) {
      submitFormData.append("published_date", datePicked.toString());
    }

    if (mode === "edit") {
      submitFormData.append("is_change_content", blogDetails.content !== initArticle ? "true" : "false");
    }

    setFormData(submitFormData);
  };

  /* HANDLE PARSE DATE */
  const [datePicked, setDatePicked] = useState<DateValue | null>(
    parseDate(moment().format("YYYY-MM-DD"))
  );

  /* HANDLE IMAGE MODAL */
  const handleOpenImageModal = (url: string, alt: string) => {
    setSelectedImage({ url, alt });
    onImageModalOpen();
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    onImageModalClose();
  };

  useEffect(() => {
    if (isEditorReady && pendingContent) {
      try {
        const sanitizedContent = sanitizeMarkdown(pendingContent);

        setConvertText(sanitizedContent);
        setPendingContent(""); // Clear pending content after setting
      } catch (error) {
        console.error("Error setting editor content:", error);

        setConvertText("");
        setPendingContent("");
      }
    }
  }, [isEditorReady, pendingContent]);

  useEffect(() => {
    if (mode === "edit" && isEditorReady && !convertText && initArticle) {
      const timer = setTimeout(() => {
        try {
          const sanitizedContent = sanitizeMarkdown(initArticle);

          setConvertText(sanitizedContent);
        } catch (error) {
          console.error("Error in fallback content setting:", error);
          setConvertText("");
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [mode, isEditorReady, convertText, initArticle]);

  const { uploadImage: handleUploadImage } = useS3Upload({
    showToasts: true,
    onUploadStart: (file) => {
      console.log("Starting upload for:", file.name);
    },
    onUploadSuccess: (imageUrl, file) => {
      console.log("Upload successful:", { imageUrl, fileName: file.name });
    },
    onUploadError: (error, file) => {
      console.error("Upload failed:", { error, fileName: file.name });
    },
  });

  const handleTitleChange = useCallback((value: string) => {
    setBlogDetails((prev) => ({ ...prev, title: value }));
  }, []);

  const handleExcerptChange = useCallback((value: string) => {
    setBlogDetails((prev) => ({ ...prev, excerpt: value }));
  }, []);

  const handleTagsChange = useCallback((value: string) => {
    setBlogDetails((prev) => ({ ...prev, tags: value ? value.split(",") : [] }));
  }, []);

  const handleCategorySelection = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;

    setBlogDetails((prev) => ({
      ...prev,
      category_id: selectedKey ? parseInt(selectedKey) : 0,
    }));
  }, []);

  const handlePublishedStatusChange = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;

    setBlogDetails((prev) => ({
      ...prev,
      published_status: selectedKey as "draft" | "published" | "archived",
    }));
  }, []);

  // Effect to auto-generate slug from title with debouncing
  useEffect(() => {
    if (blogDetails.title) {
      const debounceTimer = setTimeout(() => {
        const generatedSlug = generateSlug(blogDetails.title);

        setBlogDetails((prev) => ({
          ...prev,
          slug: generatedSlug,
        }));
      }, 300); // 300ms debounce

      return () => clearTimeout(debounceTimer);
    }
  }, [blogDetails.title]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setBlogDetails((prev) => ({ ...prev, content: convertText }));
    }, 500); // 500ms debounce for markdown content

    return () => clearTimeout(debounceTimer);
  }, [convertText]);

  const selectedCategoryKeys = useMemo(
    () => blogDetails.category_id ? [blogDetails.category_id.toString()] : [],
    [blogDetails.category_id]
  );

  const selectedStatusKeys = useMemo(
    () => [blogDetails.published_status],
    [blogDetails.published_status]
  );

  // Memoized editor to prevent unnecessary re-renders
  const MemoizedEditor = useMemo(
    () => (
      <ForwardRefEditor
        key={`mdx-editor-${mode}-${blogId || "new"}-${convertText ? "with-content" : "empty"}`}
        ref={mdxEditorRef}
        className="min-h-[400px] w-full"
        imageUploadHandler={handleUploadImage}
        markdown={convertText}
        placeholder="Write your blog article here using Markdown..."
        onChange={setConvertText}
        onEditorReady={() => setIsEditorReady(true)}
      />
    ),
    [mode, blogId, convertText, handleUploadImage]
  );

  const isLoading = submitting || (mode === "edit" && fetchingBlogDetail);

  return (
    <div>
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
              value={blogDetails.title}
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
              value={blogDetails.slug}
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
                value={blogDetails.excerpt}
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
              value={blogDetails.tags.join(",") || ''}
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
              onChange={(e) => {
                setBlogDetails((prev) => ({
                  ...prev,
                  featured_image: e.target.files
                }));
              }}
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
              {MemoizedEditor}
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
    </div>
  );
}
