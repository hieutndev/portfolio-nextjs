"use client";

import { useWindowSize } from "hieutndev-toolkit";
import { Divider } from "@heroui/react";

import Container from "@/components/shared/container/container";
import AdminHeader from "@/components/shared/partials/admin-header";
import BlogManagement from "@/components/pages/blogs/blog-management";
import { BREAK_POINT } from "@/configs/break-point";
import BlogCategoriesManagement from "@/components/pages/blogs/blog-categories-management";


export default function BlogManagementPage() {

	const { width } = useWindowSize();

	return (
		<Container
			shadow
			className={"border border-default-200 rounded-2xl"}
			orientation={"vertical"}
		>
			<AdminHeader
				breadcrumbs={["Admin", "Blogs Management"]}
				title={"Blogs Management"}
			/>
			<div className={"grid lg:grid-cols-4 grid-cols-1 lg:gap-x-4 gap-y-4 "}>
				<div className={"col-span-1"}>
					<BlogCategoriesManagement />
				</div>
				{width < BREAK_POINT.LG && <Divider className={"col-span-1"} />}
				<div className={"lg:col-span-3"}>
					<BlogManagement />
				</div>
			</div>
		</Container>
	);
}
