import clsx from "clsx";
import Image from "next/image";
import { serverFetch } from "nextage-toolkit";

import SectionHeader from "./section-header";

import Container from "@/components/shared/container/container";
import { TSetting } from "@/types/settings";
import API_ROUTE from "@/configs/api";
import { IAPIResponse } from "@/types/global";

const SkillIconBlock = ({ iconPath }: { iconPath: string }) => (
	<div className={clsx("h-12 w-12", "xl:w-14 xl:h-14", "lg:w-12 lg:h-12", "")}>
		<Image alt={iconPath} className="w-full h-full" height={48} src={iconPath} width={48} />
	</div>
);

export default async function SkillSection() {

	let listSkills: TSetting['skills'] = {
		techstacks: [],
		development_tools: [],
		design_tools: [],
	};

	const response = await serverFetch<IAPIResponse<TSetting>>(API_ROUTE.SETTINGS.GET_SETTINGS, { cache: "force-cache", revalidate: 60 });

	if (response && response.status === "success" && response.results && typeof response.results.introduce === "string") {
		listSkills = response.results.skills || listSkills;
	}

	return (
		<Container orientation={"vertical"}>
			<SectionHeader iconAlt={"Skills"} iconSrc={"/assets/gif/skill.gif"} title={"My Skills"} />
			<div className={"flex flex-col gap-8"}>
				<div className={"pl-20 flex flex-col gap-4"}>
					<div
						className={
							"before:-ms-1.5 before:content-[''] before:bg-primary before:size-3 before:rounded-full flex items-center gap-4"
						}
					>
						<h3 className={"text-xl font-bold tracking-wide"}>Techstacks</h3>
					</div>

					<div className={"pl-8 flex flex-wrap items-center gap-8"}>
						{listSkills.techstacks.map((_v, index) => (
							<SkillIconBlock
								key={index}
								iconPath={_v}
							/>
						))}
					</div>
				</div>
				<div className={"pl-20 flex flex-col gap-4"}>
					<div
						className={
							"before:-ms-1.5 before:content-[''] before:bg-primary before:size-3 before:rounded-full flex items-center gap-4"
						}
					>
						<h3 className={"text-xl font-bold tracking-wide"}>Development Tools</h3>
					</div>

					<div className={"pl-8 flex flex-wrap items-center gap-8"}>
						{listSkills.development_tools.map((_v, index) => (
							<SkillIconBlock
								key={index}
								iconPath={_v}
							/>
						))}
					</div>
				</div>
				<div className={"pl-20 flex flex-col gap-4"}>
					<div
						className={
							"before:-ms-1.5 before:content-[''] before:bg-primary before:size-3 before:rounded-full flex items-center gap-4"
						}
					>
						<h3 className={"text-xl font-bold tracking-wide"}>Office & Design Tools</h3>
					</div>

					<div className={"pl-8 flex flex-wrap items-center gap-8"}>
						{listSkills.design_tools.map((_v, index) => (
							<SkillIconBlock
								key={index}
								iconPath={_v}
							/>
						))}
					</div>
				</div>
			</div>
		</Container >
	);
};
