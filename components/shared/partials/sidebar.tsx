"use client";

import { addToast, Button } from "@heroui/react";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { useScroll, useFetch } from "hieutndev-toolkit";

import SidebarGroup from "./sidebar-group";

import API_ROUTE from "@/configs/api";
import ICON_CONFIG from "@/configs/icons";
import ROUTE_PATH from "@/configs/route-path";
import { IAPIResponse } from "@/types/global";
import { TProjectResponse, TProjectGroup } from "@/types/project";


// interface SidebarProps {}

export default function Sidebar() {
	const [listProjects, setListProjects] = useState<TProjectResponse[]>([]);
	const [listProjectGroups, setListProjectGroups] = useState<TProjectGroup[]>([]);
	const [isOpenMiniHeader, setIsOpenMiniHeader] = useState<boolean>(false);

	const {
		data: fetchProjectsResult,
		error: fetchProjectsError,
		// loading: fetchingProjects,
	} = useFetch<IAPIResponse<TProjectResponse[]>>(API_ROUTE.PROJECT.GET_ALL);

	useEffect(() => {
		if (fetchProjectsResult) {
			setListProjects(fetchProjectsResult?.results ?? []);
		}

		if (fetchProjectsError) {
			const parseError = JSON.parse(fetchProjectsError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: parseError.message,
					color: "danger",
				});
			}
		}
	}, [fetchProjectsResult, fetchProjectsError]);

	const {
		data: fetchProjectGroupsResult,
		error: fetchProjectGroupsError,
		loading: fetchingProjectGroups,
	} = useFetch<IAPIResponse<TProjectGroup[]>>(API_ROUTE.PROJECT.GET_ALL_GROUP);

	useEffect(() => {
		if (fetchProjectGroupsResult) {
			console.log("🚀 ~ Sidebar ~ fetchProjectGroupsResult:", fetchProjectGroupsResult)
			setListProjectGroups(fetchProjectGroupsResult?.results ?? []);
		}

		if (fetchProjectGroupsError) {
			const parseError = JSON.parse(fetchProjectGroupsError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: parseError.message,
					color: "danger",
				});
			}
		}
	}, [fetchProjectGroupsResult, fetchProjectGroupsError]);

	const { scrollPosition } = useScroll();

	return (
		<div className={"lg:w-max lg:relative absolute w-full z-10"}>
			<div className={"mobile-up lg:hidden fixed top-16 px-2 w-full"}>
				<div
					className={clsx("w-full p-2 rounded-b-2xl transition-all duration-300 ease-in-out", {
						"bg-dark/20 border border-dark/10": scrollPosition.top < 20,
						"bg-white border border-dark/10": scrollPosition.top >= 20,
					})}
				>
					<Button
						isIconOnly
						className={"lg:hidden"}
						radius={"md"}
						size={"md"}
						onPress={() => setIsOpenMiniHeader(!isOpenMiniHeader)}
					>
						{ICON_CONFIG.MENU}
					</Button>
				</div>
				<div
					className={clsx(
						"absolute top-0 right-0 h-screen w-3/4 bg-white p-4 shadow-lg border border-dark/10 z-100",
						{
							hidden: !isOpenMiniHeader,
							block: isOpenMiniHeader,
						}
					)}
				>
					{listProjectGroups
						.filter((item) => listProjects.filter((v) => v.group_id === item.group_id).length > 0)
						.map((group) => (
							<SidebarGroup
								key={group.group_id}
								groupItems={listProjects
									.filter((item) => item.group_id === group.group_id)
									.map((_v) => ({
										title: _v.project_shortname,
										href: ROUTE_PATH.CLIENT.PROJECTS.DETAILS(_v.slug),
									}))}
								isCloseDefault={
									listProjects.filter((item) => item.group_id === group.group_id).length <= 0
								}
								title={group.group_title}
								onItemClick={() => setIsOpenMiniHeader(false)}
							/>
						))}
				</div>
			</div>
			<div
				className={clsx(
					"tablet-up hidden py-8 sticky top-44 h-screen border-r border-r-dark/10",
					"2xl:pr-8",
					"xl:w-1/4",
					"lg:min-w-56 lg:flex lg:flex-col lg:gap-8 lg:pr-4"
				)}
			>
				{fetchingProjectGroups ? (
					<SidebarGroup
						groupItems={[]}
						isCloseDefault={false}
						title={"Loading..."}
					/>
				) : (
					listProjectGroups
						.filter((item) => listProjects.filter((v) => v.group_id === item.group_id).length > 0)
						.map((group, index) => (
							<SidebarGroup
								key={index}
								groupItems={listProjects
									.filter((item) => item.group_id === group.group_id)
									.map((_v) => ({
										title: _v.project_shortname,
										href: ROUTE_PATH.CLIENT.PROJECTS.DETAILS(_v.slug),
									}))}
								isCloseDefault={
									listProjects.filter((item) => item.group_id === group.group_id).length <= 0
								}
								title={group.group_title}
							/>
						))
				)}
			</div>
		</div>
	);
}
