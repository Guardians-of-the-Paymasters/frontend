import { NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';


export async function POST(req: Request) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, {status: 405});
  }
  
  try {
    // Attempt to add a document to the "test" collection
    await addDoc(collection(db, "test"), {
      name: "Test Document",
      timestamp: new Date(),
    });
    return NextResponse.json({ message: 'Document added successfully.' }, {status: 200});
  } catch (error) {
    console.error("Error adding document to Firestore: ", error);
    return NextResponse.json({ error: 'Failed to add document.' },{status: 500});
  }
}
