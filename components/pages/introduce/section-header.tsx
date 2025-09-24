import Image from "next/image";

export default function SectionHeader({ title, iconSrc, iconAlt }: { title: string; iconSrc: string; iconAlt: string }) {
    return (
        <div className={"flex flex-row items-center gap-4"}>
            <Image alt={iconAlt} className={"rounded-full"} height={52} src={iconSrc} width={52} />
            <h2 className={"text-3xl font-bold"}>{title}</h2>
        </div>
    );
}

