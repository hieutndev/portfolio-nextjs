"use client";

import { addToast, Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

import AchievementRow from "./achievement-row";

import Container from "@/components/shared/container/container";
import API_ROUTE from "@/configs/api";
import { useFetch } from "@/hooks/useFetch";
import { TCertification } from "@/types/certification";
import { IAPIResponse } from "@/types/global";
import { formatDate } from "@/utils/date";

const CertificationSection = () => {
	const [listCertification, setListCertification] = useState<TCertification[]>([]);

	const {
		data: fetchCertificationResult,
		error: fetchCertificationError,
		loading: fetchingCertification,
	} = useFetch<IAPIResponse<TCertification[]>>(API_ROUTE.CERTIFICATION.GET_ALL);

	useEffect(() => {
		if (fetchCertificationResult) {
			setListCertification(fetchCertificationResult.results ?? []);
		}

		if (fetchCertificationError) {
			const parseError = JSON.parse(fetchCertificationError);

			if (parseError.message) {
				addToast({
					title: "Error",
					description: parseError.message,
					color: "danger",
				});
			}
		}
	}, [fetchCertificationResult, fetchCertificationError]);

	return (
		<Container orientation={"vertical"}>
			<h2 className={"section-title"}>📜 Certification</h2>
			<ul className={"flex flex-col gap-8 list-disc"}>
				{fetchingCertification ? (
					<div className={"ml-12"}>
						<Spinner />
					</div>
				) : listCertification.length > 0 ? (
					listCertification.map((_, index) => (
						<AchievementRow
							key={index}
							organization={_.issued_by}
							time={formatDate(_.issued_date, "onlyDate")}
							title={_.title}
						/>
					))
				) : (
					<p className={"ml-12 italic"}>No educational background.</p>
				)}
			</ul>
		</Container>
	);
};

export default CertificationSection;
