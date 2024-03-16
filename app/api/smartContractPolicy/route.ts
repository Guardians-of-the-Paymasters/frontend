

import { NextApiRequest } from 'next';
import { db } from '../../../firebaseConfig';
import { collection, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();


    // Check to make sure user exists
    console.log(body.userAddress)
    const userRef = doc(db, "Users", body.userAddress);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      // User does not exist, return an error
      return NextResponse.json({ error: "User does not exist" });
    }

    // Add an allowed method to the Firestore
    const docRef = await addDoc(collection(db, "SmartContractPolicy"), {
      contractAddress: body.contractAddress,
      sponsoredMethods: body.sponsoredMethods,
      abi: body.abi,
      policyName: body.policyName,
      maxGasPerUser: body.maxGasPerUser,
      maxGasPerPolicy: body.maxGasPerPolicy,
      allowlist: body.allowlist,
      nftIds: body.nftIds,
      policyStart: body.policyStart,
      policyEnd: body.policyEnd,
    });


    
    for (const addr of body.allowlist){
      const userRef = doc(db, 'Users', addr);
      const userSnap = await getDoc(userRef);
  
      if (!userSnap.exists()) {
        await setDoc(userRef, { userAddress: addr, createdAt: new Date() });
      }
    }
    return NextResponse.json({ id: docRef.id, message: "Method added successfully." });
  } catch (error) {
    console.error("Error adding allowed method: ", error);
    return NextResponse.json({ error: "Internal server error" });
  }

}