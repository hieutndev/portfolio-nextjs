"use client"
import Image from "next/image";
import { Button } from "@heroui/react";
import Link from "next/link";

import Container from "@/components/shared/container/container";
import ICON_CONFIG from "@/configs/icons";

export default function NotFoundPage() {
    return (
        <Container className={"min-h-80 flex flex-col gap-4 items-center justify-center"} orientation={"vertical"}>
            <Image alt={"404 error image"} height={256} src="/assets/gif/404-error.gif" width={256} />
            <h1 className={"text-8xl font-bold text-primary"}>404</h1>
            <h3 className={"text-4xl text-primary font-semibold"}>Page Not Found</h3>
            <p className={"text-gray-600"}>The page you&apos;re looking for doesn&apos;t exist or may have been removed.</p>

            <Button as={Link} color={"primary"} href={"/"} startContent={ICON_CONFIG.BACK} variant={"flat"}>Go Back Home</Button>
        </Container>
    );
}