"use client";

import { Avatar, Divider, Image } from "@heroui/react";

import Container from "@/components/shared/container/container";
import { TProject } from "@/types/project";
import { formatDate, getLastTimeString } from "@/utils/date";
import ICON_CONFIG from "@/configs/icons";

interface ProjectBlogHeaderProps {
  project: TProject;
}

export default function ProjectBlogHeader({ project }: ProjectBlogHeaderProps) {
  return (
    <Container gapSize={8} orientation="vertical">
      <div className={"flex flex-col gap-4"}>
        <h1
          className={
            "w-full text-wrap text-left text-6xl font-black leading-tight tracking-tight"
          }>
          {project.project_fullname}
        </h1>
        <p className={"w-5/6 text-sm text-left"}>{project.short_description}</p>
        <div className={"flex items-center gap-4"}>
          <Avatar isBordered={true} size={"sm"} src={"/avatar.jpg"} />
          <p className={"text-sm"}>Tran Ngoc Hieu</p>
          <Divider orientation="vertical" />
          {project.updated_at !== project.created_at && (
            <p className={"text-sm"}>
              Updated at {getLastTimeString(project.updated_at)}
            </p>
          )}
          {project.updated_at === project.created_at && (
            <p className={"text-sm"}>
              Posted on {formatDate(project.created_at, "onlyDate")}
            </p>
          )}
          <Divider orientation="vertical" />
          <div className={"flex items-center justify-start gap-1 text-gray-400"}>
            {ICON_CONFIG.VIEW}
            <p>{project.views}</p>
          </div>
        </div>
      </div>
      <Image
        isBlurred
        alt={project.project_fullname}
        className={"rounded-none border-0"}
        shadow={"sm"}
        src={project.project_thumbnail}
        width={1920}
      />
    </Container>
  );
}
