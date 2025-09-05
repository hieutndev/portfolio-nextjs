"use server"

import AchievementRow from "./achievement-row";

import Container from "@/components/shared/container/container";
import API_ROUTE from "@/configs/api";
import { nonAuthFetch } from "@/utils/non-auth-fetch";
import { TEducation } from "@/types/education";
import { formatDate } from "@/utils/date";

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
			<h2 className={"section-title"}>🎓 Education</h2>
			<ul className={"flex flex-col gap-8 list-disc"}>
				{listEducation.length > 0 ? (
					listEducation.map((item, index) => (
						<AchievementRow
							key={index}
							organization={item.organization}
							time={`${formatDate(item.time_start, "onlyMonthYear")} - ${
								item.time_end ? formatDate(item.time_end, "onlyMonthYear") : "Present"
							}`}
							title={item.title}
						/>
					))
				) : (
					<p className={"ml-12 italic"}>No educational background.</p>
				)}
			</ul>
		</Container>
	);
}
