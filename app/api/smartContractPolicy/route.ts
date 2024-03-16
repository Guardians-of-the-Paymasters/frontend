

import { NextApiRequest } from 'next';
import { db } from '../../../firebaseConfig';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

  try {

    const body = await req.json();


    // Check to make sure user exists
    console.log("BEFORE GET SUERS")
    console.log(body.userAddress)
    const userRef = doc(db, "Users", body.userAddress);
    console.log("AFTER GET USERS")
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      // User does not exist, return an error
      return NextResponse.json({ error: "User does not exist" });
    }

    // Add an allowed method to the Firestore
    const docRef = await addDoc(collection(db, "AllowedMethods"), {
      contractAddress: body.contractAddress,
      sponsoredMethods: body.sponsoredMethods,
      abi: body.abi,
      address: body.userAddress
    });

    return NextResponse.json({ id: docRef.id, message: "Method added successfully." });
  } catch (error) {
    console.error("Error adding allowed method: ", error);
    return NextResponse.json({ error: "Internal server error" });
  }

}