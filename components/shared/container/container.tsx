"use client";

import clsx from "clsx";
import { useWindowSize } from "nextage-toolkit";

import { BREAK_POINT } from "@/configs/break-point";

interface ContainerProps {
	orientation?: "horizontal" | "vertical";
	gapSize?: number;
	className?: string;
	shadow?: boolean;
	children: React.ReactNode;
}

export default function Container({
	orientation = "horizontal",
	gapSize = 4,
	className,
	shadow = false,
	children,
}: ContainerProps) {
	const WrapperOrientationClass: Record<string, string> = {
		horizontal: "flex flex-row",
		vertical: "flex flex-col",
	};

	const { width } = useWindowSize();

	const WrapperGapClass: string = `gap-${gapSize}`;

	return (
		<div
			className={clsx("w-full h-full", WrapperOrientationClass[orientation], WrapperGapClass, className, {
				"shadow-lg": shadow,
				"p-8": width > BREAK_POINT.S,
				"p-4": width <= BREAK_POINT.S,
			})}
		>
			{children}
		</div>
	);
}
