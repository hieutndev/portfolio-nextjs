"use server";

import Image from "next/image";

import AchievementRow from "./achievement-row";

import Container from "@/components/shared/container/container";
import API_ROUTE from "@/configs/api";
import { nonAuthFetch } from "@/utils/non-auth-fetch";
import { TCertification } from "@/types/certification";
import { formatDate } from "@/utils/date";
import SectionHeader from "./section-header";
import Timeline from "./timeline";

export default async function CertificationSection() {
	let listCertification: TCertification[] = [];

	try {
		const response = await nonAuthFetch<TCertification[]>(
			API_ROUTE.CERTIFICATION.GET_ALL,
			{ cache: "force-cache", revalidate: 60 }
		);

		if (
			response &&
			response.status === "success" &&
			Array.isArray(response.results)
		) {
			listCertification = response.results as TCertification[];
		}
	} catch (e) {
		console.error("Failed to fetch certification list on server:", e);
	}

	return (
		<Container orientation={"vertical"}>
			<SectionHeader iconAlt={"Certification"} iconSrc={"/assets/gif/certificate.gif"} title={"My Certificates"} />
			{/* <ul className={"flex flex-col gap-8 list-disc"}>
				{listCertification.length > 0 ? (
					listCertification.map((item, index) => (
						<AchievementRow
							key={index}
							organization={item.issued_by}
							time={formatDate(item.issued_date, "onlyDate")}
							title={item.title}
						/>
					))
				) : (
					<p className={"ml-12 italic"}>No educational background.</p>
				)}
			</ul> */}

			<div className={"w-full pl-20"}>
				<Timeline items={
					listCertification.length > 0 ? listCertification.map((item) => ({
						date: formatDate(item.issued_date, "onlyDate"),
						title: item.title,
						description: item.issued_by,
					})) : []
				} />
			</div>
		</Container>
	);
}
