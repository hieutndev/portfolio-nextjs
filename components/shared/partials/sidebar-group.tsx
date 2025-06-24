"use client";

import { FaChevronUp } from "react-icons/fa6";
import { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/navigation";

export type SidebarGroupItem = {
	title: string;
	href: string;
};
interface SidebarGroupProps {
	title: string;
	groupItems: SidebarGroupItem[];
	isCloseDefault: boolean;
	onItemClick?: () => void;
}

const SidebarGroup = ({ title, groupItems, isCloseDefault, onItemClick }: SidebarGroupProps) => {
	const router = useRouter();
	const [isFold, setIsFold] = useState<boolean>(isCloseDefault);

	return (
		<div className={"flex flex-col gap-4"}>
			<div
				className={"flex items-center justify-between cursor-pointer gap-4"}
				onClick={() => setIsFold(!isFold)}
			>
				<div className={"flex items-center gap-1 no-select"}>
					<h3 className={"text-2xl font-bold transition-all duration-300 lg:hidden xl:visible"}>📁</h3>
					<h3 className={"text-2xl font-bold transition-all duration-300"}>{title}</h3>
				</div>
				<FaChevronUp
					className={clsx("text-lg transition-all duration-300", {
						"rotate-180": !isFold,
					})}
				/>
			</div>
			<div
				className={clsx("flex flex-col w-full pl-6 transition-all duration-500 overflow-hidden ease-in-out", {
					"opacity-0 max-h-0": isFold,
					"opacity-100 max-h-64": !isFold,
				})}
				onClick={onItemClick}
			>
				{groupItems.map((item) => (
					<div
						className={"w-full cursor-pointer group py-2 hover:pl-2 transition-all duration-300"}
						onClick={() => router.push(item.href)}
						key={item.href}
					>
						<p className={"w-full group-hover:text-dark-200 transition-all duration-300 text-lg"}>
							{item.title}
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default SidebarGroup;
