"use client";

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
} from "@heroui/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import TableCellAction from "@/components/shared/tables/table-cell-action";
import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { useFetch } from "hieutndev-toolkit";
import { IAPIResponse } from "@/types/global";
import { TProject, TProjectResponse } from "@/types/project";
import { TTableAction } from "@/types/table";
import { formatDate } from "@/utils/date";
import SearchInput from "@/components/shared/search/search-input";
import CustomPagination from "@/components/shared/custom-pagination/custom-pagination";

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
			key: '',
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

	// Search and pagination state
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [totalItems, setTotalItems] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	/* HANDLE FETCH PROJECT */

	const {
		data: fetchProjectResult,
		error: fetchProjectError,
		loading: fetchingProject,
		fetch: fetchProject,
	} = useFetch<IAPIResponse<TProjectResponse[]>>(API_ROUTE.PROJECT.GET_ALL, {
		search: searchTerm,
		page: currentPage,
		limit: itemsPerPage,
	});

	// Handle fetch projects result
	useEffect(() => {
		if (fetchProjectResult) {
			setListProjects(fetchProjectResult.results ?? []);
			setTotalItems((fetchProjectResult as any).metadata?.totalCount || 0);
			setTotalPages((fetchProjectResult as any).metadata?.totalPages || 0);
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

	// Fetch projects when search or pagination changes
	useEffect(() => {
		fetchProject();
	}, [searchTerm, currentPage, itemsPerPage]);

	/* HANDLE DELETE PROJECT */

	const {
		data: deleteProjectResult,
		error: deleteProjectError,
		// loading: deletingProject,
		fetch: deleteProject,
	} = useFetch<IAPIResponse>(API_ROUTE.PROJECT.DELETE_PROJECT(selectedId ?? -1), {
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

		console.log(fetchProjectResult?.results)
		console.log(fetchProjectResult?.results?.find(item => item.id == selectedId))
		console.log(fetchProjectResult?.results?.find(item => item.id == selectedId)?.slug)

		switch (tableAction) {
			case "view":
				window.open(ROUTE_PATH.CLIENT.PROJECTS.DETAILS(fetchProjectResult?.results?.find(item => item.id == selectedId)?.slug ?? -1));
				break;
			case "edit":
				router.push(ROUTE_PATH.ADMIN.PROJECT.EDIT(fetchProjectResult?.results?.find(item => item.id == selectedId)?.slug ?? -1));
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
			<div className="flex items-center flex-wrap justify-between gap-4">
				<Button
					className={"w-max"}
					color={"primary"}
					isDisabled={fetchingProject}
					startContent={ICON_CONFIG.NEW}
					onPress={() => router.push(ROUTE_PATH.ADMIN.PROJECT.NEW)}
				>
					Create new project
				</Button>
				<div className="w-80">
					<SearchInput
						placeholder="Search projects by name or group..."
						value={searchTerm}
						onSearch={handleSearch}
					/>
				</div>
			</div>
			<Table
				isHeaderSticky
				aria-label={"Projects"}
				classNames={{
					wrapper: "h-[60vh]",
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
					emptyContent={<p className={"text-center"}>No projects found</p>}
					isLoading={fetchingProject}
					items={listProjects}
					loadingContent={<Spinner>Fetching projects...</Spinner>}
				>
					{(project) => (
						<TableRow>
							<TableCell>{project.id}</TableCell>
							<TableCell>{project.project_shortname}</TableCell>
							<TableCell>{project.group_title}</TableCell>
							<TableCell>
								{formatDate(project.start_date, "onlyDate")} -{" "}
								{formatDate(project.end_date, "onlyDate")}
							</TableCell>
							<TableCell>
								<TableCellAction
									showViewButton
									buttonSize={"sm"}
									mode={project.is_deleted === 1}
									onEdit={() => router.push(ROUTE_PATH.ADMIN.PROJECT.EDIT(project.id))}
									onSoftDelete={() => handleTableAction(project, "softdel")}
									onViewDetails={() => handleTableAction(project, "view")}
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
	);
}
