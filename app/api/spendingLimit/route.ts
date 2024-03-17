import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { collection, query, where, addDoc, getDocs, doc, getDoc, setDoc, orderBy, limit } from 'firebase/firestore';
import { Contract, ethers } from 'ethers-legacy';

import { guessAbiEncodedData } from "@openchainxyz/abi-guesser";
import pkg from "ethers-legacy";


// const spendingCap = BigInt("1000000000000000000"); // 1 ETH in wei as BigInt of gas
interface SmartContractPolicy {
  id: string; // Document ID
  maxGasPerPolicy: string;
  contractAddress: string;
  sponsoredMethods: string[];
  abi: string;
  maxGasPerUser: string;
  allowlist: string[];
}


async function callPaymaster(){
  console.log("HERE will be THE LOGIC TO get TX paid by paymaster")
}

const decodeCallData = async (calldata: any) => {
  if (!calldata) {
    console.log("No calldata provided");
    return;
  }

  try {
    // Guess ABI encoded data structure

    //const paramTypes = guessAbiEncodedData(calldata);
    //if (!paramTypes) throw new Error("Failed to guess ABI encoded data");

    const encodedParams = calldata;

    try {
      const paramTypes = guessAbiEncodedData(calldata) || [];

      if (paramTypes.length === 0) {
        console.error("Could not guess ABI types.");
        return;
      }

      const abiCoder = ethers.utils.defaultAbiCoder;
      const decoded = abiCoder.decode(paramTypes as any, calldata);
      console.log("Decoded with guessed ABI:", decoded);
    } catch {
      const encodedParams = "0x" + calldata.slice(10);
      const paramTypes = guessAbiEncodedData(encodedParams);

      const abiCoder = ethers.utils.defaultAbiCoder;
      const decoded = abiCoder.decode(paramTypes as any , encodedParams);
      //console.log("Decoded with guessed ABI:", decoded);
      //console.log(JSON.stringify(decoded));
      //@notice
      // first array element is the target address
      // second element is the args
      // third element is the functionTopic called.

      // Create an object with the decoded data, assuming the structure you've mentioned
      const decodedObject = {
        targetAddress: decoded[0]?.toString(),
        args: decoded[1], // Assuming args is directly usable or you might want to stringify if complex
        functionTopic: decoded[2]?.toString(),
      };

      // Log the structured object prettily
      console.log(
        "Decoded ABI Data:",
        JSON.stringify(decodedObject, null, 2)
      );

      return decodedObject
    }
  } catch (guessError) {
    console.error("Error decoding with guessed ABI:", guessError);
  }
};



export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  const body = await req.json();

  if (!body.userAddress || !body.gasPrice || !body.gasLimit) {
    return NextResponse.json({ error: 'missing field' }, { status: 400 });
  }

  const gasPriceBigInt = BigInt(body.gasPrice);
  const gasLimitBigInt = BigInt(body.gasLimit);
  const totalGasCost = gasPriceBigInt * gasLimitBigInt;


  try {
    // Check if the user exists
    const userRef = doc(db, 'Users', body.userAddress);
    const userSnap = await getDoc(userRef);

    // Optionally add a new user
    if (!userSnap.exists()) {
      await setDoc(userRef, { userAddress: body.userAddress, createdAt: new Date() });
    }

    // Retrieve policy details
    const policyCollectionRef = collection(db, "SmartContractPolicy");
    const snapshot = await getDocs(policyCollectionRef);
    if (snapshot.empty) {
      return NextResponse.json({ error: "No policies found" }, { status: 404 });
    }

    // Map through documents to get data
    const policies: SmartContractPolicy[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as Omit<SmartContractPolicy, 'id'>), // Cast doc.data() to the expected type, excluding 'id'
    }));

    console.log(policies)

    const latestPolicyData = policies[0];
    const maxGasPerUser = BigInt(latestPolicyData.maxGasPerUser);
    const maxGasPerPolicy = BigInt(latestPolicyData.maxGasPerPolicy);

    const sponsoredMethods = latestPolicyData.sponsoredMethods

    console.log("BEFORE DECODE")
    const data = await decodeCallData("0xb61d27f60000000000000000000000001f7f72d69c95b2b78663eb6d8fe3a20dd916c0e700000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000437a5405300000000000000000000000000000000000000000000000000000000")
    console.log("AFRTER DECODE")


    console.log(sponsoredMethods)
    // Calculate the Keccak-256 hash of the signature
    // Compute the Keccak-256 hash of the function signature
    const functionSignature = 'sayHelloDemo()'
    const hash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(functionSignature));
    console.log(hash)
    // The function selector is the first 4 bytes of this hash
    const functionSelector = hash.slice(0, 10);

    console.log("HASH IS ", functionSelector)

    console.log(data?.functionTopic)

    const contractAddr = latestPolicyData.contractAddress
    const contractAbi = latestPolicyData.abi

    //get decoded data of tx


    //check if in sponsoredMethods

    // Calculate the total spent gas by the user
    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("userAddress", "==", body.userAddress));
    const querySnapshot = await getDocs(q);

    let spentAmount = BigInt(0);
    querySnapshot.forEach((doc) => {
      const txn = doc.data();
      spentAmount += BigInt(txn.amount);
    });

    //Check against the user's and policy's gas limits
    if (totalGasCost > maxGasPerUser) {
      return NextResponse.json({ error: "Transaction exceeds user's gas limit" }, { status: 400 });
    }

    if (spentAmount + totalGasCost > maxGasPerPolicy) {
      return NextResponse.json({ error: "Transaction exceeds policy's gas limit" }, { status: 400 });
    }

    // If all checks pass, log the transaction
    await addDoc(transactionsRef, { userAddress: body.userAddress, amount: totalGasCost.toString(), timestamp: new Date() });
    
    await callPaymaster()

    return NextResponse.json({ message: "Transaction sponsored" }, { status: 201 });
  } catch (error) {
    console.error('Error processing request: ', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

