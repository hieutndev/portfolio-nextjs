"use client";

import { Input } from "@heroui/react";
import { useState, useEffect } from "react";

import ICON_CONFIG from "@/configs/icons";

interface SearchInputProps {
	placeholder?: string;
	value?: string;
	onSearch: (searchTerm: string) => void;
	debounceMs?: number;
	className?: string;
	size?: "sm" | "md" | "lg";
}

export default function SearchInput({
	placeholder = "Search...",
	value = "",
	onSearch,
	debounceMs = 500,
	className = "",
	size = "md",
}: SearchInputProps) {
	const [searchTerm, setSearchTerm] = useState(value);

	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			onSearch(searchTerm);
		}, debounceMs);

		return () => clearTimeout(timer);
	}, [searchTerm, debounceMs, onSearch]);

	// Update local state when external value changes
	useEffect(() => {
		setSearchTerm(value);
	}, [value]);

	return (
		<Input
			isClearable
			className={className}
			placeholder={placeholder}
			size={size}
			startContent={ICON_CONFIG.SEARCH}
			value={searchTerm}
			variant={"bordered"}
			onClear={() => setSearchTerm("")}
			onValueChange={setSearchTerm}
		/>
	);
}
