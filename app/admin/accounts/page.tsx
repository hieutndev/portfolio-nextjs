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
import { useFetch } from "@/hooks/useFetch";
import API_ROUTE from "@/configs/api";
import { TAccount } from "@/types/account";
import { IAPIResponse, TDataAction } from "@/types/global";
import { formatDate } from "@/utils/date";
import ICON_CONFIG from "@/configs/icons";
import ModalAccountForm from "@/components/pages/accounts/modal-account-form";
import AccountForm from "@/components/pages/accounts/account-form";
import { title } from "process";
import { MAP_MESSAGE } from "@/configs/response-message";
import Container from "@/components/shared/container/container";
import AdminHeader from "../../../components/shared/partials/admin-header";

export default function AccountManagementPage() {
	const [accounts, setAccounts] = useState<TAccount[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<TAccount | null>(null);
	const [action, setAction] = useState<TDataAction>(null);
	const [mode, setMode] = useState<"create" | "update">("create");

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	const {
		data: fetchAccountsResult,
		loading: fetchingAccounts,
		error: fetchAccountsError,
		fetch: fetchAccounts,
	} = useFetch<IAPIResponse<TAccount[]>>(API_ROUTE.ACCOUNT.GET_ALL, {
		method: "GET",
	});

	const {
		data: updateStatusResult,
		error: updateStatusError,
		loading: updatingStatus,
		fetch: updateStatus,
	} = useFetch(API_ROUTE.ACCOUNT.ACTIVE_STATUS(selectedAccount?.user_id ?? -1), {
		method: "PATCH",
		skip: true,
	});

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
					setMode("create");
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

	const resetAction = () => {
		setSelectedAccount(null);
		setAction(null);
		fetchAccounts();
	};

	useEffect(() => {
		if (fetchAccountsResult?.results) {
			setAccounts(fetchAccountsResult.results);
		}
	}, [fetchAccountsResult]);

	const columns = [
		{ key: "user_id", label: "User ID" },
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
			orientation={"vertical"}
			className={"border border-gray-200 rounded-2xl"}
		>
			<AdminHeader
				title="Account Management"
				breadcrumbs={["Admin", "Account Management"]}
			/>

			<div className={"flex flex-col gap-4"}>
				<div className={"flex items-center gap-4"}>
					<Button
						color="primary"
						startContent={ICON_CONFIG.NEW}
						onPress={() => mapAction(null, "create")}
					>
						Create Account
					</Button>
				</div>
				<Table
					aria-label="Accounts table"
					classNames={{
						wrapper: "min-h-[222px]",
					}}
				>
					<TableHeader columns={columns}>
						{(column) => (
							<TableColumn
								key={column.key}
								align={column.key === "action" ? "center" : "start"}
							>
								{column.label}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody
						items={accounts}
						isLoading={fetchingAccounts}
						loadingContent={<Spinner label="Loading accounts..." />}
						emptyContent="No accounts found"
					>
						{(account) => (
							<TableRow key={account.user_id}>
								<TableCell>{account.user_id}</TableCell>
								<TableCell>{account.username}</TableCell>
								<TableCell>{account.email}</TableCell>
								<TableCell>
									<Chip
										size="sm"
										color={account.role === 0 ? "success" : "danger"}
										variant="flat"
									>
										{account.role === 0 ? "User" : "Admin"}
									</Chip>
								</TableCell>
								<TableCell>{formatDate(account.created_at, "onlyDate")}</TableCell>
								<TableCell>
									<Chip
										size="sm"
										color={account.is_active === 1 ? "success" : "danger"}
										variant="flat"
									>
										{account.is_active === 1 ? "Active" : "Blocked"}
									</Chip>
								</TableCell>
								<TableCell>
									<div className="flex justify-center gap-2">
										{account.is_active === 1 ? (
											<Button
												isIconOnly
												size="sm"
												color="danger"
												variant="flat"
												onPress={() => mapAction(account, "block")}
											>
												{ICON_CONFIG.BLOCK}
											</Button>
										) : (
											<Button
												isIconOnly
												size="sm"
												color="success"
												variant="flat"
												onPress={() => mapAction(account, "unblock")}
											>
												{ICON_CONFIG.UNBLOCK}
											</Button>
										)}
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				placement="top"
				size="2xl"
				scrollBehavior="inside"
				hideCloseButton
			>
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
