"use client";

import { Image, Spinner } from "@heroui/react";
import { useFetch } from "hieutndev-toolkit";

import API_ROUTE from "@/configs/api";
import { TApp } from "@/types/application";
import { IAPIResponse } from "@/types/global";

interface MyAppsPageProps {}

export default function MyAppsPage({}: MyAppsPageProps) {
  const { data, loading } = useFetch<IAPIResponse<TApp[]>>(
    API_ROUTE.APP.GET_ALL
  );

  return (
    <div className={"grid grid-cols-3 gap-x-4 gap-y-8"}>
      {!loading && data?.results ? (
        data.results.map((app) => (
          <button
            key={app.app_id} // Ensure each item has a unique key
            className={
              "col-span-1 w-full flex flex-col items-center gap-4 cursor-pointer hover:scale-105 transition-all duration-300"
            }
            onClick={() => window.open(app.app_link)}>
            <Image
              isBlurred
              height={300}
              shadow={"sm"}
              src={app.app_icon || "/avatar.jpg"} // Use app-specific image if available
            />
            <p className={"text-xl font-semibold capitalize"}>{app.app_name}</p>
          </button>
        ))
      ) : (
        <div className={"col-span-3 flex justify-center min-h-[25vh]"}>
          <Spinner size={"lg"}>Fetching...</Spinner>
        </div>
      )}
    </div>
  );
}
