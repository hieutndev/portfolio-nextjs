import { Button, Chip, Image } from "@heroui/react";
import clsx from "clsx";

import ICON_CONFIG from "@/configs/icons";

interface ProjectImageComponentProps {
    imageName: string;
    imagePath: string;
    isThumbnail: boolean;
    onOpen?: () => void,
    onRemove?: () => void,
    highlightColor: "success" | "danger",
    isHighlighted: boolean;
    className?: string;

}
export default function ProjectImageComponent({ imageName, imagePath, isThumbnail, onOpen, onRemove, highlightColor, isHighlighted, className }: ProjectImageComponentProps) {
    return (
        <div className={clsx("relative w-full col-span-1 cursor-pointer", className)}>
            <button
                className={clsx(
                    "relative border-l-5 rounded-2xl transition-colors",
                    {
                        "bg-transparent border-success-300 hover:border-success-500": isThumbnail,
                        "border-danger-300 hover:border-danger-500": isHighlighted && !isThumbnail,
                        "border-danger-500": isHighlighted && highlightColor === "danger" && !isThumbnail,
                        "border-secondary-300 hover:border-secondary-500": !isHighlighted && !isThumbnail
                    }
                )}
                onClick={onOpen}
            >
                {isThumbnail && (
                    <div className={"absolute top-1 right-1 z-[20]"}>
                        <Chip
                            color={"success"}
                            size="sm"
                            variant="solid"
                        >
                            Thumbnail
                        </Chip>
                    </div>
                )}
                <Image
                    isBlurred
                    alt={isThumbnail ? "Project Thumbnail" : imageName}
                    className={"object-cover w-max transition-transform border-1"}

                    radius={"sm"}
                    // shadow={"sm"}
                    src={imagePath}
                />
                {!isThumbnail && (
                    <Button
                        isIconOnly
                        className={"absolute top-1 right-1 z-20 opacity-80 hover:opacity-100"}
                        color={"danger"}
                        size={"sm"}
                        variant="solid"
                        onPress={onRemove}
                    >
                        {ICON_CONFIG.SOFT_DELETE}
                    </Button>
                )}
                {isHighlighted && highlightColor === "danger" && !isThumbnail && (
                    <div
                        className={"absolute rounded-xl z-10 inset-0 bg-danger-200/50 flex items-center justify-center"}
                     />
                )}
            </button>
            <p className={"text-xs text-center mt-1 text-foreground-600 truncate"}>
                {isThumbnail ? "Current Thumbnail" : imageName}
            </p>
        </div>
    );
}