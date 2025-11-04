"use client";

import {
  addToast,
  Button,
  DateRangePicker,
  Divider,
  Input,
  RangeValue,
  Select,
  SelectItem,
  Textarea,
  Modal,
  ModalContent,
  useDisclosure,
  Image,
} from "@heroui/react";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { DateValue, parseDate } from "@internationalized/date";
import moment from "moment";
import { useFetch, useScroll } from "hieutndev-toolkit";

import ProjectImageComponent from "./project-image";

import CustomForm from "@/components/shared/forms/custom-form";
import MDXEditorClient from "@/components/shared/mdx-editor/mdx-editor-client";
import API_ROUTE from "@/configs/api";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { useS3Upload } from "@/hooks/useS3Upload";
import { IAPIResponse } from "@/types/global";
import { useAdminScroll } from "@/components/providers/admin-scroll-provider";
import {
  TProjectGroup,
  TProjectImage,
  TProjectResponse,
} from "@/types/project";
import { formatDate } from "@/utils/date";
import { generateSlug, isValidSlug } from "@/utils/slug";
import { SAMPLE_MARKDOWN } from "@/utils/sample-data/markdown-editor";
import { sanitizeMarkdown } from "@/utils/mdx";

interface ProjectFormMarkDownProps {
  mode: "create" | "edit";
  projectId?: string;
}

