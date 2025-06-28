"use client";

import Container from "@/components/shared/container/container";
import API_ROUTE from "@/configs/api";
import { useFetch } from "@/hooks/useFetch";
import { TEducation } from "@/types/education";
import { IAPIResponse } from "@/types/global";
import { addToast, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";
import AchievementRow from "./achievement-row";
import { formatDate } from "@/utils/date";

const EducationSection = () => {
	const [listEducation, setListEducation] = useState<TEducation[]>([]);

	const {
		data: fetchEducationResult,
		error: fetchEducationError,
		loading: fetchingEducation,
	} = useFetch<IAPIResponse<TEducation[]>>(API_ROUTE.EDUCATION.GET_ALL);

	useEffect(() => {
		if (fetchEducationResult) {
			setListEducation(fetchEducationResult.results ?? []);
		}

		if (fetchEducationError) {
			const parseError = JSON.parse(fetchEducationError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: parseError.message,
					color: "danger",
				});
			}
		}
	}, [fetchEducationResult, fetchEducationError]);

	return (
		<Container orientation={"vertical"}>
			<h2 className={"section-title"}>🎓 Education</h2>
			<ul className={"flex flex-col gap-8 list-disc"}>
				{fetchingEducation ? (
					<div className={"ml-12"}>
						<Spinner size={"md"} />
					</div>
				) : listEducation.length > 0 ? (
					listEducation.map((_, index) => (
						<AchievementRow
							key={index}
							title={_.title}
							organization={_.organization}
							time={`${formatDate(_.time_start, "onlyMonthYear")} - ${
								_.time_end ? formatDate(_.time_end, "onlyMonthYear") : "Present"
							}`}
						/>
					))
				) : (
					<p className={"ml-12 italic"}>No educational background.</p>
				)}
			</ul>
		</Container>
	);
};

export default EducationSection;
