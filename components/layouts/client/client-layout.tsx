import Container from "@/components/shared/container/container";
import ClientHeader from "@/components/shared/partials/client-header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={"relative"}>
			<ClientHeader />
			<div className={"relative lg:mt-44 mt-32 min-h-[100vh] h-max bg-white flex justify-center xl:px-0 lg:px-8"}>
				<Container className={"2xl:max-w-7xl xl:max-w-6xl lg:max-w-5xl py-0"}>
					{/* <Sidebar /> */}
					{children}
				</Container>
			</div>
		</div>
	);
}
