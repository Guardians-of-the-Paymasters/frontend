import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../firebaseConfig';
import { collection, query, where, addDoc, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';

const spendingCap = BigInt("1000000000000000000"); // 1 ETH in wei as BigInt of gas

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
    // Proceed with Firestore checks and logic...
    const userRef = doc(db, 'Users', body.userAddress);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      // Optionally handle new user logic
      await setDoc(userRef, { userAddress: body.userAddress, createdAt: new Date() });
    }

    // Query Firestore for transactions...
    const transactionsRef = collection(db, "transactions");
    const q = query(transactionsRef, where("userAddress", "==", body.userAddress));
    const querySnapshot = await getDocs(q);
    
    let spentAmount = BigInt(0);
    querySnapshot.forEach((doc) => {
      const txn = doc.data();
      spentAmount += BigInt(txn.amount);
    });

    if (spentAmount + totalGasCost <= spendingCap) {
      // Log transaction
      await addDoc(transactionsRef, { userAddress: body.userAddress, amount: totalGasCost.toString(), timestamp: new Date() });
      return NextResponse.json({ message: "Transaction sponsored" },{status:201});
    } else {
      return NextResponse.json({ error: "Not eligible for gas sponsorship, spending cap reached" },{status:400});
    }
  } catch (error) {
    console.error('Error processing request: ', error);
    return NextResponse.json({ error: "Internal server error" },{status:500});
  }
}

