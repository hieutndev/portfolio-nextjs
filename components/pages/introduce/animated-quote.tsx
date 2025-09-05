"use client";

import { useEffect, useRef, useState } from "react";

import BlockQuote from "@/components/shared/block-quote";

interface AnimatedQuoteProps {
	renderText: string;
}

export default function AnimatedQuote({ renderText }: AnimatedQuoteProps) {
	const [currentText, setCurrentText] = useState<string>("|");
	const mounted = useRef(true);

	useEffect(() => {
		mounted.current = true;
		setCurrentText("|");

		const typingSpeed = 50;
		let idx = 0;

		const id = setInterval(() => {
			if (!mounted.current) return;
			idx += 1;
			const showing = renderText.slice(0, idx);

			setCurrentText(showing + (idx < renderText.length ? "|" : ""));
			if (idx >= renderText.length) {
				clearInterval(id);
			}
		}, typingSpeed);

		return () => {
			mounted.current = false;
			clearInterval(id);
		};
	}, [renderText]);

	return (
		<BlockQuote
			customClass={"font-ari-w9500 !not-italic font-normal text-primary-500 bg-primary/10 py-8 border-primary leading-tight"}
			size={"5xl"}
		>
			{currentText}
		</BlockQuote>
	);
}
 
