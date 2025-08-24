"use client";

import clsx from "clsx";
import { Image } from "@heroui/react";

import Container from "@/components/shared/container/container";

const SkillIconBlock = ({ iconPath }: { iconPath: string }) => (
	<div className={clsx("h-12 w-12", "xl:w-14 xl:h-14", "lg:w-12 lg:h-12", "")}>
		<Image className="w-full h-full" radius="none" src={iconPath} />
	</div>
);

const SkillSection = () => {
	const listTechStacks = [
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",

		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original-wordmark.svg",

		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original-wordmark.svg",

		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original-wordmark.svg",
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg",
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original-wordmark.svg",
	];

	const listTools = [
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original-wordmark.svg",
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",

		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/phpstorm/phpstorm-original.svg",
	];

	const listDesignTools = [
		"https://img.icons8.com/?size=100&id=pGHcje298xSl&format=png&color=000000",
		"https://img.icons8.com/?size=100&id=UECmBSgBOvPT&format=png&color=000000",
		"https://img.icons8.com/?size=100&id=ifP93G7BXUhU&format=png&color=000000",
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg",
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/illustrator/illustrator-original.svg",
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
		"https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/canva/canva-original.svg",
	];

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
						{listTechStacks.map((_v, index) => (
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
						{listTools.map((_v, index) => (
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
						{listDesignTools.map((_v, index) => (
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

export default SkillSection;
