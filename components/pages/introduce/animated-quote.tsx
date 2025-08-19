"use client";

import { useCallback, useEffect, useState } from "react";

import BlockQuote from "@/components/shared/block-quote";

interface AnimatedQuoteProps {
	renderText: string;
}

const AnimatedQuote = ({ renderText }: AnimatedQuoteProps) => {
	const [currentText, setCurrentText] = useState<string>("|");

	const renderAnimated = useCallback(async () => {
		for (let i = 0; i < renderText.length; i++) {
			await new Promise((resolve) => setTimeout(resolve, 50));
			setCurrentText(() => `${renderText.slice(0, i + 1)}${i + 1 !== renderText.length ? "|" : ""}`);
		}
	}, [renderText]);

	useEffect(() => {
		renderAnimated();
	}, []);

	return (
		<BlockQuote
			customClass={"font-ari-w9500 !not-italic font-normal text-primary-500 bg-primary/10 py-8 border-primary leading-tight"}
			size={"5xl"}
		>
			{currentText}
		</BlockQuote>
	);
};

export default AnimatedQuote;
