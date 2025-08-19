import clsx from "clsx";

import { TSizeBase } from "@/types/global";

interface BlockQuoteProps {
	size?: Extract<TSizeBase, "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl">;
	customClass?: string;
	children: React.ReactNode;
}

const BlockQuote = ({ size = "md", customClass, children }: BlockQuoteProps) => {
	const MapTextSize: Record<NonNullable<BlockQuoteProps["size"]>, string> = {
		sm: "text-sm",
		md: "text-md",
		lg: "text-lg",
		xl: "text-xl",
		"2xl": "text-2xl",
		"3xl": "text-3xl",
		"4xl": "text-4xl",
		"5xl": "text-5xl",
		"6xl": "text-6xl",
		"7xl": "text-7xl",
	};

	const MapBorderLeft: Record<NonNullable<BlockQuoteProps["size"]>, string> = {
		sm: "border-l",
		md: "border-l",
		lg: "border-l",
		xl: "border-l-2",
		"2xl": "border-l-2",
		"3xl": "border-l-[3px]",
		"4xl": "border-l-[3px]",
		"5xl": "border-l-4",
		"6xl": "border-l-4",
		"7xl": "border-l-4",
	};

	return (
		<blockquote className={clsx("pl-6 italic", MapBorderLeft[size], MapTextSize[size], customClass)}>
			{children}
		</blockquote>
	);
};

export default BlockQuote;