export default function ProjectFormMarkDownComponent({ mode, projectId }: ProjectFormMarkDownProps) {

  const router = useRouter();

  // Split state to prevent unnecessary re-renders
  const [projectFullname, setProjectFullname] = useState("");
  const [projectShortname, setProjectShortname] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [groupId, setGroupId] = useState<number | null>(null);
  const [projectThumbnail, setProjectThumbnail] = useState<FileList | null>(null);
  const [projectImages, setProjectImages] = useState<FileList | null>(null);

  // Editor state - kept separate and stable
  const [initArticle, setInitArticle] = useState("");
  const [initialMarkdown, setInitialMarkdown] = useState<string>("");
  const convertTextRef = useRef<string>("");
  const hasLoadedContentRef = useRef(false);

  const [listProjectGroups, setListProjectGroups] = useState<TProjectGroup[]>([]);
  const [currentThumbnail, setCurrentThumbnail] = useState<string>("");
  const [listCurrentImages, setListCurrentImages] = useState<TProjectImage[]>([]);
  const [listRemoveImages, setListRemoveImages] = useState<string[]>([]);

  const { isOpen: isImageModalOpen, onOpen: onImageModalOpen, onClose: onImageModalClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string; type: "thumbnail" | "image"; } | null>(null);

  /* HANDLE PARSE DATE */
  const [datePicked, setDatePicked] = useState<RangeValue<DateValue> | null>({
    start: parseDate(moment().format("YYYY-MM-DD")),
    end: parseDate(moment().add(1, "days").format("YYYY-MM-DD")),
  });

  /* HANDLE FETCH PROJECT GROUPS */
  const { data: fetchProjectGroupsResult, error: fetchProjectGroupsError, loading: fetchingProjectGroups, fetch: fetchProjectGroups, } = useFetch<IAPIResponse<TProjectGroup[]>>(API_ROUTE.PROJECT.GET_ALL_GROUP);

  useEffect(() => {
    fetchProjectGroups();
  }, []);

  useEffect(() => {
    if (fetchProjectGroupsResult && fetchProjectGroupsResult.results) {
      setListProjectGroups(fetchProjectGroupsResult.results);
    }

    if (fetchProjectGroupsError) {
      const parseError = JSON.parse(fetchProjectGroupsError);

      if (parseError.message) {
        addToast({
          title: "Error",
          description: MAP_MESSAGE[parseError.message],
          color: "danger",
        });
      }
    }
  }, [fetchProjectGroupsResult, fetchProjectGroupsError]);

  /* HANDLE FETCH PROJECT DETAILS (for edit mode) */
  const {
    data: fetchProjectDetailResult,
    error: fetchProjectDetailError,
    loading: fetchingProjectDetail,
    fetch: fetchProjectDetail,
  } = useFetch<IAPIResponse<TProjectResponse>>(
    mode === "edit" && projectId ? API_ROUTE.PROJECT.GET_ONE(projectId) : "",
    {
      skip: mode === "create" || !projectId,
    }
  );

  useEffect(() => {
    if (mode === "edit" && projectId) {
      fetchProjectDetail();
    }
  }, [mode, projectId]);

  useEffect(() => {
    if (mode === "edit" && fetchProjectDetailResult && fetchProjectDetailResult.results && !hasLoadedContentRef.current) {
      const projectData = fetchProjectDetailResult.results;

      // Update individual states instead of one large object
      setProjectFullname(projectData.project_fullname);
      setProjectShortname(projectData.project_shortname);
      setSlug(projectData.slug);
      setShortDescription(projectData.short_description);
      setGithubLink(projectData.github_link || "");
      setDemoLink(projectData.demo_link || "");
      setGroupId(projectData.group_id);
      setCurrentThumbnail(projectData.project_thumbnail);
      setListCurrentImages(projectData.project_images);

      const articleContent = sanitizeMarkdown(projectData.article_body || "");

      setInitialMarkdown(articleContent);
      setInitArticle(articleContent);
      convertTextRef.current = articleContent;

      setDatePicked({
        start: parseDate(formatDate(projectData.start_date, "onlyDateReverse")),
        end: parseDate(formatDate(projectData.end_date, "onlyDateReverse")),
      });

      hasLoadedContentRef.current = true;
    } else if (mode === "create" && !hasLoadedContentRef.current) {
      // For completely new projects, use sample markdown
      const content = sanitizeMarkdown(SAMPLE_MARKDOWN);

      setInitialMarkdown(content);
      convertTextRef.current = content;
      hasLoadedContentRef.current = true;
    }

    if (fetchProjectDetailError) {
      const parsedError = JSON.parse(fetchProjectDetailError);

      if (parsedError.message) {
        addToast({
          title: "Error",
          description: MAP_MESSAGE[parsedError.message]
        })
      }
    }
  }, [mode, fetchProjectDetailResult, fetchProjectDetailError]);

  /* HANDLE SUBMIT */
  const [formData, setFormData] = useState<FormData | null>(null);

  const {
    data: submitResult,
    error: submitError,
    loading: submitting,
    fetch: submitForm,
  } = useFetch(
    mode === "create" ? API_ROUTE.PROJECT.NEW : API_ROUTE.PROJECT.UPDATE_PROJECT(projectId!),
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
        router.push(ROUTE_PATH.ADMIN.PROJECT.INDEX);
      } else {
        fetchProjectDetail();
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

  const handleSubmit = useCallback(() => {
    // Validate required fields
    if (!projectFullname || !projectShortname || !slug || !shortDescription) {
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

    if (!datePicked?.start || !datePicked?.end) {
      addToast({
        title: "Error",
        description: "Please select start and end dates",
        color: "danger",
      });

      return;
    }

    const submitFormData = new FormData();

    // Handle file uploads
    if (mode === "create" && !projectThumbnail) {
      addToast({
        title: "Error",
        description: "Please upload a project thumbnail",
        color: "danger",
      });

      return;
    } else if (projectThumbnail && projectThumbnail.length > 0) {
      submitFormData.append("project_thumbnail", projectThumbnail[0]);

      if (mode === "edit") {
        submitFormData.append("is_change_thumbnail", "true");
      }
    } else if (mode === "edit") {
      submitFormData.append("is_change_thumbnail", "false");
    }

    if (projectImages && projectImages.length > 0) {
      Array.from(projectImages).forEach((file) => {
        submitFormData.append(`project_images`, file);
      });
    }


    // Append basic project information
    submitFormData.append("project_fullname", projectFullname);
    submitFormData.append("project_shortname", projectShortname);
    submitFormData.append("slug", slug);
    submitFormData.append("short_description", shortDescription);
    submitFormData.append("github_link", githubLink || "");
    submitFormData.append("demo_link", demoLink || "");
    submitFormData.append("article_body", convertTextRef.current);
    submitFormData.append("group_id", groupId?.toString() || "null");

    // Handle dates from date picker
    if (datePicked?.start && datePicked?.end) {
      submitFormData.append("start_date", datePicked.start.toString());
      submitFormData.append("end_date", datePicked.end.toString());
    }

    if (mode === "edit") {
      submitFormData.append("is_change_article", convertTextRef.current !== initArticle ? "true" : "false");
      submitFormData.append("remove_images", JSON.stringify(listRemoveImages));
    }

    setFormData(submitFormData);
  }, [projectFullname, projectShortname, slug, shortDescription, githubLink, demoLink, groupId, projectThumbnail, projectImages, datePicked, mode, initArticle, listRemoveImages]);

  /* HANDLE REMOVE IMAGE */
  const handleAddRemoveImage = (imageName: string) => {
    if (listRemoveImages.includes(imageName)) {
      setListRemoveImages((prev) => prev.filter((v) => v !== imageName));
    } else {
      setListRemoveImages((prev) => [...prev, imageName]);
    }
  };

  const handleOpenImageModal = (url: string, name: string, type: "thumbnail" | "image") => {
    setSelectedImage({ url, name, type });
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

  const handleProjectFullNameChange = useCallback((value: string) => {
    setProjectFullname(value);
  }, []);

  const handleProjectShortNameChange = useCallback((value: string) => {
    setProjectShortname(value);
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setShortDescription(value);
  }, []);

  const handleGithubLinkChange = useCallback((value: string) => {
    setGithubLink(value);
  }, []);

  const handleDemoLinkChange = useCallback((value: string) => {
    setDemoLink(value);
  }, []);

  const handleGroupSelection = useCallback((keys: any) => {
    const selectedKey = Array.from(keys)[0] as string;

    setGroupId(selectedKey ? parseInt(selectedKey) : null);
  }, []);

  // Effect to auto-generate slug from project name with debouncing
  useEffect(() => {
    if (projectFullname) {
      const debounceTimer = setTimeout(() => {
        const generatedSlug = generateSlug(projectFullname);

        setSlug(generatedSlug);
      }, 300); // 300ms debounce

      return () => clearTimeout(debounceTimer);
    }
  }, [projectFullname]);

  const selectedGroupKeys = useMemo(
    () => (groupId ? [groupId.toString()] : []),
    [groupId]
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
        placeholder="Write your project article here using Markdown..."
        uploadImage={handleUploadImage}
        onChange={handleEditorChange}
        onReady={handleEditorReady}
      />
    );
  }, [initialMarkdown, handleEditorChange, handleEditorReady, handleUploadImage]);

  const isLoading = submitting || (mode === "edit" && fetchingProjectDetail);

  /* STICKY SUBMIT BUTTON */
  const { scrollContainerRef } = useAdminScroll();
  const { scrollPosition } = useScroll({
    target: scrollContainerRef?.current || undefined
  });
  const submitButtonRef = useRef<HTMLDivElement>(null);
  const [isSubmitButtonVisible, setIsSubmitButtonVisible] = useState(true);

  useEffect(() => {
    if (submitButtonRef.current && scrollContainerRef?.current) {
      const buttonRect = submitButtonRef.current.getBoundingClientRect();
      const containerRect = scrollContainerRef.current.getBoundingClientRect();

      // Button is visible if it's within the scroll container's viewport
      const isVisible =
        buttonRect.top < containerRect.bottom &&
        buttonRect.bottom > containerRect.top;

      setIsSubmitButtonVisible(isVisible);
    }
  }, [scrollPosition, scrollContainerRef]);

  return (
    <div className="relative">
      <div ref={submitButtonRef}>
      <CustomForm
        className={"w-full h-max flex flex-col gap-4"}
        formId={`${mode}ProjectForm`}
        isLoading={isLoading}
        useCtrlSKey={true}
        useEnterKey={false}
        onSubmit={handleSubmit}
      >
        <div className={"w-full h-max flex flex-col gap-4"}>
          <h3 className={"text-xl font-semibold"}>Project Information</h3>
          <div className={"w-full grid grid-cols-3 gap-4"}>
            <Input
              isRequired
              className={"col-span-3"}
              label={"Full Project Name"}
              labelPlacement={"outside"}
              name={"project_fullname"}
              placeholder={"Enter project name..."}
              type={"text"}
              value={projectFullname}
              variant={"bordered"}
              onValueChange={handleProjectFullNameChange}
            />
            <Input
              isRequired
              label={"Short Project Name"}
              labelPlacement={"outside"}
              name={"project_shortname"}
              placeholder={"Enter short name of project"}
              type={"text"}
              value={projectShortname}
              variant={"bordered"}
              onValueChange={handleProjectShortNameChange}
            />
            <Input
              isReadOnly
              isRequired
              label={"Slug"}
              labelPlacement={"outside"}
              name={"slug"}
              placeholder={"URL-friendly version (auto-generated)"}
              type={"text"}
              value={slug}
              variant={"faded"}
            />
            <Select
              isLoading={fetchingProjectGroups}
              items={listProjectGroups}
              label={"Select group"}
              labelPlacement={"outside"}
              placeholder={"Select project group"}
              selectedKeys={selectedGroupKeys}
              variant={"bordered"}
              onSelectionChange={handleGroupSelection}>
              {(item) => (
                <SelectItem key={item.group_id}>{item.group_title}</SelectItem>
              )}
            </Select>
            <div className={"w-full col-span-3"}>
              <Textarea
                isRequired
                label={"Description"}
                labelPlacement={"outside"}
                name={"short_description"}
                placeholder={
                  mode === "create"
                    ? "Enter a brief description of your project..."
                    : ""
                }
                value={shortDescription}
                variant={"bordered"}
                onValueChange={handleDescriptionChange}
              />
            </div>
            <DateRangePicker
              isRequired
              aria-label={"Project duration"}
              label={mode === "create" ? "Project Duration" : "Start date"}
              labelPlacement={"outside"}
              value={datePicked}
              variant={"bordered"}
              onChange={setDatePicked}
            />
            <Input
              label={"Github"}
              labelPlacement={"outside"}
              name={"github_link"}
              placeholder={"Enter Github link"}
              type={"text"}
              value={githubLink || ""}
              variant={"bordered"}
              onValueChange={handleGithubLinkChange}
            />
            <Input
              label={"Demo"}
              labelPlacement={"outside"}
              name={"demo_link"}
              placeholder={"Enter Demo link"}
              type={"text"}
              value={demoLink || ""}
              variant={"bordered"}
              onValueChange={handleDemoLinkChange}
            />
            <div className={"col-span-3 grid grid-cols-2 gap-4"}>
              <Input
                accept={"image/*"}
                isRequired={mode === "create"}
                label={"Project Thumbnail"}
                labelPlacement={"outside"}
                name={"project_thumbnail"}
                placeholder={"Select thumbnail for project"}
                type={"file"}
                variant={"bordered"}
                onChange={(e) => {
                  setProjectThumbnail(
                    e.target.files && e.target.files.length > 0
                      ? e.target.files
                      : null
                  );
                }}
              />
              <Input
                accept={"image/*"}
                label={
                  mode === "create" ? "Project Images" : "List Project Images"
                }
                labelPlacement={"outside"}
                multiple={true}
                name={"project_images"}
                placeholder={
                  mode === "create"
                    ? "Select images for project"
                    : "Select thumbnail for project"
                }
                type={"file"}
                variant={"bordered"}
                onChange={(e) => {
                  setProjectImages(
                    e.target.files && e.target.files.length > 0
                      ? e.target.files
                      : null
                  );
                }}
              />
            </div>
          </div>
        </div>

        {mode === "edit" &&
          (currentThumbnail || listCurrentImages.length > 0) && (
            <>
              <Divider />
              <div className={"w-full flex flex-col gap-4"}>
                <h3 className={"text-lg font-semibold"}>Project Images</h3>
                <div className={"w-full grid grid-cols-6 gap-4"}>
                  {/* Current Thumbnail */}
                  {currentThumbnail && (
                    <ProjectImageComponent
                      className={"col-span-2 row-span-2"}
                      highlightColor={"success"}
                      imageName={`Project Thumbnail`}
                      imagePath={currentThumbnail}
                      isHighlighted={false}
                      isThumbnail={true}
                      onOpen={() =>
                        handleOpenImageModal(
                          currentThumbnail,
                          "Project Thumbnail",
                          "thumbnail"
                        )
                      }
                    />
                  )}

                  {/* Current Images */}
                  {listCurrentImages.map((image, index) => (
                    <ProjectImageComponent
                      key={`Photo ${index + 1}`}
                      highlightColor={"danger"}
                      imageName={`Photo ${index + 1}`}
                      imagePath={image.image_url}
                      isHighlighted={listRemoveImages.includes(
                        image.image_name
                      )}
                      isThumbnail={false}
                      onOpen={() =>
                        handleOpenImageModal(
                          image.image_url,
                          `Photo ${index + 1}`,
                          "image"
                        )
                      }
                      onRemove={() => handleAddRemoveImage(image.image_name)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        <Divider />
        <div className={"w-full flex flex-col gap-4"}>
          <h3 className={"text-lg font-semibold"}>Project Article</h3>
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
                  alt={selectedImage.name}
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
      {!isSubmitButtonVisible && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-default-200 shadow-lg">
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
      )}
      </div>
    </div>
  );
}
