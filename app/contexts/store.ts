export interface State {
    policyName: string;
    smartContractAddress: string;
    abi: string;
    functionsSelected: string[];
    nftIds: string[];
    addresses: string[];
    maxTransactionsPerUser: number;
    maxTransactionsPerPolicy: number;
    maxGasPerUser: number;
    maxGasPerPolicy: number;
    policyStartTimestamp: string;
    policyEndTimestamp: string;
}

export const initialState: State = {
    policyName: "",
    smartContractAddress: "",
    abi: "",
    functionsSelected: [],
    nftIds: [""],
    addresses: [""],
    maxTransactionsPerUser: 0,
    maxTransactionsPerPolicy: 0,
    maxGasPerUser: 0,
    maxGasPerPolicy: 0,
    policyStartTimestamp: "",
    policyEndTimestamp: "",
};
