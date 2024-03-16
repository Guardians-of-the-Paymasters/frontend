import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { collection, query, where, addDoc, getDocs, doc, getDoc, setDoc, orderBy, limit } from 'firebase/firestore';

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



export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  const body = await req.json();
  console.log(body)

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
    return NextResponse.json({ message: "Transaction sponsored" }, { status: 201 });
  } catch (error) {
    console.error('Error processing request: ', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

