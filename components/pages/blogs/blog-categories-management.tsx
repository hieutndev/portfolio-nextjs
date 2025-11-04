"use client";

import {
	addToast,
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useFetch } from "hieutndev-toolkit";

import TableCellAction from "@/components/shared/tables/table-cell-action";
import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import { MAP_MESSAGE } from "@/configs/response-message";
import { IAPIResponse } from "@/types/global";
import { TBlogCategory, TNewCategory } from "@/types/blog";
import { TTableAction } from "@/types/table";
import { generateSlug } from "@/utils/slug";

export default function BlogCategoriesManagement() {
	const listColumns = [
		{
			key: "category_id",
			title: "Category ID",
		},
		{
			key: "category_title",
			title: "Category Title",
		},
		{
			key: "category_slug",
			title: "Category Slug",
		},
		{
			key: "action",
			title: "Action",
		},
	];

	const [listCategories, setListCategories] = useState<TBlogCategory[]>([]);
	const [selectedId, setSelectedId] = useState<TBlogCategory["category_id"] | null>(null);

	// Modal state
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<TNewCategory>({
		category_title: "",
		category_slug: "",
	});

	/* HANDLE FETCH CATEGORIES */

	const {
		data: fetchCategoriesResult,
		error: fetchCategoriesError,
		loading: fetchingCategories,
		fetch: fetchCategories,
	} = useFetch<IAPIResponse<TBlogCategory[]>>(API_ROUTE.BLOG.GET_ALL_CATEGORIES);

	// Handle fetch categories result
	useEffect(() => {
		if (fetchCategoriesResult) {
			setListCategories(fetchCategoriesResult.results ?? []);
		}

		if (fetchCategoriesError) {
			const parseError = JSON.parse(fetchCategoriesError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [fetchCategoriesResult, fetchCategoriesError]);

	/* HANDLE CREATE/UPDATE CATEGORY */

	const {
		data: saveCategoryResult,
		error: saveCategoryError,
		loading: savingCategory,
		fetch: saveCategory,
	} = useFetch<IAPIResponse>(isEditing ? API_ROUTE.BLOG.UPDATE_CATEGORY(selectedId ?? -1) : API_ROUTE.BLOG.NEW_CATEGORY, {
		method: isEditing ? "PUT" : "POST",
		skip: true,
	});

	useEffect(() => {
		if (saveCategoryResult) {
			fetchCategories();
			onOpenChange();
			resetForm();
		}

		if (saveCategoryError) {
			const parseError = JSON.parse(saveCategoryError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [saveCategoryResult, saveCategoryError]);

	/* HANDLE DELETE CATEGORY */

	const {
		data: deleteCategoryResult,
		error: deleteCategoryError,
		// loading: deletingCategory,
		fetch: deleteCategory,
	} = useFetch<IAPIResponse>(API_ROUTE.BLOG.DELETE_CATEGORY(selectedId ?? -1), {
		method: "DELETE",
		skip: true,
	});

	useEffect(() => {
		if (deleteCategoryResult) {
			fetchCategories();
		}

		if (deleteCategoryError) {
			const parseError = JSON.parse(deleteCategoryError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [deleteCategoryResult, deleteCategoryError]);

	// Form handlers
	const handleInputChange = (field: keyof TNewCategory, value: string) => {
		setFormData(prev => ({
			...prev,
			[field]: value,
		}));

		// Auto-generate slug from title
		if (field === "category_title") {
			setFormData(prev => ({
				...prev,
				category_slug: generateSlug(value),
			}));
		}
	};

	const handleSubmit = () => {
		if (!formData.category_title.trim() || !formData.category_slug.trim()) {
			addToast({
				title: "Error",
				description: "Please fill in all required fields",
				color: "danger",
			});

			return;
		}

		saveCategory({
			body: JSON.stringify(formData),
		});
	};

	const resetForm = () => {
		setFormData({
			category_title: "",
			category_slug: "",
		});
		setIsEditing(false);
		setSelectedId(null);
	};

	const handleNewCategory = () => {
		resetForm();
		onOpen();
	};

	const handleEditCategory = (category: TBlogCategory) => {
		setFormData({
			category_title: category.category_title,
			category_slug: category.category_slug,
		});
		setSelectedId(category.category_id);
		setIsEditing(true);
		onOpen();
	};

	/* HANDLE TABLE ACTION */

	const [tableAction, setTableAction] = useState<TTableAction | null>(null);

	const handleTableAction = (category: TBlogCategory, action: TTableAction) => {
		setSelectedId(category.category_id);
		setTableAction(action);
	};

	useEffect(() => {
		if (!selectedId || !tableAction) {
			return;
		}

		switch (tableAction) {
			case "edit":
				const categoryToEdit = listCategories.find(item => item.category_id === selectedId);

				if (categoryToEdit) {
					handleEditCategory(categoryToEdit);
				}
				break;
			case "softdel":
				deleteCategory();
				break;
			default:
				break;
		}

		setTableAction(null);
	}, [tableAction, selectedId]);

	return (
		<div className={"flex flex-col gap-4"}>
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Blog Categories</h3>
				<Button
					className={"w-max"}
					color={"primary"}
					isDisabled={fetchingCategories}
					size="sm"
					startContent={ICON_CONFIG.NEW}
					onPress={handleNewCategory}
				>
					New Category
				</Button>
			</div>

			<Table
				isHeaderSticky
				aria-label={"Blog Categories"}
				classNames={{
					wrapper: "h-[40vh]",
				}}
			>
				<TableHeader>
					{listColumns.map((column, index) => (
						<TableColumn
							key={column.key || index}
							align={["action"].includes(column.key) ? "center" : "start"}
						>
							{column.title}
						</TableColumn>
					))}
				</TableHeader>
				<TableBody
					emptyContent={<p className={"text-center"}>No categories found</p>}
					isLoading={fetchingCategories}
					items={listCategories}
					loadingContent={<Spinner>Fetching categories...</Spinner>}
				>
					{(category) => (
						<TableRow key={category.category_id}>
							<TableCell>{category.category_id}</TableCell>
							<TableCell>{category.category_title}</TableCell>
							<TableCell>{category.category_slug}</TableCell>
							<TableCell>
								<TableCellAction
									buttonSize={"sm"}
									mode={category.is_deleted === 1}
									onEdit={() => handleTableAction(category, "edit")}
									onSoftDelete={() => handleTableAction(category, "softdel")}
								/>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* Create/Edit Category Modal */}
			<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader className="flex flex-col gap-1">
								{isEditing ? "Edit Category" : "Create New Category"}
							</ModalHeader>
							<ModalBody>
								<Input
									label="Category Title"
									placeholder="Enter category title"
									value={formData.category_title}
									onValueChange={(value) => handleInputChange("category_title", value)}
								/>
								<Input
									label="Category Slug"
									placeholder="Enter category slug"
									value={formData.category_slug}
									onValueChange={(value) => handleInputChange("category_slug", value)}
								/>
							</ModalBody>
							<ModalFooter>
								<Button color="danger" variant="light" onPress={onClose}>
									Cancel
								</Button>
								<Button color="primary" isLoading={savingCategory} onPress={handleSubmit}>
									{isEditing ? "Update" : "Create"}
								</Button>
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</div>
	);
}
