"use client";

import { Button } from "@heroui/button";
import { useReactiveCookiesNext } from "cookies-next/client";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";
import { Navbar, NavbarContent, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@heroui/navbar";
import Image from "next/image";
import { useWindowSize } from "hieutndev-toolkit";

import packageJson from "../../../package.json";

import { BREAK_POINT } from "@/configs/break-point";
import { SITE_CONFIG } from "@/configs/site-config";

export default function AdminHorizontalNav() {

	const pathname = usePathname();

	const { deleteCookie } = useReactiveCookiesNext();

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const router = useRouter();

	const { width } = useWindowSize();

	const handleLogout = () => {
		deleteCookie("access_token", { path: "/" });
		deleteCookie("refresh_token", { path: "/" });
		deleteCookie("username", { path: "/" });
		router.push("/sign-in");
	};

	return (
		<section
			className={clsx("relative w-full flex justify-center items-center py-4 border-b", {
				"px-8": width > BREAK_POINT.LG,
				"px-4": width < BREAK_POINT.LG,
			})}
		>
			<div
				className={clsx("w-max absolute left-4 top-4")}
			>
				<Navbar
					classNames={{
						wrapper: "px-4",
					}}
					isMenuOpen={isMenuOpen}
					onMenuOpenChange={setIsMenuOpen}
				>
					<NavbarContent>
						<NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className={""} />
					</NavbarContent>

					<NavbarMenu className={"mt-4"}>
						{SITE_CONFIG.ADMIN_SIDEBAR_ITEMS.map((item, index) => (
							<NavbarMenuItem key={`${item}-${index}`}>
								<Button
									className={"justify-start"}
									color={pathname.startsWith(item.href) ? "primary" : "default"}
									fullWidth={true}
									size={"lg"}
									startContent={item.icon}
									variant={pathname.startsWith(item.href) ? "flat" : "light"}
									onPress={() => {
										router.push(item.href);
										setIsMenuOpen(false); // Close the menu after navigation
									}}
								>
									{item.label}
								</Button>
							</NavbarMenuItem>
						))}
						<p className="w-full text-center absolute left-0  bottom-8 text-xs text-gray-500">
							v{packageJson.version}
						</p>
					</NavbarMenu>

				</Navbar>
			</div>
			<div
				className={clsx({
					invisible: width > BREAK_POINT.LG,
				})}
			>
				<Image
					alt={SITE_CONFIG.NAME}
					className={"max-w-16 h-auto"}
					height={1200}
					src={SITE_CONFIG.LOGO.ONLY_ICON_BLACK}
					width={1200}
				/>
			</div>
		</section>
	);
}

{/* <div className={"flex items-center gap-2"}>
					{width >= BREAK_POINT.MD && (
						<Button
							color={"primary"}
							variant={"light"}
						>
							{hasCookie("email") ? `Welcome, ${getCookie("username") ?? ""}` : "Welcome!"}
						</Button>
					)}
					<Button
						isIconOnly
						color={"danger"}
						startContent={ICONS.LOG_OUT}
						variant={"light"}
						onPress={() => handleLogout()}
					/>
				</div> */}
