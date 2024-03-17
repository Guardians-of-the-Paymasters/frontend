"use client";

import SectionAccordion from "./common/SectionAccordion";
import Button from "./common/Button";
import Form from "./common/Form";
import Text from "./common/Text";
import { useEffect, useState } from "react";
import IdsInputFields from "./NftIdsInputField";
import { useActivity } from "../contexts";

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
    const [{ smartContractAddress, functionsSelected, abi, nftIds }, dispatch] = useActivity();

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
        if (abi.length > 0) setFunctionNames(getFunctionNamesWithInputsFromABIString(abi));
    }, [abi]);

    const handleFunctionSelectionChange = (functionName: string) => {
        dispatch({
            type: "updateFunctionsSelected",
            functionsSelected: functionsSelected.includes(functionName)
                ? functionsSelected.filter((name) => name !== functionName)
                : [...functionsSelected, functionName],
        });
    };

    const handleSmartContractAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "updateSmartContractAddress", smartContractAddress: e.target.value });
    };

    const handleAbiChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch({ type: "updateAbi", abi: e.target.value });
    };

    return (
        <SectionAccordion disabled={!canBeOpened} title="Smart Contract Rules">
            <div className="flex flex-col gap-10">
                <Form onChange={handleSmartContractAddressChange} title="Smart Contract Allowed to Spend Gas" placeholder="0xabc...efg" />
                <div className="flex flex-col gap-2.5">
                    <Text size="caption1" className="uppercase text-white">
                        NFT Ids
                    </Text>
                    <IdsInputFields ids={nftIds} />
                </div>
                <div className="flex items-center justify-between gap-8">
                    <div className="flex flex-col gap-4">
                        <Text size="subtitle2" className="uppercase text-white">
                            Add ABI and select allowed contract methods
                        </Text>
                        <Form
                            className="!w-full"
                            textAreaOnChange={handleAbiChange}
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
                                            checked={functionsSelected.includes(funcName)}
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

                <Button text="Next" disabled={smartContractAddress.length == 0} onClick={onCompleted} />
            </div>
        </SectionAccordion>
    );
};

export default SmartContractRules;
