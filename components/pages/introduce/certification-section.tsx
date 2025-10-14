"use server";



import { serverFetch } from "hieutndev-toolkit";

import SectionHeader from "./section-header";
import Timeline from "./timeline";

import Container from "@/components/shared/container/container";
import API_ROUTE from "@/configs/api";
import { TCertification } from "@/types/certification";
import { formatDate } from "@/utils/date";
import { IAPIResponse } from "@/types/global";

export default async function CertificationSection() {
	let listCertification: TCertification[] = [];

	try {
		const response = await serverFetch<IAPIResponse<TCertification[]>>(
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
			<div className={"w-full lg:pl-20 pl-6"}>
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
