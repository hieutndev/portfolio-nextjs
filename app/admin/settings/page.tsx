"use client"

import { useEffect, useState } from "react";

import ContentComponent from "./_menu/introduce";

import { settingMenuItems } from "@/components/pages/settings/setting-menu";

export default function SettingsPage() {

  const [currentSelectedMenu, setCurrentSelectedMenu] = useState<typeof settingMenuItems[number]["key"]>("");

  useEffect(() => {
  }, [currentSelectedMenu]);

  return (
    <div className={"grid grid-cols-12"}>
      {/* <div className="col-span-2 pt-4 pr-4 border-r border-gray-200">
        <SettingMenu onSelect={(key) => setCurrentSelectedMenu(key)} />
      </div> */}
      <div className={"col-span-12"}>
        <ContentComponent />
        {/* {currentSelectedMenu === "homepage"
          : currentSelectedMenu === "my-skills"
            ? <MySkillsComponent />
            : null
        } */}
      </div>
    </div>
  );
}
