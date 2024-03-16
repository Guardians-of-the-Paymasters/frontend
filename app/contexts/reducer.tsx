import { State } from "./store";

export type Action =
    | { type: "updatePolicyName"; policyName: State["policyName"] }
    | { type: "updateSmartContractAddress"; smartContractAddress: State["smartContractAddress"] }
    | { type: "updateAbi"; abi: State["abi"] }
    | { type: "updateFunctionsSelected"; functionsSelected: State["functionsSelected"] }
    | { type: "updateNftIds"; nftIds: State["nftIds"] }
    | { type: "updateMaxTransactionsPerUser"; maxTransactionsPerUser: State["maxTransactionsPerUser"] }
    | { type: "updateMaxTransactionsPerPolicy"; maxTransactionsPerPolicy: State["maxTransactionsPerPolicy"] }
    | { type: "updateMaxGasPerUser"; maxGasPerUser: State["maxGasPerUser"] }
    | { type: "updateMaxGasPerPolicy"; maxGasPerPolicy: State["maxGasPerPolicy"] }
    | { type: "updatePolicyStart"; policyStart: State["policyStart"] }
    | { type: "updatePolicyEnd"; policyEnd: State["policyEnd"] }
    | { type: "updateAddresses"; addresses: State["addresses"] };

export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "updatePolicyName":
            return {
                ...state,
                policyName: action.policyName,
            };
        case "updateSmartContractAddress":
            return {
                ...state,
                smartContractAddress: action.smartContractAddress,
            };
        case "updateAbi":
            return {
                ...state,
                abi: action.abi,
            };
        case "updateFunctionsSelected":
            return {
                ...state,
                functionsSelected: action.functionsSelected,
            };
        case "updateNftIds":
            return {
                ...state,
                nftIds: action.nftIds,
            };
        case "updateMaxTransactionsPerUser":
            return {
                ...state,
                maxTransactionsPerUser: action.maxTransactionsPerUser,
            };
        case "updateMaxTransactionsPerPolicy":
            return {
                ...state,
                maxTransactionsPerPolicy: action.maxTransactionsPerPolicy,
            };
        case "updateMaxGasPerUser":
            return {
                ...state,
                maxGasPerUser: action.maxGasPerUser,
            };
        case "updateMaxGasPerPolicy":
            return {
                ...state,
                maxGasPerPolicy: action.maxGasPerPolicy,
            };
        case "updatePolicyStart":
            return {
                ...state,
                policyStart: action.policyStart,
            };
        case "updatePolicyEnd":
            return {
                ...state,
                policyEnd: action.policyEnd,
            };
        case "updateAddresses":
            return {
                ...state,
                addresses: action.addresses,
            };

        default:
            throw "Bad action type";
    }
};
