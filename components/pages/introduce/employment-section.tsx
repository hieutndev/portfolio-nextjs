"use server"


import { serverFetch } from "hieutndev-toolkit";

import SectionHeader from "./section-header";
import Timeline from "./timeline";

import API_ROUTE from "@/configs/api";
import { TEmployment } from "@/types/employment";
import { formatDate } from "@/utils/date";
import Container from "@/components/shared/container/container";
import { IAPIResponse } from "@/types/global";

export default async function EmploymentSection() {
	let listEmployment: TEmployment[] = [];

	try {
		const response = await serverFetch<IAPIResponse<TEmployment[]>>(API_ROUTE.EMPLOYMENT.GET_ALL, { cache: "force-cache", revalidate: 60 });

		if (response && response.status === "success" && Array.isArray(response.results)) {
			listEmployment = response.results as TEmployment[];
		}
	} catch (e) {
		console.error("Failed to fetch employment list on server:", e);
	}

	return (
		<Container orientation={"vertical"}>
			<SectionHeader iconAlt={"Employment"} iconSrc={"/assets/gif/job.gif"} title={"Employment History"} />
			<div className={"w-full lg:pl-20 pl-6"}>
				<Timeline items={listEmployment.length > 0 ? listEmployment.map((item) => ({
					date: `${formatDate(item.time_start, "onlyMonthYear")} - ${item.time_end ? formatDate(item.time_end, "onlyMonthYear") : "Present"}`,
					title: item.title,
					description: item.organization
				})) : []} />
			</div>
		</Container>
	);
}
