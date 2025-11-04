"use client";

import { Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function NotFound() {

  const router = useRouter();

  useEffect(() => {
    router.push("/not-found");
  }, []);

  return (
    <Spinner />
  );
}
