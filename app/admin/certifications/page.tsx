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
} from "@heroui/react";

import { useFetch } from "@/hooks/useFetch";
import AdminHeader from "@/components/shared/partials/admin-header";
import CertificationForm from "@/components/pages/certifications/certification-form";
import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import Container from "@/components/shared/container/container";
import { IAPIResponse, TDataAction } from "@/types/global";
import { TCertification } from "@/types/certification";
import TableCellAction from "@/components/shared/tables/table-cell-action";
import { formatDate } from "@/utils/date";
import { MAP_MESSAGE } from "@/configs/response-message";
import SearchInput from "@/components/shared/search/search-input";
import CustomPagination from "@/components/shared/custom-pagination/custom-pagination";

export default function CertificationListPage() {
	const [modalMode, setModalMode] = useState<"create" | "update">("create");
	const [selectedCert, setSelectedCert] = useState<any>(null);
	const [action, setAction] = useState<TDataAction>(null);
	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	// Search and pagination state
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [totalItems, setTotalItems] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	/* Fetch all certifications */

	const {
		data: fetchCertsResult,
		// loading: fetchingCerts,
		error: fetchCertsError,
		fetch: fetchCerts,
	} = useFetch<IAPIResponse<TCertification[]>>(
		API_ROUTE.CERTIFICATION.GET_ALL,
		{
			search: searchTerm,
			page: currentPage,
			limit: itemsPerPage,
		}
	);

	// Handle fetch certifications result
	useEffect(() => {
		if (fetchCertsResult) {
			setTotalItems(fetchCertsResult.metadata?.totalCount || 0);
			setTotalPages(fetchCertsResult.metadata?.totalPages || 0);
		}
	}, [fetchCertsResult]);

	// Fetch certifications when search or pagination changes
	useEffect(() => {
		fetchCerts();
	}, [searchTerm, currentPage, itemsPerPage]);

	useEffect(() => {
		if (fetchCertsError) {
			addToast({ title: "Error", description: "Failed to fetch certifications", color: "danger" });
		}
	}, [fetchCertsError]);

	/* Soft delete */

	const {
		data: softDeleteResult,
		error: softDeleteError,
		// loading: softDeleting,
		fetch: softDeleteCert,
	} = useFetch<IAPIResponse>(API_ROUTE.CERTIFICATION.SOFT_DELETE(selectedCert?.id ?? -1), {
		method: "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (softDeleteResult) {
			addToast({ title: "Success", description: MAP_MESSAGE[softDeleteResult.message], color: "success" });
			fetchCerts();
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
		// loading: recovering,
		fetch: recoverCert,
	} = useFetch<IAPIResponse>(API_ROUTE.CERTIFICATION.RECOVER(selectedCert?.id ?? -1), {
		method: "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (recoverResult) {
			addToast({ title: "Success", description: MAP_MESSAGE[recoverResult.message], color: "success" });
			fetchCerts();
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
		// loading: deleting,
		fetch: deleteCert,
	} = useFetch<IAPIResponse>(API_ROUTE.CERTIFICATION.DELETE(selectedCert?.id ?? -1), {
		method: "DELETE",
		skip: true,
	});

	useEffect(() => {
		if (deleteResult) {
			addToast({ title: "Success", description: MAP_MESSAGE[deleteResult.message], color: "success" });
			fetchCerts();
			resetAction();
		}
		if (deleteError) {
			const parsedError = JSON.parse(deleteError);

			addToast({ title: "Error", description: parsedError.message, color: "danger" });
		}
	}, [deleteResult, deleteError]);

	useEffect(() => {
		if (selectedCert || action === "create" || action === "update") {
			if (action === "update" && selectedCert) {
				setModalMode("update");
				onOpen();
			} else if (action === "create") {
				setModalMode("create");
				onOpen();
			} else if (action === "softDelete") {
				softDeleteCert();
			} else if (action === "recover") {
				recoverCert();
			} else if (action === "permanentDelete") {
				deleteCert();
			}
		}

		if (action !== "update") {
			resetAction();
		}
	}, [selectedCert, action]);

	const mapAction = (cert: any, actionType: TDataAction) => {
		setSelectedCert(cert);
		setAction(actionType);
	};

	const resetAction = () => {
		setSelectedCert(null);
		setAction(null);
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

	const handleModalSuccess = () => {
		onOpenChange();
		fetchCerts();
		resetAction();
	};

	return (
		<Container
			shadow
			className={"border border-default-200 rounded-2xl"}
			orientation={"vertical"}
		>
			<AdminHeader breadcrumbs={["Admin", "Certification Management"]} title="Certification Management"/>
			<div className={"flex flex-col gap-4"}>
				<div className="flex items-center justify-between gap-4">
					<div className="flex items-center gap-4">
						<Button
							color="primary"
							startContent={ICON_CONFIG.NEW}
							variant="solid"
							onPress={() => mapAction(null, "create")}
						>
							Add New Certification
						</Button>
					</div>
					<div className="w-80">
						<SearchInput
							placeholder="Search certifications by title or issuer..."
							value={searchTerm}
							onSearch={handleSearch}
						/>
					</div>
				</div>
				<Table
					isHeaderSticky
					aria-label="Certification List"
					classNames={{
						wrapper: "h-[60vh]",
					}}
				>
					<TableHeader>
						<TableColumn>ID</TableColumn>
						<TableColumn>Title</TableColumn>
						<TableColumn>Issued By</TableColumn>
						<TableColumn align={"center"}>Issued Date</TableColumn>
						<TableColumn align={"center"}>Action</TableColumn>
					</TableHeader>
					<TableBody items={fetchCertsResult?.results ?? []}>
						{(cert) => (
							<TableRow key={cert.id}>
								<TableCell>{cert.id}</TableCell>
								<TableCell className={"min-w-max"}>{cert.title}</TableCell>
								<TableCell className={"min-w-max"}>{cert.issued_by}</TableCell>
								<TableCell className={"min-w-max"}>
									{formatDate(cert.issued_date, "onlyDate")}
								</TableCell>
								<TableCell>
									<TableCellAction
										buttonSize={"sm"}
										mode={cert.is_deleted === 1}
										onEdit={() => mapAction(cert, "update")}
										onPermanentDelete={() => mapAction(cert, "permanentDelete")}
										onRecover={() => mapAction(cert, "recover")}
										onSoftDelete={() => mapAction(cert, "softDelete")}
									/>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>

				{/* Pagination */}
				<CustomPagination
					currentPage={currentPage}
					itemsPerPage={itemsPerPage}
					totalItems={totalItems}
					totalPages={totalPages}
					onItemsPerPageChange={handleItemsPerPageChange}
					onPageChange={handlePageChange}
				/>
			</div>
			<Modal
				hideCloseButton
				isOpen={isOpen}
				placement={"top"}
				size="xl"
				onOpenChange={onOpenChange}
			>
				<ModalContent>
					<ModalHeader>
						<h3 className="text-xl font-semibold">
							{modalMode === "create" ? "Add New Certification" : "Update Certification"}
						</h3>
					</ModalHeader>
					<ModalBody>
						<CertificationForm
							certificationId={selectedCert?.id ?? -1}
							mode={modalMode}
							onSuccess={handleModalSuccess}
						/>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Container>
	);
}
