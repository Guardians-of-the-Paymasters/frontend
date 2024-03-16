import SectionAccordion from "./common/SectionAccordion";
import Button from "./common/Button";
import Form from "./common/Form";
import Text from "./common/Text";

interface AbiItem {
    type: string;
    name: string;
    inputs: Array<{ internalType: string; name: string; type: string }>;
}

const SmartContractRules = () => {
    function getFunctionNamesWithInputsFromABIString(abiString: string): string[] {
        try {
            // Parse the ABI string into a JavaScript object
            const abi: AbiItem[] = JSON.parse(abiString);

            // Filter for function types with non-empty inputs
            const functionsWithInputs = abi.filter((item: AbiItem) => item.type === "function" && item.inputs.length > 0);

            // Extract the names of these functions
            const functionNames = functionsWithInputs.map((func: AbiItem) => func.name);

            return functionNames;
        } catch (error) {
            console.error("Error parsing ABI:", error);
            return []; // Return an empty array in case of error
        }
    }
    return (
        <SectionAccordion title="Smart Contract Rules">
            <div className="flex flex-col gap-10">
                <Form title="Smart Contract Allowed to Spend Gas" placeholder="0xabc...efg" />
                <Form title="NFT #ID to own to spend gas" placeholder="0" type="number" />
                <div className="flex flex-col gap-4">
                    <Text size="subtitle2" className="uppercase text-white">
                        Add ABI and select allowed contract methods
                    </Text>
                    <Form
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
                <Button text="Next" />
            </div>
        </SectionAccordion>
    );
};

export default SmartContractRules;
