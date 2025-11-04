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
import { useFetch } from "hieutndev-toolkit";

import TableCellAction from "@/components/shared/tables/table-cell-action";
import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import { MAP_MESSAGE } from "@/configs/response-message";
import ROUTE_PATH from "@/configs/route-path";
import { IAPIResponse } from "@/types/global";
import { TBlog, TBlogResponse } from "@/types/blog";
import { TTableAction } from "@/types/table";
import { formatDate } from "@/utils/date";
import SearchInput from "@/components/shared/search/search-input";
import CustomPagination from "@/components/shared/custom-pagination/custom-pagination";

export default function BlogManagement() {
	const listColumns = [
		{
			key: "id",
			title: "Blog ID",
		},
		{
			key: "title",
			title: "Blog Title",
		},
		{
			key: "categories",
			title: "Categories",
		},
		{
			key: "published_status",
			title: "Status",
		},
		{
			key: "published_date",
			title: "Published Date",
		},
		{
			key: "action",
			title: "Action",
		},
	];
	const router = useRouter();

	const [listBlogs, setListBlogs] = useState<TBlogResponse[]>([]);
	const [selectedId, setSelectedId] = useState<TBlog["id"] | null>(null);

	// Search and pagination state
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(10);
	const [totalItems, setTotalItems] = useState(0);
	const [totalPages, setTotalPages] = useState(0);

	/* HANDLE FETCH BLOGS */

	const {
		data: fetchBlogResult,
		error: fetchBlogError,
		loading: fetchingBlog,
		fetch: fetchBlog,
	} = useFetch<IAPIResponse<TBlogResponse[]>>(API_ROUTE.BLOG.GET_ALL, {
		search: searchTerm,
		page: currentPage,
		limit: itemsPerPage,
	});

	// Handle fetch blogs result
	useEffect(() => {
		if (fetchBlogResult) {
			setListBlogs(fetchBlogResult.results ?? []);
			setTotalItems((fetchBlogResult as any).metadata?.totalCount || 0);
			setTotalPages((fetchBlogResult as any).metadata?.totalPages || 0);
		}

		if (fetchBlogError) {
			const parseError = JSON.parse(fetchBlogError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [fetchBlogResult, fetchBlogError]);

	// Fetch blogs when search or pagination changes
	useEffect(() => {
		fetchBlog();
	}, [searchTerm, currentPage, itemsPerPage]);

	/* HANDLE DELETE BLOG */

	const {
		data: deleteBlogResult,
		error: deleteBlogError,
		// loading: deletingBlog,
		fetch: deleteBlog,
	} = useFetch<IAPIResponse>(API_ROUTE.BLOG.DELETE_BLOG(selectedId ?? -1), {
		method: "DELETE",
		skip: true,
	});

	useEffect(() => {
		if (deleteBlogResult) {
			fetchBlog();
		}

		if (deleteBlogError) {
			const parseError = JSON.parse(deleteBlogError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: MAP_MESSAGE[parseError.message],
					color: "danger",
				});
			}
		}
	}, [deleteBlogResult, deleteBlogError]);

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

	const handleTableAction = (blog: TBlogResponse, action: TTableAction) => {
		setSelectedId(blog.id);
		setTableAction(action);
	};

	useEffect(() => {
		if (!selectedId || !tableAction) {
			return;
		}

		switch (tableAction) {
			case "view":
				window.open(ROUTE_PATH.CLIENT.BLOGS.DETAILS(fetchBlogResult?.results?.find(item => item.id == selectedId)?.slug ?? -1, true));
				break;
			case "edit":
				router.push(ROUTE_PATH.ADMIN.BLOG.EDIT(fetchBlogResult?.results?.find(item => item.id == selectedId)?.slug ?? -1));
				break;
			case "softdel":
				deleteBlog();
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
					isDisabled={fetchingBlog}
					startContent={ICON_CONFIG.NEW}
					onPress={() => router.push(ROUTE_PATH.ADMIN.BLOG.NEW)}
				>
					Create new blog
				</Button>
				<div className="w-80">
					<SearchInput
						placeholder="Search blogs by title or category..."
						value={searchTerm}
						onSearch={handleSearch}
					/>
				</div>
			</div>
			<Table
				isHeaderSticky
				aria-label={"Blogs"}
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
					emptyContent={<p className={"text-center"}>No blogs found</p>}
					isLoading={fetchingBlog}
					items={listBlogs}
					loadingContent={<Spinner>Fetching blogs...</Spinner>}
				>
					{(blog) => (
						<TableRow key={blog.id}>
							<TableCell>{blog.id}</TableCell>
							<TableCell>{blog.title}</TableCell>
							<TableCell>
								{blog.category_title || 'No categories'}
							</TableCell>
							<TableCell>
								<span className={`px-2 py-1 rounded-full text-xs font-medium ${blog.published_status === 'published' ? 'bg-green-100 text-green-800' :
										blog.published_status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
											'bg-gray-100 text-gray-800'
									}`}>
									{blog.published_status}
								</span>
							</TableCell>
							<TableCell>
								{formatDate(blog.published_date, "onlyDate")}
							</TableCell>
							<TableCell>
								<TableCellAction
									showViewButton
									buttonSize={"sm"}
									mode={blog.is_deleted === 1}
									onEdit={() => router.push(ROUTE_PATH.ADMIN.BLOG.EDIT(blog.id))}
									onSoftDelete={() => handleTableAction(blog, "softdel")}
									onViewDetails={() => handleTableAction(blog, "view")}
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
