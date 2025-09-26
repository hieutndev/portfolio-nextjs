"use client";

import clsx from "clsx";
import { useState } from "react";
import { useReactiveCookiesNext } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { Button, Image } from "@heroui/react";
import { useScroll, useWindowSize } from "nextage-toolkit";

import ICON_CONFIG from "@/configs/icons";
import ROUTE_PATH from "@/configs/route-path";
import { SITE_CONFIG } from "@/configs/site-config";
import { BREAK_POINT } from "@/configs/break-point";

// interface HeaderProps {}

const ClientHeader = () => {
	const { scrollPosition } = useScroll();

	const router = useRouter();

	const { deleteCookie, hasCookie } = useReactiveCookiesNext();

	const handleSignOut = () => {
		deleteCookie("access_token");
		deleteCookie("refresh_token");
		deleteCookie("role");
		router.push(ROUTE_PATH.AUTH.SIGN_IN);
	};

    // icon ♾️🗃️📂📁💻

	const headerConfig = [
        // {
        //     path: ROUTE_PATH.CLIENT.BLOGS.INDEX,
        //     label: "📰 Blogs",
        // },
		{
			path: ROUTE_PATH.CLIENT.PROJECTS.INDEX,
			label: "🗂️ Projects",
		},
		{
			path: ROUTE_PATH.CLIENT.MY_APPS,
			label: "🧑‍💻 My apps",
		},
		
	];

	const [isOpenMiniHeader, setIsOpenMiniHeader] = useState<boolean>(false);
	const { width } = useWindowSize();

	return (
		<div
			className={clsx(
				"fixed bg-white flex justify-center w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out lg:px-8 px-4 shadow-md",
				{
					"lg:py-16 py-4": scrollPosition.top < 100,
					"lg:py-8 py-4 lg:shadow-xl shadow-md": scrollPosition.top >= 100,
				}
			)}
		>
			<div
				className={clsx("w-full flex items-center justify-between max-w-full", {
					"px-32": width >= BREAK_POINT.XXL,
					"px-8": width >= BREAK_POINT.M && width < BREAK_POINT.XL,
				})}
			>
				<button
					className={"lg:max-w-80 max-w-40 outline-none"}
					onClick={() => router.push(ROUTE_PATH.CLIENT.INDEX)}
				>
					<Image
						className={"cursor-pointer max-h-12"}
						radius={"none"}
						src={SITE_CONFIG.LOGO.FULL_BLACK}


					/>
				</button>

				<div className={"tablet-up lg:flex lg:items-center lg:gap-2 hidden bg-white"}>
					{headerConfig.map((item, index) => (
						<Button
							key={index}
							className={"px-4"}
							size={"lg"}
							variant={"light"}
							onPress={() => router.push(item.path)}
						>
							{item.label}
						</Button>
					))}
					<Button
						className={"px-4 bg-black text-white"}
						size={"lg"}
					>
						📮 Email Me
					</Button>
				</div>
				<div
					className={clsx("mobile-up lg:hidden", {
						hidden: !isOpenMiniHeader,
						"absolute bg-white shadow-xl left-0 top-16 w-full flex flex-col gap-4": isOpenMiniHeader,
					})}
				>
					{headerConfig.map((item, index) => (
						<Button
							key={index}
							className={"px-4"}
							variant={"light"}
							onPress={() => {
								router.push(item.path);
								setIsOpenMiniHeader(false);
							}}
						>
							{item.label}
						</Button>
					))}
					<div className={"flex flex-col"}>
						<Button
							isIconOnly
							size={"lg"}
							variant={"light"}
							onPress={() => {
								setIsOpenMiniHeader(false);
								router.push(
									hasCookie("refresh_token")
										? ROUTE_PATH.ADMIN.ACCOUNT.INDEX
										: ROUTE_PATH.AUTH.SIGN_IN
								);
							}}
						>
							{hasCookie("refresh_token") ? ICON_CONFIG.AUTH : ICON_CONFIG.UNAUTH}
						</Button>
						{hasCookie("refresh_token") && (
							<Button
								isIconOnly
								color={"danger"}
								size={"lg"}
								variant={"light"}
								onPress={handleSignOut}
							>
								{ICON_CONFIG.LOG_OUT}
							</Button>
						)}
					</div>
				</div>
				<Button
					isIconOnly
					className={"lg:hidden"}
					radius={"md"}
					size={"md"}
					onPress={() => setIsOpenMiniHeader(!isOpenMiniHeader)}
				>
					{ICON_CONFIG.MENU}
				</Button>
			</div>
		</div>
	);
};

export default ClientHeader;
