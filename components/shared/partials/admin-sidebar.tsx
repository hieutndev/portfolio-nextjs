"use client";

import { Button } from "@heroui/button";
import { SITE_CONFIG } from "@/configs/site-config";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Divider } from "@heroui/react";
import clsx from "clsx";

export default function AdminSidebar() {
	const pathname = usePathname();

	const router = useRouter();

	return (
		<div className={"min-w-80 h-full flex flex-col items-center gap-8 p-8 rounded-e-2xl border border-gray-300"}>
			<div className={"h-max max-w-56"}>
				<Image
					src={SITE_CONFIG.LOGO.FULL_BLACK}
					alt={"logo"}
					width={1200}
					height={1200}
					className={"w-full h-max object-contain cursor-pointer"}
					onClick={() => router.push("/")}
				/>
			</div>
			<Divider />
			<div className={"w-full flex flex-col gap-4"}>
				{SITE_CONFIG.ADMIN_SIDEBAR_ITEMS.map((item) => (
					<Button
						key={item.href}
						onPress={() => router.push(item.href)}
						color={pathname.startsWith(item.href) ? "primary" : "default"}
						size={"lg"}
						variant={pathname.startsWith(item.href) ? "flat" : "light"}
						className={clsx("justify-start", {
							"text-default-400": !pathname.startsWith(item.href),
						})}
						fullWidth
						startContent={item.icon}
					>
						{item.label}
					</Button>
				))}
			</div>
		</div>
	);
}
