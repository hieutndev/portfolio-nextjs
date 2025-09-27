"use client";

import { Button } from "@heroui/button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Divider, Tooltip } from "@heroui/react";
import clsx from "clsx";
import { useWindowSize } from "hieutndev-toolkit";

import packageJson from "../../../package.json";

import { SITE_CONFIG } from "@/configs/site-config";
import { BREAK_POINT } from "@/configs/break-point";

export default function AdminSidebar() {
	const pathname = usePathname();

	const router = useRouter();

	const { width } = useWindowSize();

	return (
		<div
			className={clsx("relative top-0 left-0 h-full px-4 py-8 flex flex-col gap-8 items-center shadow-lg", {
				"w-full": width > BREAK_POINT.XL,
				"w-max": width <= BREAK_POINT.XL,
			})}
		>
			<div className={"h-max max-w-56"}>
				<Image
					alt={"logo"}
					className={"w-28 2xl:w-full h-max object-contain cursor-pointer"}
					height={1200}
					src={width < BREAK_POINT.XXL ? SITE_CONFIG.LOGO.ONLY_ICON_BLACK : SITE_CONFIG.LOGO.FULL_BLACK}
					width={1200}
					onClick={() => router.push("/")}
				/>
			</div>
			<Divider />
			<div className={"w-full flex flex-col items-center 2xl:items-start gap-4"}>
				{SITE_CONFIG.ADMIN_SIDEBAR_ITEMS.map((item) => (
					width < BREAK_POINT.XXL
						? <Tooltip key={item.href} content={item.label} placement={"right"} showArrow={true}>
							<Button
								className={clsx("2xl:justify-start", {
									// "text-default-400": !pathname.startsWith(item.href),
								})}
								color={pathname.startsWith(item.href) ? "primary" : "default"}
								fullWidth={width >= BREAK_POINT.XXL}
								isIconOnly={width < BREAK_POINT.XXL}
								size={"lg"}
								startContent={item.icon}
								variant={pathname.startsWith(item.href) ? "flat" : "light"}
								onPress={() => router.push(item.href)}
							>
								{width < BREAK_POINT.XXL ? '' : item.label}
							</Button>
						</Tooltip>
						: <Button
							key={item.href}
							className={clsx("2xl:justify-start", {
								// "text-default-400": !pathname.startsWith(item.href),
							})}
							color={pathname.startsWith(item.href) ? "primary" : "default"}
							fullWidth={width >= BREAK_POINT.XXL}
							isIconOnly={width < BREAK_POINT.XXL}
							size={"lg"}
							startContent={item.icon}
							variant={pathname.startsWith(item.href) ? "flat" : "light"}
							onPress={() => router.push(item.href)}
						>
							{width < BREAK_POINT.XXL ? '' : item.label}
						</Button>
				))}
			</div>
			<p className="w-full text-center absolute left-0 bottom-8 text-xs text-gray-500">
				v{packageJson.version}
			</p>
		</div>
	);
}
