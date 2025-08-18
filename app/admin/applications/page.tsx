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
  Switch,
} from "@heroui/react";

import { useFetch } from "@/hooks/useFetch";
import AdminHeader from "@/components/shared/partials/admin-header";
import ApplicationForm from "@/components/pages/applications/application-form";
import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import Container from "@/components/shared/container/container";
import { IAPIResponse, TDataAction } from "@/types/global";
import { TApp } from "@/types/application";
import TableCellAction from "@/components/shared/tables/table-cell-action";
import { MAP_MESSAGE } from "@/configs/response-message";
import { formatDate } from "@/utils/date";
import SearchInput from "@/components/shared/search/search-input";
import CustomPagination from "@/components/shared/custom-pagination/custom-pagination";

export default function ApplicationManagementPage() {
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedApplication, setSelectedApplication] = useState<TApp | null>(
    null
  );
  const [action, setAction] = useState<TDataAction>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /* Fetch all applications */
  const {
    data: fetchApplicationsResult,
    loading: fetchingApplications,
    error: fetchApplicationsError,
    fetch: fetchApplications,
  } = useFetch<IAPIResponse<TApp[]>>(API_ROUTE.APP.GET_ALL, {
    search: searchTerm,
    page: currentPage,
    limit: itemsPerPage,
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  /* Delete Application */
  const {
    data: deleteResult,
    error: deleteError,
    loading: deleting,
    fetch: deleteApplication,
  } = useFetch<IAPIResponse>(
    API_ROUTE.APP.DELETE(selectedApplication?.app_id ?? -1),
    {
      method: "DELETE",
      skip: true,
    }
  );

  // Handle fetch applications result
  useEffect(() => {
    if (fetchApplicationsResult) {
      setTotalItems(fetchApplicationsResult.metadata?.totalCount || 0);
      setTotalPages(fetchApplicationsResult.metadata?.totalPages || 0);
    }
    if (fetchApplicationsError) {
      addToast({
        title: "Error",
        description: "Failed to fetch applications",
        color: "danger",
      });
    }
  }, [fetchApplicationsResult, fetchApplicationsError]);

  // Fetch applications when search or pagination changes
  useEffect(() => {
    fetchApplications();
  }, [searchTerm, currentPage, itemsPerPage]);

  useEffect(() => {
    if (deleteResult) {
      addToast({
        title: "Success",
        description:
          MAP_MESSAGE[deleteResult.message] ||
          "Application deleted successfully",
        color: "success",
      });
      fetchApplications();
      resetAction();
    }
    if (deleteError) {
      const parsedError = JSON.parse(deleteError);

      addToast({
        title: "Error",
        description: parsedError.message,
        color: "danger",
      });
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

  const resetAction = () => {
    setAction(null);
    setSelectedApplication(null);
  };

  const mapAction = (application: TApp | null, actionType: TDataAction) => {
    setAction(actionType);
    setSelectedApplication(application);
  };

  useEffect(() => {
    if (selectedApplication || action === "create" || action === "update") {
      switch (action) {
        case "create":
          setModalMode("create");
          onOpen();
          break;
        case "update":
          setModalMode("update");
          onOpen();
          break;
        case "permanentDelete":
          deleteApplication();
          resetAction();
          break;
      }

      if (action !== "update") {
        resetAction();
      }
    }
  }, [action, selectedApplication]);

  const {
    data: statusUpdateResult,
    error: statusUpdateError,
    loading: updatingStatus,
    fetch: updateDisplayStatus,
  } = useFetch<IAPIResponse>(API_ROUTE.APP.UPDATE_DISPLAY, {
    method: "PATCH",
    skip: true,
  });

  useEffect(() => {
    if (statusUpdateResult) {
      addToast({
        title: "Success",
        description: "Display status updated successfully",
        color: "success",
      });
      fetchApplications();
    }
    if (statusUpdateError) {
      const parsedError = JSON.parse(statusUpdateError);

      addToast({
        title: "Error",
        description: parsedError.message,
        color: "danger",
      });
    }
  }, [statusUpdateResult, statusUpdateError]);

  const handleStatusToggle = (app: TApp, newStatus: boolean) => {
    updateDisplayStatus({
      body: {
        new_status: newStatus ? "1" : "0",
        app_id: app.app_id,
      },
    });
  };

  return (
    <Container
      shadow
      className={"border border-default-200 rounded-2xl"}
      orientation="vertical">
      <AdminHeader
        breadcrumbs={["Admin", "Application Management"]}
        title={"Application Management"}
      />
      <div className={"flex flex-col gap-4"}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              color="primary"
              startContent={ICON_CONFIG.NEW}
              variant="solid"
              onPress={() => mapAction(null, "create")}>
              Add New Application
            </Button>
          </div>
          <div className="w-80">
            <SearchInput
              placeholder="Search applications by name..."
              value={searchTerm}
              onSearch={handleSearch}
            />
          </div>
        </div>
        <Table
          isHeaderSticky
          aria-label="Application List"
          classNames={{
            wrapper: "h-[60vh]",
          }}>
          <TableHeader>
            <TableColumn>App Name</TableColumn>
            <TableColumn align="center">Created At</TableColumn>
            <TableColumn align="center">Display Status</TableColumn>
            <TableColumn align="center">Action</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="No applications found"
            isLoading={fetchingApplications}
            items={fetchApplicationsResult?.results ?? []}
            loadingContent={<Spinner label="Loading applications..." />}>
            {(application) => (
              <TableRow key={application.app_id}>
                <TableCell className="min-w-max">
                  {application.app_name}
                </TableCell>
                <TableCell className="min-w-max">
                  {formatDate(application.created_at, "onlyDate")}
                </TableCell>
                <TableCell>
                  <div className={"flex items-center justify-center gap-2"}>
                    <p>Hide</p>
                    <Switch
                      color="success"
                      isDisabled={updatingStatus}
                      isSelected={application.is_hide === 1}
                      size="sm"
                      onValueChange={(checked) =>
                        handleStatusToggle(application, checked)
                      }
                    />
                    <p>Show</p>
                  </div>
                </TableCell>
                <TableCell>
                  <TableCellAction
                    showViewButton
                    buttonSize="sm"
                    mode={false} // Applications don't have soft delete
                    onEdit={() => mapAction(application, "update")}
                    onSoftDelete={() =>
                      mapAction(application, "permanentDelete")
                    }
                    onViewDetails={() =>
                      window.open(application.app_link, "_blank")
                    }
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

      {/* Modal for Create/Edit */}
      <Modal
        hideCloseButton
        isOpen={isOpen}
        placement={"top"}
        scrollBehavior="inside"
        size="xl"
        onOpenChange={onOpenChange}
        >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h3 className={"text-xl font-semibold"}>
                  {modalMode === "create"
                    ? "Add New Application"
                    : "Edit Application"}
                </h3>
              </ModalHeader>
              <ModalBody className={"mb-4"}>
                <ApplicationForm
                  applicationId={
                    selectedApplication?.app_id
                      ? Number(selectedApplication.app_id)
                      : undefined
                  }
                  mode={modalMode}
                  onSuccess={() => {
                    fetchApplications();
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
