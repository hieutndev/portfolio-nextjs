"use server"

import AchievementRow from "./achievement-row";

import API_ROUTE from "@/configs/api";
import { nonAuthFetch } from "@/utils/non-auth-fetch";
import { TEmployment } from "@/types/employment";
import { formatDate } from "@/utils/date";
import Container from "@/components/shared/container/container";

export default async function EmploymentSection() {
	let listEmployment: TEmployment[] = [];

	try {
		const response = await nonAuthFetch<TEmployment[]>(API_ROUTE.EMPLOYMENT.GET_ALL, { cache: "force-cache", revalidate: 60 });

		if (response && response.status === "success" && Array.isArray(response.results)) {
			listEmployment = response.results as TEmployment[];
		}
	} catch (e) {
		console.error("Failed to fetch employment list on server:", e);
	}

	return (
		<Container orientation={"vertical"}>
			<h2 className={"section-title"}>🏢 Employment History</h2>
			<ul className={"flex flex-col gap-8 list-disc"}>
				{listEmployment.length > 0 ? (
					listEmployment.map((item, index) => (
						<AchievementRow
							key={index}
							organization={item.organization}
							time={`${formatDate(item.time_start, "onlyMonthYear")} - ${item.time_end ? formatDate(
								item.time_end,
								"onlyMonthYear"
							) : "Present"}`}
							title={item.title}
						/>
					))
				) : (
					<p className={"ml-12 italic"}>No work experience.</p>
				)}
			</ul>
		</Container>
	);
}
