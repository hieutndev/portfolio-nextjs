"use client";

import Container from "@/components/shared/container/container";
import API_ROUTE from "@/configs/api";
import { useFetch } from "@/hooks/useFetch";
import { TApp } from "@/types/application";
import { IAPIResponse } from "@/types/global";
import { Image, Spinner } from "@heroui/react";

interface MyAppsPageProps {}

export default function MyAppsPage({}: MyAppsPageProps) {
  const { data, error, loading } = useFetch<IAPIResponse<TApp[]>>(
    API_ROUTE.APP.GET_ALL
  );

  return (
    <div className={"grid grid-cols-3 gap-4"}>
      {!loading && data?.results ? (
        data.results.map((app) => (
          <div
            key={app.app_id} // Ensure each item has a unique key
            className={
              "col-span-1 w-full flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition-all duration-300"
            }
            onClick={() => window.open(app.app_link)}
            >
            <Image
              src={app.app_icon || "/avatar.jpg"} // Use app-specific image if available
              isBlurred
              height={200}
              shadow={"sm"}
            />
            <p className={"text-xl font-semibold capitalize"}>{app.app_name}</p>
          </div>
        ))
      ) : (
        <div className={"col-span-3 flex justify-center min-h-[25vh]"}>
          <Spinner size={"lg"}>Fetching...</Spinner>
        </div>
      )}
    </div>
  );
}
