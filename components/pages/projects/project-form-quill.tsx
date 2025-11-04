"use client";

import "react-quill-new/dist/quill.snow.css";
import {
	addToast,
	Button,
	Chip,
	DateRangePicker,
	Divider,
	Input,
	RangeValue,
	Select,
	SelectItem,
	Textarea,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	useDisclosure,
	Image,
} from "@heroui/react";
import clsx from "clsx";
import { ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DateValue, parseDate } from "@internationalized/date";
import moment from "moment";
import dynamic from "next/dynamic";
import { useFetch } from "hieutndev-toolkit";

import CustomForm from "@/components/shared/forms/custom-form";
import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { IAPIResponse } from "@/types/global";
import { TProjectGroup, TProjectImage, TProjectResponse, TNewProject, TUpdateProject } from "@/types/project";
import { formatDate } from "@/utils/date";
import { generateSlug, isValidSlug } from "@/utils/slug";


import "@writergate/quill-image-uploader-nextjs/dist/quill.imageUploader.min.css";

// TypeScript interface for ReactQuill props
interface ReactQuillProps {
	modules?: any;
	formats?: string[];
	value?: string;
	onChange?: (value: string) => void;
	className?: string;
	placeholder?: string;
	theme?: string;
	forwardedRef?: any;
}

const ReactQuill = dynamic(
	async () => {
		const ImageUploader = require("@writergate/quill-image-uploader-nextjs").default;
		const { default: RQ, Quill } = await import("react-quill-new");

		Quill.register("modules/imageUploader", ImageUploader);

		// return ({ forwardedRef, ...props }: ReactQuillProps) => (
		// 	<RQ
		// 		ref={forwardedRef}
		// 		{...props}
		// 	/>
		// );

		const QuillComponent = ({ forwardedRef, ...props }: ReactQuillProps) => (
			<RQ
				ref={forwardedRef}
				{...props}
			/>
		);

		QuillComponent.displayName = "QuillComponent";

		return QuillComponent;
	},
	{
		ssr: false,
		loading: () => (
			<div className="h-[200px] border border-default-200 rounded-lg flex items-center justify-center">
				<div className="text-default-500">Loading editor...</div>
			</div>
		),
	}
) as ComponentType<ReactQuillProps>;

interface ProjectFormQuillProps {
	mode: "create" | "edit";
	defaultValues?: TProjectResponse;
	projectId?: number | string;
}

