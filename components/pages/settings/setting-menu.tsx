"use client"

import { Button } from "@heroui/react"
import { useEffect, useState } from "react";

import { TMenu } from "@/types/global"

interface SettingMenuProps {
    onSelect: (value: string) => void;
}

export const settingMenuItems: TMenu[] = [
    {
        label: ["Introduce Section"],
        key: "introduce",
    },
    {
        label: ["Skills Section"],
        key: "my-skills",
    }
]

export default function SettingMenu({ onSelect }: SettingMenuProps) {

    const [currentSelected, setCurrentSelected] = useState(settingMenuItems[0].key);

    useEffect(() => {
        onSelect(currentSelected);
    }, [currentSelected]);


    return (
        <div className={"w-full flex flex-col gap-4"}>
            {settingMenuItems.map(item => (
                <Button
                    key={item.key}
                    color={currentSelected === item.key ? "primary" : "default"}
                    variant={currentSelected === item.key ? "flat" : "light"}
                    // variant={"flat"}
                    onPress={() => setCurrentSelected(item.key)}
                >
                    {item.label.join(" ")}
                </Button>
            ))}
        </div>
    )
}