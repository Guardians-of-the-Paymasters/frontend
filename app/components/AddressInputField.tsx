"use client";

import { useEffect, useRef } from "react";
import Text from "./common/Text";
import { ethers } from "ethers";
import { useActivity } from "../contexts";

interface AddressInputFieldsProps {
    addresses: string[];
}

const AddressInputFields = ({ addresses }: AddressInputFieldsProps) => {
    const [_, dispatch] = useActivity();

    const inputRefs = useRef<HTMLInputElement[]>([]);

    const handleKeyPress = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();

            const currentAddress = addresses[index];

            // Check if the current address is a valid Ethereum address
            if (ethers.isAddress(currentAddress)) {
                const newAddresses = [...addresses, ""];
                dispatch({ type: "updateAddresses", addresses: newAddresses });

                // Focus the next input after the state update
                setTimeout(() => {
                    if (inputRefs.current[index + 1]) {
                        inputRefs.current[index + 1].focus();
                    }
                }, 0);
            } else {
                // Handle invalid address input (e.g., show an error message)
                alert("Please enter a valid Ethereum address.");
            }
        }
    };

    const handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const newAddresses = [...addresses];
        newAddresses[index] = event.target.value;
        dispatch({ type: "updateAddresses", addresses: newAddresses });
    };

    useEffect(() => {
        // Automatically focus the first input on initial render
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    console.log("addresses", addresses);

    return (
        <div className="w-3/5 cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 px-6 py-2 text-white">
            {addresses.map((address, index) => (
                <div key={index} className="flex items-center">
                    <Text size="caption1" className="uppercase text-zinc-400">
                        {index + 1}
                    </Text>
                    <input
                        type="text"
                        value={address}
                        onChange={(event) => handleChange(index, event)}
                        onKeyDown={(event) => handleKeyPress(index, event)}
                        ref={(el) => {
                            if (el) {
                                inputRefs.current[index] = el;
                            }
                        }} // Assign the input element to the refs array
                        placeholder="Enter address and press Enter"
                        className="w-11/12 bg-transparent px-6 py-2 outline-none placeholder:text-zinc-600 active:border-zinc-500"
                    />
                </div>
            ))}
        </div>
    );
};

export default AddressInputFields;
