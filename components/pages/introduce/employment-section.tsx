"use client";

import { useEffect, useState } from "react";
import { addToast, Spinner } from "@heroui/react";

import AchievementRow from "./achievement-row";

import API_ROUTE from "@/configs/api";
import { useFetch } from "@/hooks/useFetch";
import { TEmployment } from "@/types/employment";
import { IAPIResponse } from "@/types/global";
import { formatDate } from "@/utils/date";
import Container from "@/components/shared/container/container";

// interface EmploymentSectionProps {}

const EmploymentSection = () => {
	const [listEmployment, setListEmployment] = useState<TEmployment[]>([]);

	const {
		data: fetchEmploymentResult,
		error: fetchEmploymentError,
		loading: fetchingEmployment,
	} = useFetch<IAPIResponse<TEmployment[]>>(API_ROUTE.EMPLOYMENT.GET_ALL);

	useEffect(() => {
		if (fetchEmploymentResult) {
			setListEmployment(fetchEmploymentResult.results ?? []);
		}

		if (fetchEmploymentError) {
			const parseError = JSON.parse(fetchEmploymentError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: parseError.message,
					color: "danger",
				});
			}
		}
	}, [fetchEmploymentResult, fetchEmploymentError]);

	return (
		<Container orientation={"vertical"}>
			<h2 className={"section-title"}>🏢 Employment History</h2>
			<ul className={"flex flex-col gap-8 list-disc"}>
				{fetchingEmployment ? (
					<div className={"ml-12"}>
						<Spinner size={"md"} />
					</div>
				) : listEmployment.length > 0 ? (
					listEmployment.map((_, index) => (
						<AchievementRow
							key={index}
							organization={_.organization}
							time={`${formatDate(_.time_start, "onlyMonthYear")} - ${formatDate(
								_.time_end,
								"onlyMonthYear"
							)}`}
							title={_.title}
						/>
					))
				) : (
					<p className={"ml-12 italic"}>No work experience.</p>
				)}
			</ul>
		</Container>
	);
};

export default EmploymentSection;
