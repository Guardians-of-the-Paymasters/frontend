import Image from "next/image";
import SectionAccordion from "./components/SectionAccordion";
import Text from "./components/common/Text";

export default function Home() {
    return (
        <div className="bg-primary-black h-screen w-screen px-36 py-20">
            <SectionAccordion title="Policy Details">
                <div className="flex flex-col gap-2.5">
                    <Text size="caption1" className="uppercase text-white">
                        policy name:
                    </Text>
                    <input
                        type="text"
                        placeholder="Ex. Gas fee Sponsor"
                        className="w-1/3 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-2 text-white outline-none placeholder:text-zinc-600 active:border-zinc-500"
                    />
                </div>
                <button className="bg-blue-700">
                    <Text size="button3">next</Text>
                </button>
            </SectionAccordion>
        </div>
    );
}
