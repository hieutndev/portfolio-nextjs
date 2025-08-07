"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import Container from "@/components/shared/container/container";
import AdminHeader from "@/components/shared/partials/admin-header";
import ICON_CONFIG from "@/configs/icons";
import ROUTE_PATH from "@/configs/route-path";
import { useFetch } from "@/hooks/useFetch";
import { IAPIResponse, TDataAction } from "@/types/global";
import { TEmployment } from "@/types/employment";
import API_ROUTE from "@/configs/api";
import { MAP_MESSAGE } from "@/configs/response-message";
import { formatDate } from "@/utils/date";
import {
	addToast,
	Button,
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	Chip,
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Spinner,
	Modal,
	ModalContent,
	ModalHeader,
	useDisclosure,
	ModalBody,
	Divider,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import TableCellAction from "@/components/shared/tables/table-cell-action";
import EmploymentFormComponent from "@/components/pages/employments/employment-form";
import SearchInput from "@/components/shared/search/search-input";
import CustomPagination from "@/components/shared/custom-pagination/custom-pagination";

export default function EmploymentManagementPage() {
	const router = useRouter();
	const [listEmploymentHistory, setListEmploymentHistory] = useState<TEmployment[]>([]);
	const [selectedEmployment, setSelectedEmployment] = useState<TEmployment | null>(null);
	const [action, setAction] = useState<TDataAction>(null);

	// Search and pagination state
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [totalItems, setTotalItems] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	/* HANDLE FETCH EMPLOYMENT HISTORY */
	const {
		data: fetchEmploymentResult,
		error: fetchEmploymentError,
		loading: fetchingEmployment,
		fetch: fetchEmployment,
	} = useFetch<IAPIResponse<TEmployment[]>>(
		API_ROUTE.EMPLOYMENT.GET_ALL,
		{
			search: searchTerm,
			page: currentPage,
			limit: itemsPerPage,
		}
	);

	// Handle fetch employment result
	useEffect(() => {
		if (fetchEmploymentResult && fetchEmploymentResult.results) {
			setListEmploymentHistory(fetchEmploymentResult.results);
			setTotalItems(fetchEmploymentResult.metadata?.totalCount || 0);
			setTotalPages(fetchEmploymentResult.metadata?.totalPages || 0);
		}

		if (fetchEmploymentError) {
			const parseError = JSON.parse(fetchEmploymentError);
			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [fetchEmploymentResult, fetchEmploymentError]);

	// Fetch employment when search or pagination changes
	useEffect(() => {
		fetchEmployment();
	}, [searchTerm, currentPage, itemsPerPage]);

	/* HANDLE SOFT DELETE */

	const {
		data: softDeleteResult,
		error: softDeleteError,
		loading: softDeleting,
		fetch: softDeleteEmployment,
	} = useFetch<IAPIResponse>(API_ROUTE.EMPLOYMENT.SOFT_DELETE(selectedEmployment?.id ?? -1), {
		method: "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (softDeleteResult) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[softDeleteResult.message],
				color: "success",
			});
			fetchEmployment(); // Refresh the list after deletion
		}

		if (softDeleteError) {
			const parseError = JSON.parse(softDeleteError);
			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [softDeleteResult, softDeleteError]);

	/* HANDLE RECOVER */

	const {
		data: recoverResult,
		error: recoverError,
		loading: recovering,
		fetch: recoverEmployment,
	} = useFetch<IAPIResponse>(API_ROUTE.EMPLOYMENT.RECOVER(selectedEmployment?.id ?? -1), {
		method: "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (recoverResult) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[recoverResult.message],
				color: "success",
			});
			fetchEmployment(); // Refresh the list after recovery
		}

		if (recoverError) {
			const parseError = JSON.parse(recoverError);
			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [recoverResult, recoverError]);

	/* HANDLE PERMANENT DELETE */

	const {
		data: deleteResult,
		error: deleteError,
		loading: deleting,
		fetch: deleteEmployment,
	} = useFetch(API_ROUTE.EMPLOYMENT.DELETE(selectedEmployment?.id ?? -1), {
		method: "DELETE",
		skip: true,
	});

	useEffect(() => {
		if (deleteResult) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[deleteResult.message],
				color: "success",
			});
			fetchEmployment(); // Refresh the list after deletion
		}

		if (deleteError) {
			const parseError = JSON.parse(deleteError);
			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [deleteResult, deleteError]);

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

	const mapAction = async (employment: TEmployment | null, action: TDataAction) => {
		setSelectedEmployment(employment);
		setAction(action);
	};

	useEffect(() => {

		if (selectedEmployment || action === "create" || action === "update") {
			switch (action) {
				case "softDelete":
					softDeleteEmployment();
					break;
				case "recover":
					recoverEmployment();
					break;
				case "permanentDelete":
					deleteEmployment();
					break;
				case "create":
					setModalMode("create");
					onOpen();
					break;
				case "update":
					setModalMode("update");
					onOpen();
					break;
				default:
					break;
			}

			if (action !== "update") {
				resetAction();
			}
		}
	}, [selectedEmployment, action]);

	const columns = [
		{ key: "id", label: "ID" },
		{ key: "title", label: "Title" },
		{ key: "organization", label: "Organization" },
		{ key: "workTime", label: "Work Time" },
		{ key: "status", label: "Status" },
		{ key: "actions", label: "Actions" },
	];

	const resetAction = () => {
		setSelectedEmployment(null);
		setAction(null);
	};

	/* Modal Setup */

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const [modalMode, setModalMode] = useState<"create" | "update">("create");

	const onModalSuccess = () => {
		fetchEmployment();
		onOpenChange();
		resetAction();
	};

	useEffect(() => {
		if (!isOpen) {
			resetAction();
		}
	}, [isOpen]);

	return (
		<Container
			orientation={"vertical"}
			className={"border border-default-200 rounded-2xl"}
			shadow
		>
			<AdminHeader
				title={"Employment History"}
				breadcrumbs={["Admin", "Employment History"]}
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
							Add New Employment
						</Button>
					</div>
					<div className="w-80">
						<SearchInput
							placeholder="Search employments by title or organization..."
							onSearch={handleSearch}
							value={searchTerm}
						/>
					</div>
				</div>
				<Table
					aria-label="Employment history table"
					classNames={{
						wrapper: "h-[60vh]",
					}}
					isHeaderSticky
				>
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn
								key={column.key}
								align={["workTime", "status", "actions"].includes(column.key) ? "center" : "start"}
							>
								{column.label}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody
						items={listEmploymentHistory}
						isLoading={fetchingEmployment}
						loadingContent={<Spinner label="Loading employment history..." />}
						emptyContent={"No employment history have been added yet"}
					>
						{(employment) => (
							<TableRow key={employment.id}>
								<TableCell>{employment.id}</TableCell>
								<TableCell>{employment.title}</TableCell>
								<TableCell>{employment.organization}</TableCell>
								<TableCell>
									{formatDate(employment.time_start, "onlyDate")} -{" "}
									{formatDate(employment.time_end, "onlyDate")}
								</TableCell>
								<TableCell>
									<Chip
										color={employment.is_deleted === 1 ? "danger" : "success"}
										variant="flat"
										size="sm"
									>
										{employment.is_deleted === 1 ? "Deleted" : "Active"}
									</Chip>
								</TableCell>
								<TableCell>
									<TableCellAction
										buttonSize={"sm"}
										mode={employment.is_deleted === 1}
										onEdit={() => mapAction(employment, "update")}
										onSoftDelete={() => mapAction(employment, "softDelete")}
										onRecover={() => mapAction(employment, "recover")}
										onPermanentDelete={() => mapAction(employment, "permanentDelete")}
										showViewButton={true}
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
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size={"xl"}
				hideCloseButton={true}
			>
				<ModalContent>
					<ModalHeader>
						<h3 className={"text-xl font-semibold"}>Employment History Information</h3>
					</ModalHeader>
					<ModalBody>
						<EmploymentFormComponent
							mode={modalMode}
							defaultValues={selectedEmployment ?? undefined}
							employmentId={selectedEmployment?.id ?? undefined}
							onSuccess={onModalSuccess}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Container>
	);
}
