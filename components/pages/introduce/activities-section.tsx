"use client"


import Image from "next/image";

import SectionHeader from "./section-header";

import Container from "@/components/shared/container/container";


export default function ActivitiesSection() {

    return (
        <Container orientation={"vertical"}>
            <SectionHeader iconAlt={"Activities"} iconSrc={"/assets/gif/activities.gif"} title={"Activities"}/>
            <div className={"lg:pl-20 pl-6 flex flex-col gap-8 w-full"}>
                <div className="flex flex-col">
                    <div
                        className={
                            "min-w-max before:-ms-1.5 before:content-[''] before:bg-gray-300 before:size-3 before:rounded-full flex items-center gap-4"
                        }
                    >
                        <h3 className={"max-w-screen-sm break-all text-xl font-bold tracking-wide"}>Top Languages by WakaTime</h3>
                    </div>
                    <a className={"mt-4 ml-6"} href="https://wakatime.com/@4233684e-fddd-4115-88f8-2bba89039fa8">
                        <img alt="wakatime badge"
                             src="https://wakatime.com/badge/user/4233684e-fddd-4115-88f8-2bba89039fa8.svg"/>
                    </a>
                    <Image
                        unoptimized
                        alt="hieutndev's WakaTime stats"
                        className={"lg:w-1/2 w-full"}
                        height="1200"
                        src="https://github-readme-stats.vercel.app/api/wakatime?username=hieutndev&layout=compact&hide_border=true&theme=shadow_blue&langs_count=10&hide_title=true"
                        width="1200"
                    />
                </div>

                <div className="flex flex-col">
                    <div
                        className={
                            "before:-ms-1.5 before:content-[''] before:bg-gray-300 before:size-3 before:rounded-full flex items-center gap-4"
                        }
                    >
                        <h3 className={"text-xl font-bold tracking-wide"}>Github Activity Graph</h3>
                    </div>

                    <Image
                        unoptimized
                        alt="activity-graph graph"
                        className={"w-full"}
                        height="1200"
                        src="https://github-readme-activity-graph.vercel.app/graph?username=hieutndev&radius=16&theme=github-light&area=true&order=5&hide_border=false&hide_title=true"
                        width="1200"
                    />
                </div>
            </div>
        </Container>
    );
}
