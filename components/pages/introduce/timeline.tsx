
interface TimelineProps {
    items: {
        date: string;
        title: string;
        description: string;
    }[]
}

export default function Timeline({ items }: TimelineProps) {
    return (
        <ol
            className="relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200"
        >
            {
                items.length > 0 ? (
                    items.map((item, index) => (
                        <li key={index} className="relative -ms-1.5 flex items-start gap-4">
                            <span className="size-3 shrink-0 rounded-full bg-primary" />

                            <div className="flex flex-col gap-2 -mt-1">
                                <time className="tracking-widest text-sm font-bold text-gray-500">{item.date}</time>

                                <h3 className="tracking-wide text-xl font-bold text-gray-900">{item.title}</h3>

                                <p className="mt-0.5 text-sm font-normal tracking-wide text-gray-700">
                                    {item.description}
                                </p>
                            </div>
                        </li>
                    ))
                ) : (
                    <p className={"ml-12 italic"}>No timeline items.</p>
                )
            }
        </ol>
    )
}