"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Chip,
  Spinner,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  addToast,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
} from "@heroui/react";

import AdminHeader from "@/components/shared/partials/admin-header";
import { useFetch } from "@/hooks/useFetch";
import API_ROUTE from "@/configs/api";
import { TAccount } from "@/types/account";
import { IAPIResponse, TDataAction } from "@/types/global";
import { formatDate } from "@/utils/date";
import ICON_CONFIG from "@/configs/icons";
import AccountForm from "@/components/pages/accounts/account-form";
import { MAP_MESSAGE } from "@/configs/response-message";
import Container from "@/components/shared/container/container";
import SearchInput from "@/components/shared/search/search-input";
import CustomPagination from "@/components/shared/custom-pagination/custom-pagination";

export default function AccountManagementPage() {
  const [accounts, setAccounts] = useState<TAccount[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<TAccount | null>(null);
  const [action, setAction] = useState<TDataAction>(null);
  // const [mode, setMode] = useState<"create" | "update">("create");

  // Search and pagination state
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const {
    data: fetchAccountsResult,
    loading: fetchingAccounts,
    // error: fetchAccountsError,
    fetch: fetchAccounts,
  } = useFetch<IAPIResponse<TAccount[]>>(
    API_ROUTE.ACCOUNT.GET_ALL,
    {
      search: searchTerm,
      page: currentPage,
      limit: itemsPerPage,
    },
    {
      method: "GET",
    }
  );

  const {
    data: updateStatusResult,
    error: updateStatusError,
    // loading: updatingStatus,
    fetch: updateStatus,
  } = useFetch(
    API_ROUTE.ACCOUNT.ACTIVE_STATUS(selectedAccount?.user_id ?? -1),
    {
      method: "PATCH",
      skip: true,
    }
  );

  // Handle fetch accounts result
  useEffect(() => {
    if (fetchAccountsResult) {
      setAccounts(fetchAccountsResult.results || []);
      setTotalItems(fetchAccountsResult.metadata?.totalCount || 0);
      setTotalPages(fetchAccountsResult.metadata?.totalPages || 0);
    }
  }, [fetchAccountsResult]);

  // Fetch accounts when search or pagination changes
  useEffect(() => {
    fetchAccounts();
  }, [searchTerm, currentPage, itemsPerPage]);

  useEffect(() => {
    if (updateStatusResult) {
      addToast({
        title: "Success",
        description: "Account status updated successfully",
      });
      resetAction();
    }

    if (updateStatusError) {
      const parsedError = JSON.parse(updateStatusError);

      addToast({
        title: "Error",
        description: MAP_MESSAGE[parsedError.message],
      });
    }
  }, [updateStatusResult, updateStatusError]);

  const mapAction = (account: TAccount | null, action: TDataAction) => {
    setSelectedAccount(account);
    setAction(action);
  };

  useEffect(() => {
    if (selectedAccount || action === "create" || action === "update") {
      switch (action) {
        case "create":
          // setMode("create");
          onOpen();
          break;
        case "block":
          updateStatus({
            body: { action: "block" },
          });
          break;
        case "unblock":
          updateStatus({
            body: { action: "unblock" },
          });
          break;
      }
    }
  }, [action, selectedAccount]);

  const onModalSuccess = () => {
    onOpenChange();
    resetAction();
  };

  useEffect(() => {
    if (!isOpen) {
      resetAction();
    }
  }, [isOpen]);

  const resetAction = () => {
    setSelectedAccount(null);
    setAction(null);
    fetchAccounts();
  };

  // Search and pagination handlers
  const handleSearch = (search: string) => {
    // console.log("🚀 ~ handleSearch ~ search:", search)
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

  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "created_at", label: "Created At" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  return (
    <Container
      shadow
      className={"border border-gray-200 rounded-2xl"}
      orientation={"vertical"}>
      <AdminHeader
        breadcrumbs={["Admin", "Account Management"]}
        title="Account Management"
      />

      <div className={"flex flex-col gap-4"}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              color="primary"
              startContent={ICON_CONFIG.NEW}
              onPress={() => mapAction(null, "create")}>
              Create Account
            </Button>
          </div>
          <div className="w-80">
            <SearchInput
              placeholder="Search by username or email..."
              value={searchTerm}
              onSearch={handleSearch}
            />
          </div>
        </div>
        <Table
          isHeaderSticky
          aria-label="Accounts table"
          classNames={{
            wrapper: "h-[60vh]",
          }}>
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.key}
                align={
                  ["action", "status", "role", "created_at"].includes(
                    column.key
                  )
                    ? "center"
                    : "start"
                }>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent="No accounts found"
            isLoading={fetchingAccounts}
            items={accounts}
            loadingContent={<Spinner label="Loading accounts..." />}>
            {(account) => (
              <TableRow key={account.user_id}>
                <TableCell>{account.username}</TableCell>
                <TableCell>{account.email}</TableCell>
                <TableCell>
                  <Chip
                    color={account.role === 0 ? "success" : "danger"}
                    size="sm"
                    variant="flat">
                    {account.role === 0 ? "User" : "Admin"}
                  </Chip>
                </TableCell>
                <TableCell>
                  {formatDate(account.created_at, "fullDate")}
                </TableCell>
                <TableCell>
                  <Chip
                    color={account.is_active === 1 ? "success" : "danger"}
                    size="sm"
                    variant="flat">
                    {account.is_active === 1 ? "Active" : "Blocked"}
                  </Chip>
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    {account.is_active === 1 ? (
                      <Button
                        isIconOnly
                        color="danger"
                        size="sm"
                        variant="flat"
                        onPress={() => mapAction(account, "block")}>
                        {ICON_CONFIG.BLOCK}
                      </Button>
                    ) : (
                      <Button
                        isIconOnly
                        color="success"
                        size="sm"
                        variant="flat"
                        onPress={() => mapAction(account, "unblock")}>
                        {ICON_CONFIG.UNBLOCK}
                      </Button>
                    )}
                  </div>
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
        placement="top"
        scrollBehavior="inside"
        size="2xl"
        onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl">Create account</h3>
          </ModalHeader>
          <ModalBody className="mb-4">
            <AccountForm onSuccess={() => onModalSuccess()} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
