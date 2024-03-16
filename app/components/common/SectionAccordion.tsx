"use client";

import { useState } from "react";
import { ArrowDownSvg } from "./svgs";
import Text from "./Text";

interface SectionAccordionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const SectionAccordion = ({ title, children, defaultOpen = false }: SectionAccordionProps) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
        <div className="my-4 flex flex-col">
            <div
                onClick={() => {
                    setOpen(!open);
                }}
                className="flex w-full cursor-pointer flex-row justify-between rounded-lg border-b-2 border-zinc-800 bg-zinc-900 px-4 pb-2 pt-4"
            >
                <Text size="h4">{title}</Text>
                <ArrowDownSvg className={`m-2 mt-3 w-5 ${open && "rotate-180"}`} />
            </div>
            <div
                className={`w-full overflow-x-hidden p-4 px-2 transition-all duration-500 ease-in-out ${open ? "max-h-[2000px] px-0 opacity-100" : "max-h-0 scale-y-0 opacity-0"} origin-top`}
            >
                {children}
            </div>
        </div>
    );
};

export default SectionAccordion;
