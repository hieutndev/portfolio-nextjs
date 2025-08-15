"use client";

import { FaChevronUp } from "react-icons/fa6";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";

export type SidebarGroupItem = {
  title: string;
  href: string;
};
interface SidebarGroupProps {
  title: string;
  groupItems: SidebarGroupItem[];
  isCloseDefault: boolean;
  onItemClick?: () => void;
}

const SidebarGroup = ({
  title,
  groupItems,
  isCloseDefault,
  onItemClick,
}: SidebarGroupProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isFold, setIsFold] = useState<boolean>(isCloseDefault);

  return (
    <div className={"flex flex-col gap-4"}>
      <div
        className={
          "flex items-center justify-between cursor-pointer gap-4 group"
        }
        onClick={() => setIsFold(!isFold)}>
        <div className={"flex items-center gap-1 no-select"}>
          <h3
            className={
              "text-2xl font-bold transition-all duration-300 lg:hidden xl:visible"
            }>
            📁
          </h3>
          <h3
            className={
              "text-2xl font-bold transition-all duration-300 group-hover:text-default-500"
            }>
            {title}
          </h3>
        </div>
        <FaChevronUp
          className={clsx(
            "text-lg transition-all duration-300 group-hover:text-default-500",
            {
              "rotate-180": !isFold,
            }
          )}
        />
      </div>
      <div
        className={clsx(
          "flex flex-col w-full gap-4 pl-6 transition-all duration-500 overflow-hidden ease-in-out",
          {
            "opacity-0 max-h-0": isFold,
            "opacity-100 max-h-64": !isFold,
          }
        )}
        onClick={onItemClick}>
        {groupItems.map((item) => (
          <div
            className={
              clsx("relative w-full cursor-pointer group hover:pl-2 transition-all duration-300 group", {
                "pl-2": pathname.includes(item.href),
              })
            }
            onClick={() => router.push(item.href)}
            key={item.href}>
            <div
              className={clsx(
                "absolute left-0 bg-default-500/20 h-full w-0 group-hover:w-full transition-all duration-300",
                {
                  "!bg-black w-full": pathname.includes(item.href),
                }
              )}></div>
            <p
              className={
                clsx("relative w-full transition-all duration-300 text-lg p-1", {
                  "text-white": pathname.includes(item.href),
                })
              }>
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarGroup;
