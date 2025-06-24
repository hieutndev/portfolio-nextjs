"use client";

import clsx from "clsx";
import { useState } from "react";
import { useReactiveCookiesNext } from "cookies-next/client";
import { useRouter } from "next/navigation";
import ICON_CONFIG from "@/configs/icons";
import useScroll from "../../../hooks/useScroll";
import ROUTE_PATH from "@/configs/route-path";
import { Button } from "@heroui/react";
import { SITE_CONFIG } from "@/configs/site-config";
import useScreenSize from "@/hooks/useScreenSize";
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

	const headerConfig = [
		{
			path: ROUTE_PATH.CLIENT.INDEX,
			label: "Introduce",
		},
		{
			path: ROUTE_PATH.CLIENT.MY_APPS,
			label: "My Apps",
		},
	];

	const [isOpenMiniHeader, setIsOpenMiniHeader] = useState<boolean>(false);
	const { width } = useScreenSize();

	return (
		<div
			className={clsx(
				"fixed bg-white flex justify-center w-full top-0 left-0 z-50 transition-all duration-300 ease-in-out lg:px-8 px-4 shadow-sm",
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
				<div
					className={"lg:max-w-80 max-w-40"}
					onClick={() => router.push(ROUTE_PATH.CLIENT.INDEX)}
				>
					<img
						src={SITE_CONFIG.LOGO.FULL_BLACK}
						alt=""
					/>
				</div>

				<div className={"tablet-up lg:flex lg:items-center lg:gap-2 hidden bg-white"}>
					{headerConfig.map((item, index) => (
						<Button
							key={index}
							variant={"light"}
							onPress={() => router.push(item.path)}
							className={"px-4"}
							size={"lg"}
						>
							{item.label}
						</Button>
					))}
					<Button
						size={"lg"}
						className={"px-4 bg-black text-white"}
					>
						tnh@hieutn.xyz
					</Button>

					<Button
						size={"lg"}
						variant={"light"}
						isIconOnly
						onPress={() =>
							router.push(
								hasCookie("refresh_token") ? ROUTE_PATH.ADMIN.ACCOUNT.INDEX : ROUTE_PATH.AUTH.SIGN_IN
							)
						}
					>
						{hasCookie("refresh_token") ? ICON_CONFIG.AUTH : ICON_CONFIG.UNAUTH}
					</Button>
					{hasCookie("refresh_token") && (
						<Button
							size={"lg"}
							variant={"light"}
							color={"danger"}
							isIconOnly
							onPress={handleSignOut}
						>
							{ICON_CONFIG.LOG_OUT}
						</Button>
					)}
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
							variant={"light"}
							onPress={() => {
								router.push(item.path);
								setIsOpenMiniHeader(false);
							}}
							className={"px-4"}
						>
							{item.label}
						</Button>
					))}
					<div className={"flex flex-col"}>
						<Button
							size={"lg"}
							variant={"light"}
							isIconOnly
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
								size={"lg"}
								variant={"light"}
								color={"danger"}
								isIconOnly
								onPress={handleSignOut}
							>
								{ICON_CONFIG.LOG_OUT}
							</Button>
						)}
					</div>
				</div>
				<Button
					size={"md"}
					radius={"md"}
					isIconOnly
					className={"lg:hidden"}
					onPress={() => setIsOpenMiniHeader(!isOpenMiniHeader)}
				>
					{ICON_CONFIG.MENU}
				</Button>
			</div>
		</div>
	);
};

export default ClientHeader;
