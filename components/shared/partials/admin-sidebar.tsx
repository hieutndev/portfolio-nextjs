"use client";

import { Button } from "@heroui/button";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Divider } from "@heroui/react";
import clsx from "clsx";

import { SITE_CONFIG } from "@/configs/site-config";

export default function AdminSidebar() {
	const pathname = usePathname();

	const router = useRouter();

	return (
		<div className={"w-1/6 fixed h-full flex flex-col items-center gap-8 p-8 rounded-e-2xl border border-gray-300"}>
			<div className={"h-max max-w-56"}>
				<Image
					alt={"logo"}
					className={"w-full h-max object-contain cursor-pointer"}
					height={1200}
					src={SITE_CONFIG.LOGO.FULL_BLACK}
					width={1200}
					onClick={() => router.push("/")}
				/>
			</div>
			<Divider />
			<div className={"w-full flex flex-col gap-4"}>
				{SITE_CONFIG.ADMIN_SIDEBAR_ITEMS.map((item) => (
					<Button
						key={item.href}
						fullWidth
						className={clsx("justify-start", {
							// "text-default-400": !pathname.startsWith(item.href),
						})}
						color={pathname.startsWith(item.href) ? "primary" : "default"}
						size={"lg"}
						startContent={item.icon}
						variant={pathname.startsWith(item.href) ? "flat" : "light"}
						onPress={() => router.push(item.href)}
					>
						{item.label}
					</Button>
				))}
			</div>
		</div>
	);
}
