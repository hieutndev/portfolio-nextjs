"use server"

import SectionHeader from "./section-header";
import Timeline from "./timeline";

import Container from "@/components/shared/container/container";
import API_ROUTE from "@/configs/api";
import { nonAuthFetch } from "@/utils/non-auth-fetch";
import { TEducation } from "@/types/education";

export default async function EducationSection() {
	let listEducation: TEducation[] = [];

	try {
		const response = await nonAuthFetch<TEducation[]>(API_ROUTE.EDUCATION.GET_ALL, { cache: "force-cache", revalidate: 60 });

		if (response && response.status === "success" && Array.isArray(response.results)) {
			listEducation = response.results as TEducation[];
		}
	} catch (e) {
		console.error("Failed to fetch education list on server:", e);
	}

	return (
		<Container orientation={"vertical"}>
			<SectionHeader iconAlt={"My Education"} iconSrc={"/assets/gif/education.gif"} title={"My Education"} />
			<div className={"w-full pl-20"}>
				<Timeline items={
					listEducation.length > 0 ? listEducation.map((item) => ({
						date: item.time_end ? `${new Date(item.time_start).getFullYear()} - ${new Date(item.time_end).getFullYear()}` : `${new Date(item.time_start).getFullYear()} - Present`,
						title: item.title,
						description: item.organization,
					})) : []
				} />
			</div>
		</Container>
	);
}
