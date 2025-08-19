"use client";

import dynamic from "next/dynamic";
import { forwardRef, useRef } from "react";
import { type MDXEditorMethods, type MDXEditorProps } from "@mdxeditor/editor";
import {
  addToast,
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DateValue, parseDate } from "@internationalized/date";
import moment from "moment";

import ProjectImageComponent from "./project-image";

import CustomForm from "@/components/shared/forms/custom-form";
import API_ROUTE from "@/configs/api";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { useFetch } from "@/hooks/useFetch";
import { IAPIResponse } from "@/types/global";
import {
  TProjectGroup,
  TProjectImage,
  TProjectResponse,
  TNewProject,
  TUpdateProject,
} from "@/types/project";
import { formatDate } from "@/utils/date";
import { SAMPLE_MARKDOWN } from "@/utils/sample-data/markdown-editor";

// Dynamic import for MDXEditor with SSR disabled
const Editor = dynamic(() => import("./mdx-editor-initialized"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] border border-default-200 rounded-lg flex items-center justify-center">
      <div className="text-default-500">Initialize editor...</div>
    </div>
  ),
});

// Forward ref editor component with ready state handling
const ForwardRefEditor = forwardRef<
  MDXEditorMethods,
  MDXEditorProps & {
    onEditorReady?: () => void;
    imageUploadHandler?: (file: File) => Promise<string>;
  }
