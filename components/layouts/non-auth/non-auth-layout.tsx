"use client";

export default function NonAuthLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={"w-screen h-screen"}>
			{children}
		</div>
	);
}
