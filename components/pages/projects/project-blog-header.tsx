"use client";

import Container from "@/components/shared/container/container";
import { Avatar, Button, Divider, Image } from "@heroui/react";
import { TProject } from "@/types/project";
import ICON_CONFIG from "@/configs/icons";
import { formatDate, getLastUpdatedTime } from "@/utils/date";

interface ProjectBlogHeaderProps {
  project: TProject;
}

export default function ProjectBlogHeader({ project }: ProjectBlogHeaderProps) {
  return (
    <Container className="!p-4 " orientation="vertical" gapSize={8}>
      <div className={"flex flex-col gap-4"}>
        <h1
          className={
            "w-full text-wrap text-left text-primary text-6xl font-black leading-tight tracking-tight"
          }>
          {project.project_fullname}
        </h1>
        <p className={"w-5/6 text-sm text-left"}>{project.short_description}</p>
        <div className={"flex items-center gap-4"}>
          <Avatar src={"/avatar.jpg"} isBordered={true} size={"sm"} />
          <p className={"text-sm"}>Tran Ngoc Hieu</p>
          <Divider orientation="vertical" />
          {project.updated_at !== project.created_at && (
            <p className={"text-sm"}>
              Updated at {getLastUpdatedTime(project.updated_at)}
            </p>
          )}
          {project.updated_at === project.created_at && (
            <p className={"text-sm"}>
              Posted on {formatDate(project.created_at, "onlyDate")}
            </p>
          )}
        </div>
      </div>
      <Image
        src={project.project_thumbnail}
        width={1920}
        shadow={"sm"}
        isBlurred
        className={"rounded-none border-0"}
        alt={project.project_fullname}
      />
    </Container>
  );
}
