"use client";

import { BreadcrumbItem, Breadcrumbs, Button, ButtonProps, Divider } from "@heroui/react";
import { useRouter } from "next/navigation";

type BackButtonConfig = {
	text: string;
	href: string;
} & Omit<ButtonProps, "children" | "type" | "isIconOnly" | "isShowBackground">;

interface AdminHeaderProps {
	title: string;
	backButton?: BackButtonConfig;
	customElement?: React.ReactNode;
	breadcrumbs?: string[];
}

export default function AdminHeader({ title, backButton, customElement, breadcrumbs }: AdminHeaderProps) {
	const router = useRouter();

	return (
		<div className={"w-full flex flex-col gap-4"}>
			<div className={"w-full flex items-center justify-between"}>
				<h1 className={"text-4xl font-bold text-primary-500"}>{title}</h1>
				<div className={"flex items-center gap-2"}>
					{customElement}
					{backButton && (
						<Button
							size={backButton.size}
							color={backButton.color}
							startContent={backButton.startContent}
							endContent={backButton.endContent}
							onPress={() => router.push(backButton.href)}
						>
							{backButton.text}
						</Button>
					)}
				</div>
			</div>
			{breadcrumbs && (
				<Breadcrumbs>
					{breadcrumbs.map((label, index) => (
						<BreadcrumbItem key={index}>{label}</BreadcrumbItem>
					))}
				</Breadcrumbs>
			)}
			<Divider />
		</div>
	);
}
