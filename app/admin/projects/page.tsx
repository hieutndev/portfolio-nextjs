"use client";

import { useWindowSize } from "hieutndev-toolkit";
import { Divider } from "@heroui/react";

import Container from "@/components/shared/container/container";
import AdminHeader from "@/components/shared/partials/admin-header";
import ProjectGroupsManagement from "@/components/pages/projects/project-groups-management";
import ProjectManagement from "@/components/pages/projects/project-management";
import { BREAK_POINT } from "@/configs/break-point";


export default function ProjectManagementPage() {

	const { width } = useWindowSize();

	return (
		<Container
			shadow
			className={"border border-default-200 rounded-2xl"}
			orientation={"vertical"}
		>
			<AdminHeader
				breadcrumbs={["Admin", "Projects Management"]}
				title={"Projects Management"}
			/>
			<div className={"grid lg:grid-cols-4 grid-cols-1 lg:gap-x-4 gap-y-4 "}>
				<div className={"col-span-1"}>
					<ProjectGroupsManagement />
				</div>
				{width < BREAK_POINT.LG && <Divider className={"col-span-1"} />}
				<div className={"lg:col-span-3"}>
					<ProjectManagement />
				</div>
			</div>
		</Container>
	);
}
