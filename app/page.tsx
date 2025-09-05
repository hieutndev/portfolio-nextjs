import { Divider } from "@heroui/react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import AnimatedQuote from "@/components/pages/introduce/animated-quote";
import CertificationSection from "@/components/pages/introduce/certification-section";
import EducationSection from "@/components/pages/introduce/education-section";
import EmploymentSection from "@/components/pages/introduce/employment-section";
import SkillSection from "@/components/pages/introduce/skill-section";
import Container from "@/components/shared/container/container";
import API_ROUTE from "@/configs/api";
import { nonAuthFetch } from "@/utils/non-auth-fetch";
import "./intro.css";
import { TSetting } from "@/types/settings";

export default async function HomePage() {
	let introduceMarkdown = "";
	let animatedQuote = "";

	try {
		const response = await nonAuthFetch<TSetting>(API_ROUTE.SETTINGS.GET_SETTINGS, { cache: "force-cache", revalidate: 60 });

		if (response && response.status === "success" && response.results && typeof response.results.introduce === "string") {
			introduceMarkdown = response.results.introduce;
			animatedQuote = response.results.animated_quote;
		}
	} catch (e) {
		console.error("Failed to load settings.introduce on server via nonAuthFetch:", e);
	}

	return (
		<Container
			className={"p-4"}
			gapSize={4}
			orientation={"vertical"}
		>
			<div className={"flex flex-col gap-8"}>
				{/* Render markdown from settings.introduce when available, otherwise fall back to default text */}
				{introduceMarkdown ? (
					<article className="prose max-w-none prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-headings:text-gray-900 prose-p:text-lg prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900 prose-code:text-red-600 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
						<MDXRemote
							options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight] } }}
							source={introduceMarkdown}
						/>
					</article>
				) : (
					<>
						<h2 className={"text-3xl font-semibold"}>👋 Hey there!</h2>
						<p className={"text-xl text-justify"}>My name is Tran Ngoc Hieu,</p>
						<p className={"text-xl"}>
							I have just graduated with a{" "}
							<strong>Bachelor&apos;s degree in Information Technology - majoring in Website Development</strong>
						</p>
						<p className={"text-xl"}>
							I am looking for an opportunity for a position as a <strong>Website Developer Intern</strong>{" "}
						</p>
					</>
				)}
				<AnimatedQuote renderText={animatedQuote} />
			</div>

			<Divider />

			<EducationSection />

			<Divider />

			<CertificationSection />

			<Divider />

			<EmploymentSection />

			<Divider />

			<SkillSection />
		</Container>
	);
}
