"use client";

import { useEffect, useState } from "react";
import {
	Button,
	addToast,
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	useDisclosure,
	Spinner,
	Chip,
} from "@heroui/react";
import { useFetch } from "@/hooks/useFetch";
import AdminHeader from "@/components/shared/partials/admin-header";
import EducationForm from "@/components/pages/educations/education-form";
import { useRouter } from "next/navigation";
import API_ROUTE from "@/configs/api";
import ROUTE_PATH from "@/configs/route-path";
import ICON_CONFIG from "@/configs/icons";
import Container from "@/components/shared/container/container";
import { IAPIResponse, TDataAction } from "@/types/global";
import { TEducation } from "@/types/education";
import TableCellAction from "@/components/shared/tables/table-cell-action";
import { formatDate } from "@/utils/date";
import { MAP_MESSAGE } from "@/configs/response-message";
import SearchInput from "@/components/shared/search/search-input";
import CustomPagination from "@/components/shared/custom-pagination/custom-pagination";

export default function EducationManagementPage() {
	const [modalMode, setModalMode] = useState<"create" | "edit">("create");
	const [selectedEducation, setSelectedEducation] = useState<TEducation | null>(null);
	const [action, setAction] = useState<TDataAction>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const router = useRouter();

	// Search and pagination state
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [totalItems, setTotalItems] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	/* Fetch all educations */
	const {
		data: fetchEducationsResult,
		loading: fetchingEducations,
		error: fetchEducationsError,
		fetch: fetchEducations,
	} = useFetch<IAPIResponse<TEducation[]>>(API_ROUTE.EDUCATION.GET_ALL, {
		search: searchTerm,
		page: currentPage,
		limit: itemsPerPage,
	});

	// Handle fetch educations result
	useEffect(() => {
		if (fetchEducationsResult) {
			setTotalItems(fetchEducationsResult.metadata?.totalCount || 0);
			setTotalPages(fetchEducationsResult.metadata?.totalPages || 0);
		}
	}, [fetchEducationsResult]);

	// Fetch educations when search or pagination changes
	useEffect(() => {
		fetchEducations();
	}, [searchTerm, currentPage, itemsPerPage]);

	/* Soft Delete */
	const {
		data: softDeleteResult,
		error: softDeleteError,
		loading: softDeleting,
		fetch: softDeleteEducation,
	} = useFetch<IAPIResponse>(API_ROUTE.EDUCATION.SOFT_DELETE(selectedEducation?.id ?? -1), {
		method: "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (softDeleteResult) {
			addToast({ title: "Success", description: MAP_MESSAGE[softDeleteResult.message], color: "success" });
			fetchEducations();
			resetAction();
		}
		if (softDeleteError) {
			const parsedError = JSON.parse(softDeleteError);
			addToast({ title: "Error", description: parsedError.message, color: "danger" });
		}
	}, [softDeleteResult, softDeleteError]);

	// Recover
	const {
		data: recoverResult,
		error: recoverError,
		loading: recovering,
		fetch: recoverEducation,
	} = useFetch<IAPIResponse>(API_ROUTE.EDUCATION.RECOVER(selectedEducation?.id ?? -1), {
		method: "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (recoverResult) {
			addToast({ title: "Success", description: MAP_MESSAGE[recoverResult.message], color: "success" });
			fetchEducations();
			resetAction();
		}
		if (recoverError) {
			const parsedError = JSON.parse(recoverError);
			addToast({ title: "Error", description: parsedError.message, color: "danger" });
		}
	}, [recoverResult, recoverError]);

	/* Permanently Delete */
	const {
		data: deleteResult,
		error: deleteError,
		loading: deleting,
		fetch: deleteEducation,
	} = useFetch<IAPIResponse>(API_ROUTE.EDUCATION.DELETE(selectedEducation?.id ?? -1), {
		method: "DELETE",
		skip: true,
	});

	useEffect(() => {
		if (deleteResult) {
			addToast({ title: "Success", description: MAP_MESSAGE[deleteResult.message], color: "success" });
			fetchEducations();
			resetAction();
		}
		if (deleteError) {
			const parsedError = JSON.parse(deleteError);
			addToast({ title: "Error", description: parsedError.message, color: "danger" });
		}
	}, [deleteResult, deleteError]);

	const resetAction = () => {
		setAction(null);
		setSelectedEducation(null);
	};

	// Search and pagination handlers
	const handleSearch = (search: string) => {
		if (search || searchTerm !== search) {
			setSearchTerm(search);
			setCurrentPage(1); // Reset to first page when searching
		}
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleItemsPerPageChange = (items: number) => {
		setItemsPerPage(items);
		setCurrentPage(1); // Reset to first page when changing items per page
	};

	const mapAction = (education: TEducation | null, actionType: TDataAction) => {
		setAction(actionType);
		setSelectedEducation(education);
	};

	useEffect(() => {
		if (selectedEducation || action === "create" || action === "update") {
			switch (action) {
				case "create":
					setModalMode("create");
					onOpen();
					break;
				case "update":
					setModalMode("edit");
					onOpen();
					break;
				case "softDelete":
					softDeleteEducation();
					break;
				case "recover":
					recoverEducation();
					break;
				case "permanentDelete":
					deleteEducation();
					break;
			}

			if (action !== "update") {
				resetAction();
			}
		}
	}, [action, selectedEducation]);

	return (
		<Container
			className="border border-gray-200 rounded-2xl"
			shadow
			orientation="vertical"
		>
			<AdminHeader
				title="Education Management"
				breadcrumbs={["Admin", "Education"]}
			/>

			<div className={"flex flex-col gap-4"}>
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<Button
							color="primary"
							variant="solid"
							startContent={ICON_CONFIG.NEW}
							onPress={() => mapAction(null, "create")}
						>
							Add New Education
						</Button>
					</div>
					<div className="w-80">
						<SearchInput
							placeholder="Search educations by title or organization..."
							onSearch={handleSearch}
							value={searchTerm}
						/>
					</div>
				</div>
				<Table
					aria-label="Education List"
					classNames={{
						wrapper: "h-[60vh]",
					}}
					isHeaderSticky
				>
					<TableHeader>
						<TableColumn>ID</TableColumn>
						<TableColumn>Title/Major</TableColumn>
						<TableColumn>Organization</TableColumn>
						<TableColumn align="center">Start Date</TableColumn>
						<TableColumn align="center">End Date</TableColumn>
						<TableColumn align="center">Status</TableColumn>
						<TableColumn align="center">Action</TableColumn>
					</TableHeader>
					<TableBody
						items={fetchEducationsResult?.results ?? []}
						isLoading={fetchingEducations}
						loadingContent={<Spinner label="Loading education records..." />}
						emptyContent="No education records found"
					>
						{(education: TEducation) => (
							<TableRow key={education.id}>
								<TableCell>{education.id}</TableCell>
								<TableCell className="min-w-max">{education.title}</TableCell>
								<TableCell className="min-w-max">{education.organization}</TableCell>
								<TableCell className="min-w-max">
									{formatDate(education.time_start, "onlyDate")}
								</TableCell>
								<TableCell className="min-w-max">
									{education.time_end ? formatDate(education.time_end, "onlyDate") : "Present"}
								</TableCell>
								<TableCell>
									<Chip
										color={education.is_deleted === 1 ? "danger" : "success"}
										variant="flat"
										size="sm"
									>
										{education.is_deleted === 1 ? "Deleted" : "Active"}
									</Chip>
								</TableCell>
								<TableCell>
									<TableCellAction
										buttonSize="sm"
										mode={education.is_deleted === 1}
										onEdit={() => mapAction(education, "update")}
										onSoftDelete={() => mapAction(education, "softDelete")}
										onRecover={() => mapAction(education, "recover")}
										onPermanentDelete={() => mapAction(education, "permanentDelete")}
									/>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Pagination */}
				<CustomPagination
					currentPage={currentPage}
					totalPages={totalPages}
					totalItems={totalItems}
					itemsPerPage={itemsPerPage}
					onPageChange={handlePageChange}
					onItemsPerPageChange={handleItemsPerPageChange}
				/>
			</div>

			{/* Modal for Create/Edit */}
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size="xl"
				scrollBehavior="inside"
				hideCloseButton
			>
				<ModalContent>
					{(onClose) => (
						<>
							<ModalHeader>
								<h3 className={"text-xl font-semibold"}>
									{modalMode === "create" ? "Add New Education" : "Edit Education"}
								</h3>
							</ModalHeader>
							<ModalBody className="mb-4">
								<EducationForm
									mode={modalMode}
									educationId={selectedEducation?.id ? Number(selectedEducation.id) : undefined}
									onSuccess={() => {
										fetchEducations();
										onClose();
									}}
								/>
							</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</Container>
	);
}
