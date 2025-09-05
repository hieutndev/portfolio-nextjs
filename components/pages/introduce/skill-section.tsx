import clsx from "clsx";
import Image from "next/image";

import Container from "@/components/shared/container/container";
import { TSetting } from "@/types/settings";
import { nonAuthFetch } from "@/utils/non-auth-fetch";
import API_ROUTE from "@/configs/api";

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

	try {
		const response = await nonAuthFetch<TSetting>(API_ROUTE.SETTINGS.GET_SETTINGS, { cache: "force-cache", revalidate: 60 });

		if (response && response.status === "success" && response.results && typeof response.results.introduce === "string") {
			listSkills = response.results.skills || listSkills;
		}
	} catch (e) {
		console.error("Failed to load settings.introduce on server via nonAuthFetch:", e);
	}

	return (
		<Container orientation={"vertical"}>
			<h2 className={"section-title"}>🤹🏼 My Skills</h2>
			<div className={"flex flex-col gap-8"}>
				<div className={"ml-12 flex flex-col gap-2"}>
					<div
						className={
							"before:content-[''] before:bg-black before:-ml-4 before:h-1.5 before:w-1.5 before:rounded-full flex items-center gap-2"
						}
					>
						<h4 className={"section-subtitle"}>Techstacks</h4>
					</div>

					<div className={"flex flex-wrap items-center gap-8"}>
						{listSkills.techstacks.map((_v, index) => (
							<SkillIconBlock
								key={index}
								iconPath={_v}
							/>
						))}
					</div>
				</div>
				<div className={"ml-12 flex flex-col gap-2"}>
					<div
						className={
							"before:content-[''] before:bg-black before:-ml-4 before:h-1.5 before:w-1.5 before:rounded-full flex items-center gap-2"
						}
					>
						<h4 className={"section-subtitle"}>Development Tools</h4>
					</div>

					<div className={"flex flex-wrap items-center gap-8"}>
						{listSkills.development_tools.map((_v, index) => (
							<SkillIconBlock
								key={index}
								iconPath={_v}
							/>
						))}
					</div>
				</div>
				<div className={"ml-12 flex flex-col gap-4"}>
					<div
						className={
							"before:content-[''] before:bg-black before:-ml-4 before:h-1.5 before:w-1.5 before:rounded-full flex items-center gap-2"
						}
					>
						<h4 className={"section-subtitle"}>Office & Design Tools</h4>
					</div>

					<div className={"flex flex-wrap items-center gap-8"}>
						{listSkills.design_tools.map((_v, index) => (
							<SkillIconBlock
								key={index}
								iconPath={_v}
							/>
						))}
					</div>
				</div>
			</div>
		</Container>
	);
};
