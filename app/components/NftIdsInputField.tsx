"use client";

import { useEffect, useRef } from "react";
import Text from "./common/Text";

interface IdsInputFieldsProps {
    idsState: {
        ids: string[];
        setIds: React.Dispatch<React.SetStateAction<string[]>>;
    };
}

const IdsInputFields = ({ idsState }: IdsInputFieldsProps) => {
    const { ids, setIds } = idsState;

    const inputRefs = useRef<HTMLInputElement[]>([]);

    const handleKeyPress = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();

            const newIds = [...ids, ""];
            setIds(newIds);

            // Focus the next input after the state update
            setTimeout(() => {
                if (inputRefs.current[index + 1]) {
                    inputRefs.current[index + 1].focus();
                }
            }, 0);
        }
    };

    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newIds = [...ids];
        newIds[index] = event.target.value;
        setIds(newIds);
    };

    useEffect(() => {
        // Automatically focus the first input on initial render
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    return (
        <div className="w-3/5 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-2 text-white">
            {ids.map((id, index) => (
                <div key={index} className="flex items-center">
                    <Text size="caption1" className="uppercase text-zinc-400">
                        {index + 1}
                    </Text>
                    <input
                        type="text"
                        value={id}
                        onChange={(event) => handleChange(index, event)}
                        onKeyDown={(event) => handleKeyPress(index, event)}
                        ref={(el) => {
                            if (el) {
                                inputRefs.current[index] = el;
                            }
                        }} // Assign the input element to the refs array
                        placeholder="NFT #ID to own to spend gas"
                        className="w-11/12 bg-transparent px-6 py-2 outline-none placeholder:text-zinc-600 active:border-zinc-500"
                    />
                </div>
            ))}
        </div>
    );
};

export default IdsInputFields;
