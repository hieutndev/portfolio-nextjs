"use client";

import { Input } from "@heroui/react";
import ICON_CONFIG from "@/configs/icons";
import { useState, useEffect } from "react";

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
			placeholder={placeholder}
			value={searchTerm}
			onValueChange={setSearchTerm}
			startContent={ICON_CONFIG.SEARCH}
			size={size}
			className={className}
			isClearable
			onClear={() => setSearchTerm("")}
			variant={"bordered"}
		/>
	);
}
