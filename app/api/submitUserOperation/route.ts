import { db } from "@/firebaseConfig";
import { addDoc, collection } from "@firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import "dotenv/config";
import {
    ENTRYPOINT_ADDRESS_V07,
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
} from "viem";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { baseSepolia } from "viem/chains";



export async function POST(req: NextRequest) {
    console.log("IN FUNC")
    if (req.method !== 'POST') {
        return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
    }

    const body = await req.json()
    console.log("THE BODY ", body)

    const userOperation = {
        sender: body.sender as `0x${string}`,
        nonce: BigInt(body.nonce),
        factory: body.factory as `0x${string}`,
        factoryData: body.factoryData as `0x${string}`,
        callData: body.callData as `0x${string}`,
        maxFeePerGas: BigInt(body.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(body.maxPriorityFeePerGas),
        signature: body.signature as `0x${string}`,
        callGasLimit: BigInt(body.callGasLimit),
        verificationGasLimit: BigInt(body.verificationGasLimit),
        preVerificationGas: BigInt(body.preVerificationGas),
        paymaster: body.paymaster as `0x${string}`,
        paymasterVerificationGasLimit: BigInt(body.paymasterVerificationGasLimit),
        paymasterPostOpGasLimit: BigInt(body.paymasterPostOpGasLimit),
        paymasterData: body.paymasterData as `0x${string}`

    }

    const publicClient = createPublicClient({
        transport: http("https://rpc.ankr.com/eth_baseSepolia"),
        chain: baseSepolia,
    });

    const apiKey = process.env.PIMLICO_API_KEY; // REPLACE THIS
    const endpointUrl = `https://api.pimlico.io/v2/baseSepolia/rpc?apikey=${apiKey}`;

    const bundlerClient = createClient({
        transport: http(endpointUrl),
        chain: baseSepolia,
    })
        .extend(bundlerActions(ENTRYPOINT_ADDRESS_V07))
        .extend(pimlicoBundlerActions(ENTRYPOINT_ADDRESS_V07));

    console.log("~~~~~~~~~~~~~USER OPERATION~~~~~~~~~~~~~~~")
    console.log(userOperation)
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    const userOperationHash = await bundlerClient.sendUserOperation({
        userOperation: userOperation,
    });

    console.log("Received User Operation hash:", userOperationHash);

    // let's also wait for the userOperation to be included, by continually querying for the receipts
    console.log("Querying for receipts...");
    const receipt = await bundlerClient.waitForUserOperationReceipt({
        hash: userOperationHash,
    });
    const txHash = receipt.receipt.transactionHash;

    console.log(
        `userOperation included: https://baseSepolia.etherscan.io/tx/${txHash}`
    );

    return NextResponse.json({ message: "DONE ", }, { status: 200 });

}