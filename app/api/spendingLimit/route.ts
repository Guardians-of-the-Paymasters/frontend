import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { collection, query, where, addDoc, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

const spendingCap = BigInt("1000000000000000000"); // 1 ETH in wei as BigInt

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
  }

  const body = await req.json();
  console.log(body)

  if (!body.userAddress) {
    return NextResponse.json({ error: 'User address is required' }, { status: 400 });
  }

  try {
    const userRef = doc(db, 'Users', body.userAddress);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      // User already exists, update logic here if needed
      return NextResponse.json({ message: 'User already exists', user: userSnap.data() }, { status: 200 });
    } else {
      // Add new user
      await setDoc(userRef, { userAddress: body.userAddress, createdAt: new Date() });

      return NextResponse.json({ message: 'User added successfully' }, { status: 201 });
    }
  } catch (error) {
    console.error('Error adding/updating user: ', error);
  }

  // Convert amount to BigInt (assuming amount is a string representing value in wei)
  const amountBigInt = BigInt(body.amount);

  // Query Firestore for transactions in the current period
  const transactionsRef = collection(db, "transactions");
  const q = query(transactionsRef, where("userAddress", "==", body.userAddress));
  const querySnapshot = await getDocs(q);

  let spentAmount = BigInt(0);
  querySnapshot.forEach((doc) => {
    const txn = doc.data();
    spentAmount += BigInt(txn.amount);
  });

  if (spentAmount + amountBigInt <= spendingCap) {
    // Log transaction
    await addDoc(transactionsRef, { userAddress : body.userAddress, amount: body.amount.toString(), timestamp: new Date() });
    return NextResponse.json({ message: "Transaction sponsored " }, { status: 201 });
  } else {
    return NextResponse.json({ error: "Not eligable for gas sponsorship, Spending cap reached " }, { status: 400 });
  }
}

