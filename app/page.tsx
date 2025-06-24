import AnimatedQuote from "@/components/pages/homepage/animated-quote";
import CertificationSection from "@/components/pages/homepage/certification-section";
import EducationSection from "@/components/pages/homepage/education-section";
import EmploymentSection from "@/components/pages/homepage/employment-section";
import SkillSection from "@/components/pages/homepage/skill-section";
import Container from "@/components/shared/container/container";
import { Divider } from "@heroui/react";

import "./intro.css";

export default function HomePage() {
	return (
		<Container
			className={"p-4"}
			orientation={"vertical"}
			gapSize={4}
		>
			<div className={"flex flex-col gap-8"}>
				<h2 className={"text-3xl font-bold"}>👋 Hey there!</h2>
				<p className={"text-xl text-justify"}>My name is Tran Ngoc Hieu,</p>
				<p className={"text-xl"}>
					I have just graduated with a{" "}
					<strong>Bachelor's degree in Information Technology - majoring in Website Development</strong>
				</p>
				<p className={"text-xl"}>
					I am looking for an opportunity for a position as a <strong>Website Developer Intern</strong>{" "}
				</p>
				<AnimatedQuote renderText={"Let's think, then plan and do it."} />
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