>((props, ref) => {
  const { onEditorReady, imageUploadHandler, ...editorProps } = props;

  useEffect(() => {
    // Mark editor as ready after a short delay to ensure it's fully mounted
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

// Function to sanitize markdown content to prevent parsing errors
const sanitizeMarkdown = (content: string): string => {
  if (!content) return "";

  try {
    // Fix common markdown parsing issues
    let sanitized = content;

    // Fix code blocks without language specification
    sanitized = sanitized.replace(/```(\s*\n)/g, "```txt$1");

    // Fix malformed code blocks
    sanitized = sanitized.replace(
      /```(\w*)\s*\n([\s\S]*?)```/g,
      (match, lang, code) => {
        const cleanLang = lang || "txt";

        return `\`\`\`${cleanLang}\n${code}\`\`\``;
      }
    );

    // Remove any problematic characters that might cause parsing issues
    sanitized = sanitized.replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g,
      ""
    );

    return sanitized;
  } catch (error) {
    console.error("Error sanitizing markdown:", error);

    // Return a safe fallback
    return "# Content Error\n\nThere was an issue loading the content. Please edit in source mode to fix any formatting issues.";
  }
};

interface ProjectFormMarkDownProps {
  mode: "create" | "edit";
  defaultValues?: TProjectResponse;
  projectId?: string;
}

export default function ProjectFormMarkDownComponent({
  mode,
  defaultValues,
  projectId,
}: ProjectFormMarkDownProps) {
  const router = useRouter();
  const mdxEditorRef = useRef<MDXEditorMethods>(null);
  const [initArticle, setInitArticle] = useState("");
  const [convertText, setConvertText] = useState<string>("");
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [pendingContent, setPendingContent] = useState<string>("");
  const [projectDetails, setProjectDetails] = useState<
    TNewProject | TUpdateProject
  >({
    project_fullname: "",
    project_shortname: "",
    start_date: "",
    end_date: "",
    project_thumbnail: null,
    short_description: "",
    article_body: "",
    group_id: null,
    github_link: "",
    demo_link: "",
    project_images: null,
  });

  const [listProjectGroups, setListProjectGroups] = useState<TProjectGroup[]>(
    []
  );
  const [currentThumbnail, setCurrentThumbnail] = useState<string>("");
  const [listCurrentImages, setListCurrentImages] = useState<TProjectImage[]>(
    []
  );
  const [listRemoveImages, setListRemoveImages] = useState<string[]>([]);

  // Modal state for image management
  const {
    isOpen: isImageModalOpen,
    onOpen: onImageModalOpen,
    onClose: onImageModalClose,
  } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    name: string;
    type: "thumbnail" | "image";
  } | null>(null);

  /* HANDLE FETCH PROJECT GROUPS */
  const {
    data: fetchProjectGroupsResult,
    error: fetchProjectGroupsError,
    loading: fetchingProjectGroups,
    fetch: fetchProjectGroups,
  } = useFetch<IAPIResponse<TProjectGroup[]>>(API_ROUTE.PROJECT.GET_ALL_GROUP);

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
    mode === "edit" && projectId
      ? API_ROUTE.PROJECT.GET_ONE(parseInt(projectId))
      : "",
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
    if (
      mode === "edit" &&
      fetchProjectDetailResult &&
      fetchProjectDetailResult.results
    ) {
      const projectData = fetchProjectDetailResult.results;

      setProjectDetails({
        ...projectData,
        start_date: formatDate(projectData.start_date, "onlyDateReverse"),
        end_date: formatDate(projectData.end_date, "onlyDateReverse"),
        project_thumbnail: null,
        project_images: null,
      });

      setCurrentThumbnail(projectData.project_thumbnail);
      setListCurrentImages(projectData.project_images);

      const articleContent = sanitizeMarkdown(projectData.article_body || "");

      setPendingContent(articleContent);
      setInitArticle(articleContent);

      if (isEditorReady) {
        setConvertText(articleContent);
      }

      setDatePicked({
        start: parseDate(formatDate(projectData.start_date, "onlyDateReverse")),
        end: parseDate(formatDate(projectData.end_date, "onlyDateReverse")),
      });
    } else if (mode === "create" && defaultValues) {

      setProjectDetails({
        ...defaultValues,
        project_thumbnail: null,
        project_images: null,
      });

      const content = sanitizeMarkdown(
        defaultValues.article_body || SAMPLE_MARKDOWN
      );

      setPendingContent(content);

      if (isEditorReady) {
        setConvertText(content);
      }

    } else if (mode === "create") {
      // For completely new projects, use sample markdown
      const content = sanitizeMarkdown(SAMPLE_MARKDOWN);

      setPendingContent(content);
      if (isEditorReady) {
        setConvertText(content);
      }
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
  }, [mode, fetchProjectDetailResult, fetchProjectDetailError, defaultValues, isEditorReady]);

  /* HANDLE SUBMIT */
  const [formData, setFormData] = useState<FormData | null>(null);

  const {
    data: submitResult,
    error: submitError,
    loading: submitting,
    fetch: submitForm,
  } = useFetch(
    mode === "create"
      ? API_ROUTE.PROJECT.NEW
      : API_ROUTE.PROJECT.UPDATE_PROJECT(parseInt(projectId!)),
    {
      method: mode === "create" ? "POST" : "PATCH",
      skip: true,
    }
  );

  useEffect(() => {
    if (submitResult) {
      addToast({
        title: "Success",
        description:
          submitResult.message ||
          `Project ${mode === "create" ? "created" : "updated"} successfully`,
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

  const handleSubmit = () => {
    // Validate required fields
    if (
      !projectDetails.project_fullname ||
      !projectDetails.project_shortname ||
      !projectDetails.short_description
    ) {
      addToast({
        title: "Error",
        description: "Please fill in all required fields",
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
    if (mode === "create" && !projectDetails.project_thumbnail) {
       addToast({
        title: "Error",
        description: "Please upload a project thumbnail",
        color: "danger",
      });

      return;
    } else if (
      projectDetails.project_thumbnail &&
      projectDetails.project_thumbnail.length > 0
    ) {
      submitFormData.append(
        "project_thumbnail",
        projectDetails.project_thumbnail[0]
      );
      if (mode === "edit") {
        submitFormData.append("is_change_thumbnail", "true");
      }
    } else if (mode === "edit") {
      submitFormData.append("is_change_thumbnail", "false");
    }

    if (
      projectDetails.project_images &&
      projectDetails.project_images.length > 0
    ) {
      Array.from(projectDetails.project_images).forEach((file) => {
        submitFormData.append(`project_images`, file);
      });
    }


    // Append basic project information
    submitFormData.append("project_fullname", projectDetails.project_fullname);
    submitFormData.append(
      "project_shortname",
      projectDetails.project_shortname
    );
    submitFormData.append(
      "short_description",
      projectDetails.short_description
    );
    submitFormData.append("github_link", projectDetails.github_link || "");
    submitFormData.append("demo_link", projectDetails.demo_link || "");
    submitFormData.append("article_body", convertText);
    submitFormData.append(
      "group_id",
      projectDetails.group_id?.toString() || "null"
    );

    // Handle dates from date picker
    if (datePicked?.start && datePicked?.end) {
      submitFormData.append("start_date", datePicked.start.toString());
      submitFormData.append("end_date", datePicked.end.toString());
    }



    // Handle edit-specific fields
    if (mode === "edit") {
      submitFormData.append(
        "is_change_article",
        projectDetails.article_body !== initArticle ? "true" : "false"
      );
      submitFormData.append("remove_images", JSON.stringify(listRemoveImages));
    }

    setFormData(submitFormData);
  };

  /* HANDLE PARSE DATE */
  const [datePicked, setDatePicked] = useState<RangeValue<DateValue> | null>({
    start: parseDate(moment().format("YYYY-MM-DD")),
    end: parseDate(moment().add(1, "days").format("YYYY-MM-DD")),
  });

  /* HANDLE REMOVE IMAGE */
  const handleAddRemoveImage = (imageName: string) => {
    if (listRemoveImages.includes(imageName)) {
      setListRemoveImages((prev) => prev.filter((v) => v !== imageName));
    } else {
      setListRemoveImages((prev) => [...prev, imageName]);
    }
  };

  // Modal handlers
  const handleOpenImageModal = (
    url: string,
    name: string,
    type: "thumbnail" | "image"
  ) => {
    setSelectedImage({ url, name, type });
    onImageModalOpen();
  };

  const handleCloseImageModal = () => {
    setSelectedImage(null);
    onImageModalClose();
  };

  // Handle editor ready state and set pending content
  useEffect(() => {
    if (isEditorReady && pendingContent) {
      console.log("Setting editor content:", {
        pendingContent,
        convertText,
        isEditorReady,
      });
      try {
        const sanitizedContent = sanitizeMarkdown(pendingContent);

        setConvertText(sanitizedContent);
        setPendingContent(""); // Clear pending content after setting
      } catch (error) {
        console.error("Error setting editor content:", error);
        // Fallback to empty content if there's an error
        setConvertText("");
        setPendingContent("");
      }
    }
  }, [isEditorReady, pendingContent]);

  // Fallback: Force set content after a delay if editor is loaded but content is still empty
  useEffect(() => {
    if (mode === "edit" && isEditorReady && !convertText && initArticle) {
      console.log("Fallback: Setting content from initArticle:", initArticle);
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

  // Image upload functionality for MDX Editor
  const {
    data: uploadImageResult,
    error: uploadImageError,
    // loading: uploadingImage,
    fetch: uploadImage,
  } = useFetch(API_ROUTE.S3.UPLOAD_IMAGE, {
    method: "POST",
    skip: true,
    options: {
      removeContentType: true,
    },
  });

  const uploadImageResultRef = useRef(uploadImageResult);
  const uploadImageErrorRef = useRef(uploadImageError);

  useEffect(() => {
    if (uploadImageResult) {
      uploadImageResultRef.current = uploadImageResult;
    }

    if (uploadImageError) {
      uploadImageErrorRef.current = uploadImageError;
    }
  }, [uploadImageResult, uploadImageError]);

  const handleUploadImage = async (file: File): Promise<string> => {
    try {
      // Show upload toast
      addToast({
        title: "Uploading Image",
        description: `Uploading ${file.name}...`,
        color: "primary",
      });

      const formData = new FormData();

      formData.append("image", file);
      await uploadImage({ body: formData });

      return new Promise<string>((resolve, reject) => {
        let retry = 20;
        const checkResult = () => {
          const result = uploadImageResultRef.current;
          const error = uploadImageErrorRef.current;

          console.log("Image upload result:", result);
          console.log("Image upload error:", error);

          if (!error && result && result.results && result.results.imageKey) {
            const imageUrl =
              process.env.NEXT_PUBLIC_BASE_API_URL +
              API_ROUTE.S3.GET_IMAGE(result.results.imageKey);

            // Show success toast
            addToast({
              title: "Image Uploaded",
              description: "Image uploaded successfully!",
              color: "success",
            });

            resolve(imageUrl);
          } else if (error) {
            // Show error toast
            addToast({
              title: "Upload Failed",
              description: "Failed to upload image. Please try again.",
              color: "danger",
            });
            reject(error);
          } else if (retry > 0) {
            retry--;
            setTimeout(checkResult, 250);
          } else {
            // Show timeout error toast
            addToast({
              title: "Upload Timeout",
              description: "Image upload timed out. Please try again.",
              color: "danger",
            });
            reject(new Error("Image upload timed out."));
          }
        };

        checkResult();
      }).finally(() => {
        uploadImageResultRef.current = null;
      });
    } catch (error) {
      // Show general error toast
      addToast({
        title: "Upload Error",
        description: "An error occurred while uploading the image.",
        color: "danger",
      });
      throw error;
    }
  };

  useEffect(() => {
    setProjectDetails((prev) => ({ ...prev, article_body: convertText }));
  }, [convertText]);

  const isLoading = submitting || (mode === "edit" && fetchingProjectDetail);

  return (
    <div
      className={
        "w-full border border-default-200 bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-4"
      }>
      <CustomForm
        className={"w-full flex flex-col gap-4"}
        formId={`${mode}ProjectForm`}
        isLoading={isLoading}
        useCtrlSKey={true}
        useEnterKey={false}
        onSubmit={handleSubmit}>
        <div className={"w-full flex flex-col gap-2"}>
          <h3 className={"text-xl font-semibold"}>Project Information</h3>
          <div className={"w-full grid grid-cols-3 gap-4"}>
            <Input
              isRequired
              label={"Full Project Name"}
              labelPlacement={"outside"}
              name={"project_fullname"}
              placeholder={"Enter project name..."}
              type={"text"}
              value={projectDetails.project_fullname}
              variant={"bordered"}
              onValueChange={(value) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  project_fullname: value,
                }))
              }
            />
            <Input
              isRequired
              label={"Short Project Name"}
              labelPlacement={"outside"}
              name={"project_shortname"}
              placeholder={"Enter short name of project"}
              type={"text"}
              value={projectDetails.project_shortname}
              variant={"bordered"}
              onValueChange={(e) =>
                setProjectDetails((prev) => ({ ...prev, project_shortname: e }))
              }
            />
            <Select
              isLoading={fetchingProjectGroups}
              items={listProjectGroups}
              label={"Select group"}
              labelPlacement={"outside"}
              placeholder={"Select project group"}
              selectedKeys={
                projectDetails.group_id
                  ? [projectDetails.group_id.toString()]
                  : []
              }
              variant={"bordered"}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;

                setProjectDetails((prev) => ({
                  ...prev,
                  group_id: selectedKey ? parseInt(selectedKey) : null,
                }));
              }}>
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
                value={projectDetails.short_description}
                variant={"bordered"}
                onValueChange={(e) =>
                  setProjectDetails((prev) => ({
                    ...prev,
                    short_description: e,
                  }))
                }
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
              value={projectDetails.github_link || ""}
              variant={"bordered"}
              onValueChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  github_link: e,
                }))
              }
            />
            <Input
              label={"Demo"}
              labelPlacement={"outside"}
              name={"demo_link"}
              placeholder={"Enter Demo link"}
              type={"text"}
              value={projectDetails.demo_link || ""}
              variant={"bordered"}
              onValueChange={(e) =>
                setProjectDetails((prev) => ({
                  ...prev,
                  demo_link: e,
                }))
              }
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
                  setProjectDetails((prev) => ({
                    ...prev,
                    project_thumbnail:
                      e.target.files && e.target.files.length > 0
                        ? e.target.files
                        : null,
                  }));
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
                  setProjectDetails((prev) => ({
                    ...prev,
                    project_images:
                      e.target.files && e.target.files.length > 0
                        ? e.target.files
                        : null,
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {mode === "edit" &&
          (currentThumbnail || listCurrentImages.length > 0) && (
            <>
              <Divider />
              <div className={"w-full flex flex-col gap-2"}>
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
        <div className={"w-full flex flex-col gap-2"}>
          <h3 className={"text-lg font-semibold"}>Project Article</h3>
          <div className="w-full">
            <p className="text-sm text-foreground pb-1.5 block">
              Article Content
            </p>
            <div className="border border-default-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <ForwardRefEditor
                key={`mdx-editor-${mode}-${projectId || "new"}-${convertText ? "with-content" : "empty"}`}
                ref={mdxEditorRef}
                className="min-h-[400px] w-full"
                imageUploadHandler={handleUploadImage}
                markdown={convertText}
                placeholder="Write your project article here using Markdown..."
                onChange={setConvertText}
                onEditorReady={() => setIsEditorReady(true)}
              />
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
    </div>
  );
}
