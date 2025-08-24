"use client";

import { Pagination as HeroUIPagination, Select, SelectItem } from "@heroui/react";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	totalItems: number;
	itemsPerPage: number;
	onPageChange: (page: number) => void;
	onItemsPerPageChange: (itemsPerPage: number) => void;
	itemsPerPageOptions?: number[];
	showItemsPerPage?: boolean;
	className?: string;
}

export default function CustomPagination({
	currentPage,
	totalPages,
	totalItems,
	itemsPerPage,
	onPageChange,
	onItemsPerPageChange,
	itemsPerPageOptions = [10, 25, 50, 100],
	showItemsPerPage = true,
	className = "",
}: PaginationProps) {
	const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
	const endItem = Math.min(currentPage * itemsPerPage, totalItems);

	if (totalPages <= 1 && !showItemsPerPage) {
		return null;
	}

	return (
		<div className={`flex items-center justify-between gap-4 ${className}`}>
			{/* Items info and per page selector */}
			<div className="flex items-center gap-4">
				<span className="text-tiny text-default-500">
					Showing {startItem} to {endItem} of {totalItems} entries
				</span>
				{showItemsPerPage && (
					<div className="flex items-center gap-2 border-l pl-4 border-default-200">
						<span className="text-tiny text-default-500">Show:</span>
						<Select
							className={"w-16"}
							classNames={{
								listboxWrapper: "min-w-max",
								popoverContent: "p-0 rounded-lg"
							}}
							radius={"lg"}
							selectedKeys={[itemsPerPage.toString()]}
							size={"sm"}
							variant={"underlined"}
							onSelectionChange={(keys) => {
								const selectedValue = Array.from(keys)[0] as string;

								onItemsPerPageChange(parseInt(selectedValue));
							}}
						>
							{itemsPerPageOptions.map((option) => (
								<SelectItem key={option.toString()}>
									{option.toString()}
								</SelectItem>
							))}
						</Select>
					</div>
				)}
			</div>

			{/* HeroUI Pagination */}
			{totalPages > 0 && (
				<HeroUIPagination
					showControls
					showShadow
					color="primary"
					page={currentPage}
					size="sm"
					total={totalPages}
					onChange={onPageChange}
				/>
			)}
		</div>
	);
}
