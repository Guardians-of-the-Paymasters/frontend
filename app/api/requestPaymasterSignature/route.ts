import { db } from "@/firebaseConfig";
import { addDoc, collection } from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import {
    ENTRYPOINT_ADDRESS_V07,
    ENTRYPOINT_ADDRESS_V06,
    UserOperation,
    bundlerActions,
    getSenderAddress,
    signUserOperationHashWithECDSA,
    createSmartAccountClient,
} from "permissionless";
import {
    pimlicoBundlerActions,
    pimlicoPaymasterActions,
} from "permissionless/actions/pimlico";
import {
    Address,
    Hex,
    createClient,
    createPublicClient,
    encodeFunctionData,
    http,
    getContract,
    parseEther
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { signerToSafeSmartAccount } from "permissionless/accounts"
import {
    createPimlicoBundlerClient,
    createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico"
import { ethers } from "ethers";



export const replacer: (key: string, value: any) => any = (key, value) => {
    return typeof value === 'bigint' ? value.toString() : value;
};

export async function POST(req: NextRequest) {
    console.log("IN FUNC")

    const apiKey = process.env.PIMLICO_API_KEY;
    const endpointUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`;

    const bundlerClient = createClient({
        transport: http(endpointUrl),
        chain: sepolia,
    })
        .extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
        .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07));

    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }


    console.log("IN FUNC")
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    const body = await req.json()
    console.log("THE BODY ", body)

    if (body.deploySafe) {

        const safePublicClient = createPublicClient({
            transport: http("https://rpc.ankr.com/eth_sepolia"),
        })

        const safePaymasterClient = createPimlicoPaymasterClient({
            transport: http(`https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`),
            entryPoint: ENTRYPOINT_ADDRESS_V06,
        })

        const bundlerClient = createPimlicoBundlerClient({
            transport: http(`https://api.pimlico.io/v1/sepolia/rpc?apikey=${apiKey}`),
            entryPoint: ENTRYPOINT_ADDRESS_V06,
        })

        const privKey = generatePrivateKey()
        const signer = privateKeyToAccount(privKey)
        const gasPrices = await bundlerClient.getUserOperationGasPrice()

        const safeAccount = await signerToSafeSmartAccount(safePublicClient, {
            entryPoint: ENTRYPOINT_ADDRESS_V06,
            signer: signer,
            saltNonce: BigInt("0"), // optional
            safeVersion: "1.4.1",
        })

        const smartAccountClient = createSmartAccountClient({
            account: safeAccount,
            entryPoint: ENTRYPOINT_ADDRESS_V06,
            chain: sepolia,
            bundlerTransport: http("https://api.pimlico.io/v1/sepolia/rpc?apikey=API_KEY"),
            middleware: {
                gasPrice: async () => (await bundlerClient.getUserOperationGasPrice()).fast, // use pimlico bundler to get gas prices
                sponsorUserOperation: safePaymasterClient.sponsorUserOperation, // optional
            },
        })

        const safeTxHash = await smartAccountClient.sendTransaction({
            to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
            value: parseEther("0.1"),
            maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
            maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
        })

        const nftContract = getContract({
            address: "0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2",
            abi: [
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "approve",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "stateMutability": "nonpayable",
                    "type": "constructor"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "ERC721IncorrectOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "ERC721InsufficientApproval",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "approver",
                            "type": "address"
                        }
                    ],
                    "name": "ERC721InvalidApprover",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        }
                    ],
                    "name": "ERC721InvalidOperator",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "ERC721InvalidOwner",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "receiver",
                            "type": "address"
                        }
                    ],
                    "name": "ERC721InvalidReceiver",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "sender",
                            "type": "address"
                        }
                    ],
                    "name": "ERC721InvalidSender",
                    "type": "error"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "ERC721NonexistentToken",
                    "type": "error"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "approved",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "Approval",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "bool",
                            "name": "approved",
                            "type": "bool"
                        }
                    ],
                    "name": "ApprovalForAll",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "safeTransferFrom",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        },
                        {
                            "internalType": "bytes",
                            "name": "data",
                            "type": "bytes"
                        }
                    ],
                    "name": "safeTransferFrom",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        },
                        {
                            "internalType": "bool",
                            "name": "approved",
                            "type": "bool"
                        }
                    ],
                    "name": "setApprovalForAll",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "Transfer",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "from",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "to",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "transferFrom",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        }
                    ],
                    "name": "balanceOf",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "getApproved",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "address",
                            "name": "owner",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "operator",
                            "type": "address"
                        }
                    ],
                    "name": "isApprovedForAll",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "name",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "ownerOf",
                    "outputs": [
                        {
                            "internalType": "address",
                            "name": "",
                            "type": "address"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "bytes4",
                            "name": "interfaceId",
                            "type": "bytes4"
                        }
                    ],
                    "name": "supportsInterface",
                    "outputs": [
                        {
                            "internalType": "bool",
                            "name": "",
                            "type": "bool"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "symbol",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "tokenId",
                            "type": "uint256"
                        }
                    ],
                    "name": "tokenURI",
                    "outputs": [
                        {
                            "internalType": "string",
                            "name": "",
                            "type": "string"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ],
            client: {
                public: safePaymasterClient,
                wallet: smartAccountClient,
            },
        })

        const txHash = await smartAccountClient.sendTransactions({
            transactions: [
                {
                    to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
                    value: parseEther("0.1"),
                    data: "0x",
                },
                {
                    to: "0x1440ec793aE50fA046B95bFeCa5aF475b6003f9e",
                    value: parseEther("0.1"),
                    data: "0x1234",
                },
            ],
            maxFeePerGas: gasPrices.fast.maxFeePerGas, // if using Pimlico
            maxPriorityFeePerGas: gasPrices.fast.maxPriorityFeePerGas, // if using Pimlico
        })
        console.log(txHash)
    }

    const publicClient = createPublicClient({
        transport: http("https://rpc.ankr.com/eth_sepolia"),
        chain: sepolia,
    });



    const paymasterClient = createClient({
        transport: http(endpointUrl),
        chain: sepolia,
    }).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V07));





    const SIMPLE_ACCOUNT_FACTORY_ADDRESS =
        "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985";



    const factory = SIMPLE_ACCOUNT_FACTORY_ADDRESS;
    const factoryData = encodeFunctionData({
        abi: [
            {
                inputs: [
                    { name: "owner", type: "address" },
                    { name: "salt", type: "uint256" },
                ],
                name: "createAccount",
                outputs: [{ name: "ret", type: "address" }],
                stateMutability: "nonpayable",
                type: "function",
            },
        ],
        args: [body.ownerAddress, BigInt(0)],
    });

    console.log("Generated factoryData:", factoryData);

    const senderAddress = await getSenderAddress(publicClient, {
        factory,
        factoryData,
        entryPoint: ENTRYPOINT_ADDRESS_V07,
    });

    console.log("Calculated sender address:", senderAddress);

    const to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"; // vitalik
    const value = BigInt(0);
    const data = "0x68656c6c6f"; // "hello" encoded to utf-8 bytes

    const callData = encodeFunctionData({
        abi: [
            {
                inputs: [
                    { name: "dest", type: "address" },
                    { name: "value", type: "uint256" },
                    { name: "func", type: "bytes" },
                ],
                name: "execute",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function",
            },
        ],
        args: [to, value, data],
    });

    console.log("Generated callData:", callData);

    const gasPrice = await bundlerClient.getUserOperationGasPrice();

    //@TODO we send THIS to the backend.

    const userOperation = {
        sender: senderAddress,
        nonce: BigInt(0),
        factory: factory as Address,
        factoryData,
        callData,
        maxFeePerGas: gasPrice.fast.maxFeePerGas,
        maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
        // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
        signature:
            "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex,
    };

    console.log(userOperation);

    // const userOperation = {
    //     sender: body.sender as `0x${string}`,
    //     nonce: BigInt(body.nonce),
    //     factory: body.factory as `0x${string}`,
    //     factoryData: body.factoryData as `0x${string}`,
    //     callData: body.callData as `0x${string}`,
    //     maxFeePerGas: BigInt(body.maxFeePerGas),
    //     maxPriorityFeePerGas: BigInt(body.maxPriorityFeePerGas),
    //     signature: body.signature as `0x${string}`

    // }

    const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation({
        userOperation,
    });

    const sponsoredUserOperation: UserOperation<"v0.7"> = {
        ...userOperation,
        ...sponsorUserOperationResult,
    };

    console.log("the userOperation thats sponsored:", userOperation);

    console.log("Received paymaster sponsor result:", sponsorUserOperationResult);

    sponsorUserOperationResult

    return NextResponse.json({ message: JSON.parse(JSON.stringify(sponsoredUserOperation, replacer)), }, { status: 200 });

}