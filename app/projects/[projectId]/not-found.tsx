"use client";

import Container from "@/components/shared/container/container";
import ICON_CONFIG from "@/configs/icons";
import { Button } from "@heroui/react";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container
      className={"!p-8 items-center justify-center"}
      orientation={"vertical"}>
      <div className={"text-center flex flex-col gap-4"}>
        <h1 className={"text-6xl font-bold text-primary"}>404</h1>
        <h2 className={"text-4xl font-bold text-primary"}>
          Project Not Found
        </h2>
        <p className={"text-gray-600 max-w-md"}>
          The project you're looking for doesn't exist or may have been removed.
        </p>
        <div
          className={
            "flex flex-col sm:flex-row gap-4 justify-center items-center mt-6"
          }>
          <Button
            as={Link}
            href={"/projects"}
            color={"primary"}
            className={"w-full sm:w-auto"}
            
            startContent={ICON_CONFIG.BACK}
            >
            Back to Projects
          </Button>
        </div>
      </div>
    </Container>
  );
}
