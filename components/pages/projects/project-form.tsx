"use client";

import "react-quill-new/dist/quill.snow.css";
import Container from "@/components/shared/container/container";
import CustomForm from "@/components/shared/forms/custom-form";
import AdminHeader from "@/components/shared/partials/admin-header";
import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { useFetch } from "@/hooks/useFetch";
import { IAPIResponse } from "@/types/global";
import { TProjectGroup, TProjectImage, TProjectResponse, TNewProject, TUpdateProject } from "@/types/project";
import { formatDate } from "@/utils/date";
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
} from "@heroui/react";
import clsx from "clsx";
import { ComponentType, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { DateValue, parseDate } from "@internationalized/date";
import moment from "moment";
import dynamic from "next/dynamic";
import "@writergate/quill-image-uploader-nextjs/dist/quill.imageUploader.min.css";
import Image from "next/image";

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
		return ({ forwardedRef, ...props }: ReactQuillProps) => (
			<RQ
				ref={forwardedRef}
				{...props}
			/>
		);
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

interface ProjectFormProps {
	mode: "create" | "edit";
	defaultValues?: TProjectResponse;
	projectId?: string;
}

export default function ProjectFormComponent({ mode, defaultValues, projectId }: ProjectFormProps) {
	const router = useRouter();
	const [initArticle, setInitArticle] = useState("");
	const [convertText, setConvertText] = useState<string>("");
	const [projectDetails, setProjectDetails] = useState<TNewProject | TUpdateProject>({
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

	const [listProjectGroups, setListProjectGroups] = useState<TProjectGroup[]>([]);
	const [currentThumbnail, setCurrentThumbnail] = useState<string>("");
	const [listCurrentImages, setListCurrentImages] = useState<TProjectImage[]>([]);
	const [listRemoveImages, setListRemoveImages] = useState<string[]>([]);

	// Modal state for image management
	const { isOpen: isImageModalOpen, onOpen: onImageModalOpen, onClose: onImageModalClose } = useDisclosure();
	const [selectedImage, setSelectedImage] = useState<{ url: string; name: string; type: 'thumbnail' | 'image' } | null>(null);

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

		// Append basic project information
		submitFormData.append("project_fullname", projectDetails.project_fullname);
		submitFormData.append("project_shortname", projectDetails.project_shortname);
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
			Array.from(projectDetails.project_images).forEach((file, index) => {
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
	const handleOpenImageModal = (url: string, name: string, type: 'thumbnail' | 'image') => {
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
		loading: uploadingImage,
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
		<Container
			orientation={"vertical"}
			className={"gap-4"}
		>
			<AdminHeader
				title={mode === "create" ? "Create New Project" : "Edit Project Information"}
				backButton={{
					color: "default",
					size: "lg",
					variant: "solid",
					startContent: ICON_CONFIG.BACK,
					text: "Back",
					href: ROUTE_PATH.ADMIN.PROJECT.INDEX,
				}}
				breadcrumbs={["Projects", mode === "create" ? "Create New" : "Edit"]}
			/>
			<div className={"w-full border border-default-200 bg-white rounded-2xl shadow-lg p-4 flex flex-col gap-4"}>
				<CustomForm
					formId={`${mode}ProjectForm`}
					className={"w-full flex flex-col gap-4"}
					isLoading={isLoading}
					onSubmit={handleSubmit}
				>
					<h2 className={"text-2xl font-semibold"}>Project Information</h2>
					<Divider />
					<div className={"grid grid-cols-3 gap-x-4 gap-y-8"}>
						<Input
							label={"Full Project Name"}
							labelPlacement={"outside"}
							type={"text"}
							value={projectDetails.project_fullname}
							name={"project_fullname"}
							placeholder={"Enter project name..."}
							size={"lg"}
							isRequired
							onValueChange={(value) =>
								setProjectDetails((prev) => ({ ...prev, project_fullname: value }))
							}
						/>
						<Input
							label={"Short Project Name"}
							type={"text"}
							size={"lg"}
							value={projectDetails.project_shortname}
							name={"project_shortname"}
							labelPlacement={"outside"}
							placeholder={"Enter short name of project"}
							isRequired
							onValueChange={(e) => setProjectDetails((prev) => ({ ...prev, project_shortname: e }))}
						/>
						<Select
							label={"Select group"}
							labelPlacement={"outside"}
							placeholder={"Select project group"}
							selectedKeys={projectDetails.group_id ? [projectDetails.group_id.toString()] : []}
							items={listProjectGroups}
							size={"lg"}
							isLoading={fetchingProjectGroups}
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
								label={"Description"}
								labelPlacement={"outside"}
								value={projectDetails.short_description}
								name={"short_description"}
								placeholder={mode === "create" ? "Enter a brief description of your project..." : ""}
								isRequired
								onValueChange={(e) =>
									setProjectDetails((prev) => ({
										...prev,
										short_description: e,
									}))
								}
							/>
						</div>
						<DateRangePicker
							label={mode === "create" ? "Project Duration" : "Start date"}
							labelPlacement={"outside"}
							value={datePicked}
							onChange={setDatePicked}
							aria-label={mode === "create" ? "Project duration" : "Start date"}
							isRequired
						/>
						<Input
							label={"Github"}
							labelPlacement={"outside"}
							placeholder={"Enter Github link"}
							type={"text"}
							value={projectDetails.github_link || ""}
							name={"github_link"}
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
							placeholder={"Enter Demo link"}
							type={"text"}
							value={projectDetails.demo_link || ""}
							name={"demo_link"}
							onValueChange={(e) =>
								setProjectDetails((prev) => ({
									...prev,
									demo_link: e,
								}))
							}
						/>
						<div className={"col-span-3 grid grid-cols-2 gap-4"}>
							<Input
								type={"file"}
								label={"Project Thumbnail"}
								labelPlacement={"outside"}
								placeholder={"Select thumbnail for project"}
								name={"project_thumbnail"}
								accept="image/*"
								onChange={(e) => {
									setProjectDetails((prev) => ({
										...prev,
										project_thumbnail:
											e.target.files && e.target.files.length > 0 ? e.target.files : null,
									}));
								}}
							/>
							<Input
								label={mode === "create" ? "Project Images" : "List Project Images"}
								labelPlacement={"outside"}
								name={"project_images"}
								type={"file"}
								placeholder={
									mode === "create" ? "Select images for project" : "Select thumbnail for project"
								}
								multiple={true}
								accept="image/*"
								onChange={(e) => {
									setProjectDetails((prev) => ({
										...prev,
										project_images:
											e.target.files && e.target.files.length > 0 ? e.target.files : null,
									}));
								}}
							/>
						</div>
						<div className={"col-span-3 w-full"}>
							<p className={"text-sm text-foreground pb-1.5 block"}>Article Content</p>
							<ReactQuill
								forwardedRef={reactQuillRef}
								value={convertText}
								onChange={setConvertText}
								modules={customModules}
								formats={formats}
								theme="snow"
								placeholder={
									mode === "create"
										? "Write your project article here..."
										: "Write your blog post here..."
								}
							/>
						</div>
					</div>
				</CustomForm>
				{mode === "edit" && (currentThumbnail || listCurrentImages.length > 0) && (
					<div className={"w-full shadow-xl rounded-2xl p-4 bg-white"}>
						<h3 className={"text-lg font-semibold mb-4"}>Current Project Images</h3>
						<div className={"w-full grid grid-cols-6 gap-4"}>
							{/* Current Thumbnail */}
							{currentThumbnail && (
								<div className={"relative group cursor-pointer"}>
									<div 
										className={"relative border-2 rounded-xl overflow-hidden border-success-300 hover:border-success-500 transition-colors"}
										onClick={() => handleOpenImageModal(currentThumbnail, "Project Thumbnail", "thumbnail")}
									>
										<div className={"absolute top-1 right-1 z-10"}>
											<Chip color={"success"} size="sm" variant="solid">Thumbnail</Chip>
										</div>
										<Image
											src={currentThumbnail}
											alt={"Project Thumbnail"}
											className={"object-cover aspect-square w-full h-32 group-hover:scale-105 transition-transform"}
											height={128}
											width={128}
										/>
									</div>
									<p className={"text-xs text-center mt-1 text-foreground-600"}>Current Thumbnail</p>
								</div>
							)}
							
							{/* Current Images */}
							{listCurrentImages.map((image, index) => (
								<div key={index} className={"relative group cursor-pointer"}>
									<div 
										className={clsx("relative border-2 rounded-xl overflow-hidden transition-colors", {
											"border-danger-300 hover:border-danger-500": listRemoveImages.includes(image.image_name),
											"border-default-200 hover:border-default-400": !listRemoveImages.includes(image.image_name),
										})}
										onClick={() => handleOpenImageModal(image.image_url, image.image_name, "image")}
									>
										<Image
											src={image.image_url}
											alt={image.image_name}
											className={"object-cover aspect-square w-full h-32 group-hover:scale-105 transition-transform"}
											height={128}
											width={128}
										/>
										<div
											className={"absolute top-1 right-1 z-10"}
											onClick={(e) => e.stopPropagation()}
										>
											<Button
												color={"danger"}
												size={"sm"}
												className={"opacity-80 hover:opacity-100"}
												isIconOnly
												variant="solid"
												onPress={() => handleAddRemoveImage(image.image_name)}
											>
												{ICON_CONFIG.SOFT_DELETE}
											</Button>
										</div>
										{listRemoveImages.includes(image.image_name) && (
											<div className={"absolute inset-0 bg-danger-200/50 flex items-center justify-center"}>
												<Chip color={"danger"} size="sm" variant="solid">Will Remove</Chip>
											</div>
										)}
									</div>
									<p className={"text-xs text-center mt-1 text-foreground-600 truncate"}>
										{image.image_name}
									</p>
								</div>
							))}
						</div>
						
						{/* Instructions */}
						<div className={"mt-4 p-3 bg-default-50 rounded-lg"}>
							<p className={"text-sm text-foreground-600"}>
								💡 <strong>Click any image</strong> to view it in full size. Use the <span className={"text-danger-600"}>delete button</span> to mark images for removal.
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Image Modal */}
			<Modal 
				isOpen={isImageModalOpen} 
				onClose={handleCloseImageModal}
				size="3xl"
				classNames={{
					body: "py-6",
					backdrop: "bg-black/80",
					base: "bg-white border-none",
					header: "border-b-[1px] border-default-200",
					footer: "border-t-[1px] border-default-200",
				}}
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								<div className={"flex items-center gap-2"}>
									{selectedImage?.type === 'thumbnail' && (
										<Chip color={"success"} size="sm" variant="solid">Thumbnail</Chip>
									)}
									<h4 className={"text-lg font-semibold"}>
										{selectedImage?.name || "Project Image"}
									</h4>
								</div>
							</ModalHeader>
							<ModalBody>
								{selectedImage && (
									<div className={"flex justify-center"}>
										<Image
											src={selectedImage.url}
											alt={selectedImage.name}
											className={"object-contain max-h-96 w-auto rounded-lg"}
											height={400}
											width={600}
										/>
									</div>
								)}
							</ModalBody>
							<ModalFooter>
								<div className={"flex justify-between items-center w-full"}>
									<div className={"flex items-center gap-2"}>
										{selectedImage?.type === 'image' && (
											<Button
												color={listRemoveImages.includes(selectedImage.name) ? "success" : "danger"}
												variant="bordered"
												size="sm"
												startContent={ICON_CONFIG.SOFT_DELETE}
												onPress={() => {
													if (selectedImage) {
														handleAddRemoveImage(selectedImage.name);
													}
												}}
											>
												{listRemoveImages.includes(selectedImage.name) ? "Restore Image" : "Mark for Removal"}
											</Button>
										)}
									</div>
									<Button color="primary" onPress={onClose}>
										Close
									</Button>
								</div>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</Container>
	);
}
