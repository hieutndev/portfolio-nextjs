"use client";

import {
	Button,
	TableHeader,
	TableCell,
	TableBody,
	TableRow,
	addToast,
	Table,
	TableColumn,
	Spinner,
	useDisclosure,
	Input,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { useFetch } from "hieutndev-toolkit";

import { MAP_MESSAGE } from "../../../configs/response-message";


import TableCellAction from "@/components/shared/tables/table-cell-action";
import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import { IAPIResponse } from "@/types/global";
import { TProjectGroup } from "@/types/project";
import { TTableAction } from "@/types/table";
import CustomModal from "@/components/shared/custom-modal/custom-modal";
import CustomForm from "@/components/shared/forms/custom-form";

export default function ProjectGroupsManagement() {
	const listColumns = [
		{
			key: "title",
			title: "Group Title",
		},
		{
			key: "action",
			title: "Action",
		},
	];

	const [currentEditing, setCurrentEditing] = useState<null | number>(null);
	const [groupTitle, setGroupTitle] = useState<string>("");

	const [listProjectGroups, setListProjectGroups] = useState<TProjectGroup[]>([]);

	const { isOpen, onOpen, onOpenChange } = useDisclosure();

	/* HANDLE FETCH GROUP */

	const {
		data: fetchProjectGroupsResult,
		error: fetchProjectGroupsError,
		loading: fetchingProjectGroups,
		fetch: fetchProjectGroups,
	} = useFetch<IAPIResponse<TProjectGroup[]>>(API_ROUTE.PROJECT.GET_ALL_GROUP);

	useEffect(() => {
		if (fetchProjectGroupsResult) {
			setListProjectGroups(fetchProjectGroupsResult.results ?? []);
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

	/* HANDLE CREATE GROUP */

	const {
		data: createProjectGroupResult,
		error: createProjectGroupError,
		// loading: creatingProjectGroup,
		fetch: createProjectGroup,
	} = useFetch<IAPIResponse>(API_ROUTE.PROJECT.NEW_GROUP, {
		method: "POST",
		body: { newGroupTitle: groupTitle },
		skip: true,
	});

	useEffect(() => {
		if (createProjectGroupResult) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[createProjectGroupResult.message],
				color: "success",
			});
			onOpenChange();
			setGroupTitle("");
			fetchProjectGroups();
		}

		if (createProjectGroupError) {
			const parseError = JSON.parse(createProjectGroupError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [createProjectGroupResult, createProjectGroupError]);

	/* HANDLE UPDATE GROUP */

	const {
		data: updateProjectGroupResult,
		error: updateProjectGroupError,
		// loading: updatingProjectGroup,
		fetch: updateProjectGroup,
	} = useFetch<IAPIResponse>(API_ROUTE.PROJECT.UPDATE_GROUP(currentEditing ?? -1), {
		method: "PATCH",
		body: { newGroupTitle: groupTitle },
		skip: true,
	});

	useEffect(() => {
		if (updateProjectGroupResult) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[updateProjectGroupResult.message],
				color: "success",
			});
			setCurrentEditing(null);
			setGroupTitle("");
			fetchProjectGroups();
			onOpenChange();
		}

		if (updateProjectGroupError) {
			const parseError = JSON.parse(updateProjectGroupError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [updateProjectGroupResult, updateProjectGroupError]);

	/* HANDLE SOFT DELETE GROUP */

	const {
		data: softDeleteProjectGroupResult,
		error: softDeleteProjectGroupError,
		// loading: softDeletingProjectGroup,
		fetch: softDeleteProjectGroup,
	} = useFetch<IAPIResponse>(API_ROUTE.PROJECT.SOFT_DELETE_GROUP(currentEditing ?? -1), {
		method: "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (softDeleteProjectGroupResult) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[softDeleteProjectGroupResult.message],
				color: "success",
			});
			fetchProjectGroups();
		}

		if (softDeleteProjectGroupError) {
			const parseError = JSON.parse(softDeleteProjectGroupError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [softDeleteProjectGroupResult, softDeleteProjectGroupError]);

	/* HANDLE RECOVER GROUP */

	const {
		data: recoverProjectGroupResult,
		error: recoverProjectGroupError,
		// loading: recoveringProjectGroup,
		fetch: recoverProjectGroup,
	} = useFetch<IAPIResponse>(API_ROUTE.PROJECT.RECOVER_GROUP(currentEditing ?? -1), {
		method: "PATCH",
		skip: true,
	});

	useEffect(() => {
		if (recoverProjectGroupResult) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[recoverProjectGroupResult.message],
				color: "success",
			});
			fetchProjectGroups();
		}

		if (recoverProjectGroupError) {
			const parseError = JSON.parse(recoverProjectGroupError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [recoverProjectGroupResult, recoverProjectGroupError]);

	/* HANDLE PERMANENT DELETE GROUP */

	const {
		data: deleteProjectGroupResult,
		error: deleteProjectGroupError,
		// loading: deletingProjectGroup,
		fetch: deleteProjectGroup,
	} = useFetch<IAPIResponse>(API_ROUTE.PROJECT.DELETE_GROUP(currentEditing ?? -1), {
		method: "DELETE",
		skip: true,
	});

	useEffect(() => {
		if (deleteProjectGroupResult) {
			addToast({
				title: "Success",
				description: MAP_MESSAGE[deleteProjectGroupResult.message],
				color: "success",
			});
			fetchProjectGroups();
		}

		if (deleteProjectGroupError) {
			const parseError = JSON.parse(deleteProjectGroupError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [deleteProjectGroupResult, deleteProjectGroupError]);

	/* HANDLE TABLE ACTION */

	const [tableAction, setTableAction] = useState<TTableAction | null>(null);

	useEffect(() => {
		if (!currentEditing || !tableAction) {
			return;
		}

		console.log("currentEditing", currentEditing);

		switch (tableAction) {
			case "edit":
				onOpen();
				break;
			case "softdel":
				softDeleteProjectGroup();
				break;
			case "recover":
				recoverProjectGroup();
				break;
			case "forcedel":
				deleteProjectGroup();
				break;
			default:
				break;
		}

		setTableAction(null);
	}, [tableAction, currentEditing]);

	const handleTableAction = (item: TProjectGroup, action: TTableAction) => {
		setCurrentEditing(item.group_id);
		setGroupTitle(item.group_title);
		setTableAction(action);
	};

	/* HANDLE ON CLOSE MODAL */

	useEffect(() => {
		if (!isOpen) {
			setCurrentEditing(null);
			setGroupTitle("");
		}
	}, [isOpen]);

	useEffect(() => {
		console.log("currentEditing", currentEditing);
	}, [currentEditing]);

	return (
		<div className={"flex flex-col gap-4"}>
			<Button
				className={"w-max"}
				color={"primary"}
				isDisabled={fetchingProjectGroups}
				startContent={ICON_CONFIG.NEW}
				onPress={onOpen}
			>
				Create new group
			</Button>
			<Table aria-label={"Project Groups"}>
				<TableHeader columns={listColumns}>
					{(column) => <TableColumn key={column.key} align={["action"].includes(column.key) ? "center" : "start"}>{column.title}</TableColumn>}
				</TableHeader>
				<TableBody
					aria-labelledby={"Project Groups"}
					emptyContent={<p className={"text-center"}>No project groups found</p>}
					isLoading={fetchingProjectGroups}
					items={listProjectGroups}
					loadingContent={<Spinner>Fetching groups...</Spinner>}
				>
					{(item) => (
						<TableRow key={item.group_id}>
							<TableCell className={"!text-left"}>{item.group_title}</TableCell>
							<TableCell>
								<TableCellAction
									buttonSize={"sm"}
									mode={item.is_deleted === 1}
									onEdit={() => handleTableAction(item, "edit")}
									onPermanentDelete={() => handleTableAction(item, "forcedel")}
									onRecover={() => handleTableAction(item, "recover")}
									onSoftDelete={() => handleTableAction(item, "softdel")}
								/>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>


			<CustomModal isOpen={isOpen}
				title={currentEditing ? "Edit Project Group" : "New Project Group"}
				onOpenChange={onOpenChange}
			>
				<CustomForm
					className={"flex flex-col gap-4 pb-4"}
					formId={"crudForm"}
					onSubmit={currentEditing ? updateProjectGroup : createProjectGroup}
				>
					<Input
						isRequired={true}
						label={"Group Title"}
						labelPlacement={"outside"}
						name={"group_title"}
						placeholder={"Enter project group title"}
						type={"text"}
						value={groupTitle}
						variant={"bordered"}
						onValueChange={setGroupTitle}
					/>
				</CustomForm>
			</CustomModal>
		</div>
	);
}
