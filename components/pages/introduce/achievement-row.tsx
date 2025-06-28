import clsx from "clsx";

interface AchievementRowProps {
	title?: string;
	organization?: string;
	time?: string;
}

const AchievementRow = ({
	title = "Title of the achievement",
	organization = "Organization",
	time = "12/24",
}: AchievementRowProps) => (
	<div className={"flex flex-col gap-2 ml-12"}>
		<div
			className={
				"before:content-[''] before:bg-black before:-ml-4 before:h-1.5 before:w-1.5 before:rounded-full flex items-center gap-2 w-full"
			}
		>
			<h4 className={"text-xl font-semibold"}>{title}</h4>
		</div>
		<div className={clsx("flex gap-2", "lg:items-center lg:flex-row", "flex-col items-start")}>
			<p>{organization}</p>
			<p className={"lg:block hidden"}>|</p>
			<p>{time}</p>
		</div>
	</div>
);

export default AchievementRow;
