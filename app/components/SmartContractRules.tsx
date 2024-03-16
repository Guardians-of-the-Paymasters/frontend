"use client";

import SectionAccordion from "./common/SectionAccordion";
import Button from "./common/Button";
import Form from "./common/Form";
import Text from "./common/Text";
import { useEffect, useState } from "react";

interface AbiItem {
    type: string;
    name: string;
    inputs: Array<{ internalType: string; name: string; type: string }>;
}

interface SmartContractRulesProps {
    canBeOpened: boolean;
    onCompleted: () => void;
}

const SmartContractRules = ({ canBeOpened, onCompleted }: SmartContractRulesProps) => {
    const [functionNames, setFunctionNames] = useState<string[]>([]);
    const [selectedFunctionNames, setSelectedFunctionNames] = useState<string[]>([]);
    const [abiString, setAbiString] = useState<string>("");

    function getFunctionNamesWithInputsFromABIString(abiString: string): string[] {
        try {
            const abi: AbiItem[] = JSON.parse(abiString);

            // Filter for function types with non-empty inputs
            const functionsWithInputs = abi.filter((item: AbiItem) => item.type === "function" && item.inputs.length > 0);

            // Extract the names of these functions
            const functionNames = functionsWithInputs.map((func: AbiItem) => func.name);
            return functionNames;
        } catch (error) {
            console.error("Error parsing ABI:", error);
            return [];
        }
    }

    useEffect(() => {
        if (abiString.length > 0) setFunctionNames(getFunctionNamesWithInputsFromABIString(abiString));
    }, [abiString]);

    const handleFunctionSelectionChange = (functionName: string) => {
        setSelectedFunctionNames((prevSelected) => {
            if (prevSelected.includes(functionName)) {
                // If already selected, remove it from the selection
                return prevSelected.filter((name) => name !== functionName);
            } else {
                // Otherwise, add it to the selection
                return [...prevSelected, functionName];
            }
        });
    };

    return (
        <SectionAccordion disabled={!canBeOpened} title="Smart Contract Rules">
            <div className="flex flex-col gap-10">
                <Form title="Smart Contract Allowed to Spend Gas" placeholder="0xabc...efg" />
                <Form title="NFT #ID to own to spend gas" placeholder="0" type="number" />
                <div className="flex items-center justify-between gap-8">
                    <div className="flex flex-col gap-4">
                        <Text size="subtitle2" className="uppercase text-white">
                            Add ABI and select allowed contract methods
                        </Text>
                        <Form
                            className="!w-full"
                            onChange={setAbiString}
                            title="Smart contract abi"
                            placeholder={`[{
                            inputs: [
                                { internalType: "uint256", name: "_tokenId", type: "uint256" },
                                { internalType: "uint256", name: "_option", type: "uint256" },
                                { internalType: "uint256", name: "_stakeAmount", type: "uint256" },
                            ],
                            name: "claimAavegotchi",
                            outputs: [],
                            stateMutability: "nonpayable",
                            type: "function",
                            }]`}
                            type="textarea"
                        />
                    </div>
                    {functionNames.length > 0 && (
                        <div className="flex flex-col gap-4">
                            <Text size="subtitle2" className="uppercase text-white">
                                Select allowed contract methods
                            </Text>
                            <div className="max-h-[200px] overflow-y-auto">
                                {functionNames.map((funcName) => (
                                    <div key={funcName} className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedFunctionNames.includes(funcName)}
                                            onChange={() => handleFunctionSelectionChange(funcName)}
                                        />
                                        <Text size="subtitle2" className="text-white">
                                            {funcName}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Button text="Next" onClick={onCompleted} />
            </div>
        </SectionAccordion>
    );
};

export default SmartContractRules;
