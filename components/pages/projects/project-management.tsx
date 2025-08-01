"use client";

import TableCellAction from "@/components/shared/tables/table-cell-action";
import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { useFetch } from "@/hooks/useFetch";
import { IAPIResponse } from "@/types/global";
import { TProject, TProjectResponse } from "@/types/project";
import { TTableAction } from "@/types/table";
import { formatDate } from "@/utils/date";
import {
	addToast,
	Button,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	toast,
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { list } from "postcss";
import { useState, useEffect } from "react";

export default function ProjectManagement() {
	const listColumns = [
		{
			key: "id",
			title: "Project ID",
		},
		{
			key: "project_shortname",
			title: "Project Name",
		},
		{
			key: "group",
			title: "Group",
		},
		{
			key: null,
			title: "Project Duration",
		},
		{
			key: "action",
			title: "Action",
		},
	];
	const router = useRouter();

	const [listProjects, setListProjects] = useState<TProjectResponse[]>([]);
	const [selectedId, setSelectedId] = useState<TProject["id"] | null>(null);

	/* HANDLE FETCH PROJECT */

	const {
		data: fetchProjectResult,
		error: fetchProjectError,
		loading: fetchingProject,
		fetch: fetchProject,
	} = useFetch<IAPIResponse<TProjectResponse[]>>(API_ROUTE.PROJECT.GET_ALL);
	useEffect(() => {
		if (fetchProjectResult) {
			setListProjects(fetchProjectResult.results ?? []);
		}

		if (fetchProjectError) {
			const parseError = JSON.parse(fetchProjectError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [fetchProjectResult, fetchProjectError]);

	/* HANDLE DELETE PROJECT */

	const {
		data: deleteProjectResult,
		error: deleteProjectError,
		loading: deletingProject,
		fetch: deleteProject,
	} = useFetch<IAPIResponse>(API_ROUTE.PROJECT.DELETE_PROJECT(selectedId ?? ""), {
		method: "DELETE",
		skip: true,
	});

	useEffect(() => {
		if (deleteProjectResult) {
			fetchProject();
		}

		if (deleteProjectError) {
			const parseError = JSON.parse(deleteProjectError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [deleteProjectResult, deleteProjectError]);

	/* HANDLE TABLE ACTION */

	const [tableAction, setTableAction] = useState<TTableAction | null>(null);

	const handleTableAction = (project: TProjectResponse, action: TTableAction) => {
		setSelectedId(project.id);
		setTableAction(action);
	};

	useEffect(() => {
		if (!selectedId || !tableAction) {
			return;
		}

		switch (tableAction) {
			case "view":
				window.open(ROUTE_PATH.CLIENT.PROJECT.DETAILS(selectedId));
				break;
			case "edit":
				router.push(ROUTE_PATH.ADMIN.PROJECT.EDIT(selectedId));
				break;
			case "softdel":
				deleteProject();
				break;
			default:
				break;
		}

		setTableAction(null);
	}, [tableAction, selectedId]);

	return (
		<div className={"flex flex-col gap-4"}>
			<Button
				startContent={ICON_CONFIG.NEW}
				onPress={() => router.push(ROUTE_PATH.ADMIN.PROJECT.NEW)}
				className={"w-max"}
				isDisabled={fetchingProject}
				color={"primary"}
			>
				Creat new project
			</Button>
			<Table aria-label={"Projects"}>
				<TableHeader>
					{listColumns.map((column) => (
						<TableColumn key={column.key} align={["action"].includes(column.key) ? "center" : "start"}>{column.title}</TableColumn>
					))}
				</TableHeader>
				<TableBody items={listProjects}
					isLoading={fetchingProject}
					loadingContent={<Spinner>Fetching projects...</Spinner>}
					emptyContent={<p className={"text-center"}>"No projects found"</p>}
				>
					{(project) => (
						<TableRow>
							<TableCell>{project.id}</TableCell>
							<TableCell>{project.project_shortname}</TableCell>
							<TableCell>{project.group_title}</TableCell>
							<TableCell>{formatDate(project.start_date, "onlyDate")} - {formatDate(project.end_date, "onlyDate")}</TableCell>
							<TableCell>
								<TableCellAction
									buttonSize={"sm"}
									mode={project.is_deleted === 1}
									showViewButton
									onEdit={() => router.push(ROUTE_PATH.ADMIN.PROJECT.EDIT(project.id))}
									onSoftDelete={() => handleTableAction(project, "softdel")}
									onViewDetails={() => handleTableAction(project, "view")}
								/>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
}
