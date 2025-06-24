"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Spinner } from "@heroui/spinner";

export default function NonAuthLayout({ children }: { children: React.ReactNode }) {
	const router = useRouter();

	// useEffect(() => {
	// 	if (isLoggedIn) {
	// 		// Redirect to dashboard or home page if already signed in
	// 		router.push("/"); // Adjust the path as needed
	// 	}
	// }, [isLoggedIn]);

	return (
		<div className={"w-screen h-screen"}>
			{/* {detecting ? (
				<div className={"w-full h-full flex items-center justify-center"}>
					<Spinner size={"lg"} />
				</div>
			) : (
				children
			)} */}
			{children}
		</div>
	);
}