export default function ProjectFormQuillComponent({ mode, defaultValues, projectId }: ProjectFormQuillProps) {
	const router = useRouter();
	const [initArticle, setInitArticle] = useState("");
	const [convertText, setConvertText] = useState<string>("");
	const [projectDetails, setProjectDetails] = useState<TNewProject | TUpdateProject>({
		project_fullname: "",
		project_shortname: "",
		slug: "",
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

	const [listProjectGroups, setListProjectGroups] = useState<TProjectGroup[]>([]);
	const [currentThumbnail, setCurrentThumbnail] = useState<string>("");
	const [listCurrentImages, setListCurrentImages] = useState<TProjectImage[]>([]);
	const [listRemoveImages, setListRemoveImages] = useState<string[]>([]);

	// Modal state for image management
	const { isOpen: isImageModalOpen, onOpen: onImageModalOpen, onClose: onImageModalClose } = useDisclosure();
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

	// Effect to auto-generate slug from project name
	useEffect(() => {
		if (projectDetails.project_fullname) {
			const generatedSlug = generateSlug(projectDetails.project_fullname);

			setProjectDetails((prev) => ({
				...prev,
				slug: generatedSlug,
			}));
		}
	}, [projectDetails.project_fullname]);

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
		// error: fetchProjectDetailError,
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
		if (mode === "edit" && fetchProjectDetailResult && fetchProjectDetailResult.results) {
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
			setConvertText(projectData.article_body);
			setInitArticle(projectData.article_body);

			// Set the date picker with the actual project dates
			setDatePicked({
				start: parseDate(formatDate(projectData.start_date, "onlyDateReverse")),
				end: parseDate(formatDate(projectData.end_date, "onlyDateReverse")),
			});
		} else if (mode === "create" && defaultValues) {
			// If we have default values for create mode
			setProjectDetails({
				...defaultValues,
				project_thumbnail: null,
				project_images: null,
			});
			setConvertText(defaultValues.article_body || "");
		}
	}, [mode, fetchProjectDetailResult, defaultValues]);

	/* HANDLE SUBMIT */
	const [formData, setFormData] = useState<FormData | null>(null);

	const {
		data: submitResult,
		error: submitError,
		loading: submitting,
		fetch: submitForm,
	} = useFetch(mode === "create" ? API_ROUTE.PROJECT.NEW : API_ROUTE.PROJECT.UPDATE_PROJECT(projectId!), {
		method: mode === "create" ? "POST" : "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (submitResult) {
			addToast({
				title: "Success",
				description:
					submitResult.message || `Project ${mode === "create" ? "created" : "updated"} successfully`,
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
					description: MAP_MESSAGE[parseError.message],
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
			!projectDetails.slug ||
			!projectDetails.short_description
		) {
			addToast({
				title: "Error",
				description: "Please fill in all required fields",
				color: "danger",
			});

			return;
		}

		// Validate slug format
		if (!isValidSlug(projectDetails.slug)) {
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

		// Append basic project information
		submitFormData.append("project_fullname", projectDetails.project_fullname);
		submitFormData.append("project_shortname", projectDetails.project_shortname);
		submitFormData.append("slug", projectDetails.slug);
		submitFormData.append("short_description", projectDetails.short_description);
		submitFormData.append("github_link", projectDetails.github_link || "");
		submitFormData.append("demo_link", projectDetails.demo_link || "");
		submitFormData.append("article_body", convertText);
		submitFormData.append("group_id", projectDetails.group_id?.toString() || "null");

		// Handle dates from date picker
		if (datePicked?.start && datePicked?.end) {
			submitFormData.append("start_date", datePicked.start.toString());
			submitFormData.append("end_date", datePicked.end.toString());
		}

		// Handle file uploads
		if (projectDetails.project_thumbnail && projectDetails.project_thumbnail.length > 0) {
			submitFormData.append("project_thumbnail", projectDetails.project_thumbnail[0]);
			if (mode === "edit") {
				submitFormData.append("is_change_thumbnail", "true");
			}
		} else if (mode === "edit") {
			submitFormData.append("is_change_thumbnail", "false");
		}

		if (projectDetails.project_images && projectDetails.project_images.length > 0) {
			Array.from(projectDetails.project_images).forEach((file) => {
				submitFormData.append(`project_images`, file);
			});
		}

		// Handle edit-specific fields
		if (mode === "edit") {
			submitFormData.append("is_change_article", projectDetails.article_body !== initArticle ? "true" : "false");
			submitFormData.append("remove_images", JSON.stringify(listRemoveImages));
		}

		setFormData(submitFormData);
	};

	/* HANDLE PARSE DATE */
	const [datePicked, setDatePicked] = useState<RangeValue<DateValue> | null>({
		start: parseDate(moment().format("YYYY-MM-DD")),
		end: parseDate(moment().add(1, "days").format("YYYY-MM-DD")),
	});

	/* HANDLE REACT QUILL */
	const handleAddRemoveImage = (imageName: string) => {
		if (listRemoveImages.includes(imageName)) {
			setListRemoveImages((prev) => prev.filter((v) => v !== imageName));
		} else {
			setListRemoveImages((prev) => [...prev, imageName]);
		}
	};

	// Modal handlers
	const handleOpenImageModal = (url: string, name: string, type: "thumbnail" | "image") => {
		setSelectedImage({ url, name, type });
		onImageModalOpen();
	};

	const handleCloseImageModal = () => {
		setSelectedImage(null);
		onImageModalClose();
	};

	useEffect(() => {
		setProjectDetails((prev) => ({ ...prev, article_body: convertText }));
	}, [convertText]);

	// Define upload function for imageUploader
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

	const handleUploadImage = async (file: File) => {
		const formData = new FormData();

		formData.append("image", file);
		await uploadImage({ body: formData });

		return new Promise((resolve, reject) => {
			let retry = 20;
			const checkResult = () => {
				const result = uploadImageResultRef.current;
				const error = uploadImageErrorRef.current;

				console.log("result", result);
				console.log("error", error);
				if (!error && result && result.results && result.results.imageKey) {
					resolve(process.env.NEXT_PUBLIC_BASE_API_URL + API_ROUTE.S3.GET_IMAGE(result.results.imageKey));
				} else if (error) {
					reject(error);
				} else if (retry > 0) {
					retry--;
					setTimeout(checkResult, 250);
				} else {
					reject(new Error("Image upload timed out."));
				}
			};

			checkResult();
		}).finally(() => {
			uploadImageResultRef.current = null;
		});
	};

	// Configure Quill modules with imageUploader
	const customModules = useMemo(
		() => ({
			toolbar: {
				container: [
					[{ header: [1, 2, 3, false] }],
					["bold", "italic", "underline", "strike"],
					[{ color: [] }, { background: [] }],
					[{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
					["blockquote", "code-block"],
					["link", "image", "video"],
					[{ align: [] }],
					["clean"], // remove formatting button
				],
			},
			imageUploader: {
				upload: handleUploadImage,
				newComment: () => Promise.resolve(),
				showComments: () => Promise.resolve([]),
			},
			clipboard: {
				// toggle to add extra line breaks when pasting HTML:
				matchVisual: false,
			},
			history: {
				delay: 2000,
				maxStack: 500,
				userOnly: true,
			},
		}),
		[]
	);

	const formats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"color",
		"background",
		"list",
		"indent",
		"blockquote",
		"code-block",
		"link",
		"image",
		"video",
		"align",
		"imageBlot",
	];

	// Add ref for ReactQuill
	const reactQuillRef = useRef<any>(null);

	const isLoading = submitting || (mode === "edit" && fetchingProjectDetail);

	return (
		<div className={"w-full border border-default-200 bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-4"}>
			<CustomForm
				className={"w-full flex flex-col gap-4"}
				formId={`${mode}ProjectForm`}
				isLoading={isLoading}
				onSubmit={handleSubmit}
			>
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
								setProjectDetails((prev) => ({ ...prev, project_fullname: value }))
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
							onValueChange={(e) => setProjectDetails((prev) => ({ ...prev, project_shortname: e }))}
						/>
						<Input
							isReadOnly
							isRequired
							label={"Slug"}
							labelPlacement={"outside"}
							name={"slug"}
							placeholder={"URL-friendly version (auto-generated)"}
							type={"text"}
							value={projectDetails.slug}
							variant={"bordered"}
						/>
						<Select
							isLoading={fetchingProjectGroups}
							items={listProjectGroups}
							label={"Select group"}
							labelPlacement={"outside"}
							placeholder={"Select project group"}
							selectedKeys={projectDetails.group_id ? [projectDetails.group_id.toString()] : []}
							variant={"bordered"}
							onSelectionChange={(keys) => {
								const selectedKey = Array.from(keys)[0] as string;

								setProjectDetails((prev) => ({
									...prev,
									group_id: selectedKey ? parseInt(selectedKey) : null,
								}));
							}}
						>
							{(item) => <SelectItem key={item.group_id}>{item.group_title}</SelectItem>}
						</Select>
						<div className={"w-full col-span-3"}>
							<Textarea
								isRequired
								label={"Description"}
								labelPlacement={"outside"}
								name={"short_description"}
								placeholder={mode === "create" ? "Enter a brief description of your project..." : ""}
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
											e.target.files && e.target.files.length > 0 ? e.target.files : null,
									}));
								}}
							/>
							<Input
								accept={"image/*"}
								label={mode === "create" ? "Project Images" : "List Project Images"}
								labelPlacement={"outside"}
								multiple={true}
								name={"project_images"}
								placeholder={
									mode === "create" ? "Select images for project" : "Select thumbnail for project"
								}
								type={"file"}
								variant={"bordered"}
								onChange={(e) => {
									setProjectDetails((prev) => ({
										...prev,
										project_images:
											e.target.files && e.target.files.length > 0 ? e.target.files : null,
									}));
								}}
							/>
						</div>
					</div>
				</div>

				{mode === "edit" && (currentThumbnail || listCurrentImages.length > 0) && (
					<>
						<Divider />
						<div className={"w-full flex flex-col gap-2"}>
							<h3 className={"text-lg font-semibold"}>Project Images</h3>
							<div className={"w-full flex flex-row flex-wrap gap-4"}>
								{/* Current Thumbnail */}
								{currentThumbnail && (
									<div className={"relative group cursor-pointer col-span-3"}>
										<div
											className={
												"bg-transparent relative border-2 rounded-xl overflow-hidden border-success-300 hover:border-success-500 transition-colors"
											}
										>
											<div className={"absolute top-1 right-1 z-[20]"}>
												<Chip
													color={"success"}
													size="sm"
													variant="solid"
												>
													Thumbnail
												</Chip>
											</div>
											<Image
												isBlurred
												alt={"Project Thumbnail"}
												className={
													"object-cover w-max group-hover:scale-105 transition-transform"
												}
												height={156}
												isZoomed={false}
												shadow={"sm"}
												src={currentThumbnail}
												onClick={() =>
												handleOpenImageModal(currentThumbnail, "Project Thumbnail", "thumbnail")
											}
											/>
										</div>
										<p className={"text-xs text-center mt-1 text-foreground-600"}>
											Current Thumbnail
										</p>
									</div>
								)}

								{/* Current Images */}
								{listCurrentImages.map((image, index) => (
									<div
										key={index}
										className={"relative group cursor-pointer"}
									>
										<div
											className={clsx(
												"relative border-2 rounded-xl overflow-hidden transition-colors w-max",
												{
													"border-danger-300 hover:border-danger-500":
														listRemoveImages.includes(image.image_name),
													"border-default-200 hover:border-default-400":
														!listRemoveImages.includes(image.image_name),
												}
											)}
										>
											<Image
												isBlurred
												alt={image.image_name}
												className={
													"object-cover w-max group-hover:scale-105 transition-transform"
												}
												height={156}
												isZoomed={false}
												shadow={"sm"}
												src={image.image_url}
												onClick={() =>
												handleOpenImageModal(image.image_url, image.image_name, "image")
											}
											/>
											{/* <div
												className={""}
												> */}
												<Button
													isIconOnly
													className={"absolute top-1 right-1 z-10 opacity-80 hover:opacity-100"}
													color={"danger"}
													size={"sm"}
													variant="solid"
													onPress={() => handleAddRemoveImage(image.image_name)}
												>
													{ICON_CONFIG.SOFT_DELETE}
												</Button>
											{/* </div> */}
											{listRemoveImages.includes(image.image_name) && (
												<div
													className={
														"absolute inset-0 bg-danger-200/50 flex items-center justify-center"
													}
												>
													<Chip
														color={"danger"}
														size="sm"
														variant="solid"
													>
														Will Remove
													</Chip>
												</div>
											)}
										</div>
										<p className={"text-xs text-center mt-1 text-foreground-600 truncate"}>
											Photo {index + 1}
										</p>
									</div>
								))}
							</div>
						</div>
					</>
				)}
				<Divider />
				<div className={"w-full flex flex-col gap-2"}>
					<h3 className={"text-lg font-semibold"}>Project Article</h3>
					<div>
						<p className={"text-sm text-foreground pb-1.5 block"}>Article Content</p>
						<ReactQuill
							formats={formats}
							forwardedRef={reactQuillRef}
							modules={customModules}
							placeholder={"Write your project article here..."}
							theme={"snow"}
							value={convertText}
							onChange={setConvertText}
						/>
					</div>
				</div>
			</CustomForm>

			<Modal
				hideCloseButton
				isOpen={isImageModalOpen}
				size="5xl"
				onClose={handleCloseImageModal}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<div className={"flex items-center gap-2"}>
									<h3 className={"text-xl font-semibold"}>
										{"Photo of " + projectDetails.project_shortname}
									</h3>
								</div>
							</ModalHeader>
							<ModalBody>
								{selectedImage && (
									<div className={"flex justify-center"}>
										<Image
											isBlurred
											alt={selectedImage.name}
											className={"object-contain"}
											height={512}
											shadow={"sm"}
											src={selectedImage.url}
										/>
									</div>
								)}
							</ModalBody>
							<ModalFooter>
								<div className={"flex justify-end items-center w-full"}>
									<Button
										color={"danger"}
										variant={"flat"}
										onPress={onClose}
									>
										Close
									</Button>
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
