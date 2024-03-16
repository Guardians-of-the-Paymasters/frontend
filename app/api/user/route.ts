import { db } from "@/firebaseConfig";
import { addDoc, collection } from "@firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    if (req.method !== 'POST') {
      return NextResponse.json({ message: 'Method Not Allowed' }, {status: 405});
    }
    
    const body = await req.json()
    try {
      // Attempt to add a document to the "test" collection
      await addDoc(collection(db, "Users"), {
        addresss: body.userAddress,
        spendingLimit: body.spendingLimit
      });
      return NextResponse.json({ message: 'Document added successfully.' }, {status: 200});
    } catch (error) {
      console.error("Error adding document to Firestore: ", error);
      return NextResponse.json({ error: 'Failed to add document.' },{status: 500});
    }
  }