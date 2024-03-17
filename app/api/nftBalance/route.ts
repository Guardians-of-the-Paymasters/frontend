import { NextResponse, NextRequest } from "next/server";
import { Network, Alchemy } from "alchemy-sdk";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "@firebase/firestore";

interface SmartContractPolicy {
    id: string; // Document ID
    maxGasPerPolicy: string;
    contractAddress: string;
    sponsoredMethods: string[];
    abi: string;
    maxGasPerUser: string;
    allowlist: string[];
  }


export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        // Optional Config object, but defaults to demo api-key and eth-mainnet.
        const settings = {
            apiKey: "demo", // Replace with your Alchemy API Key.
            network: Network.ETH_MAINNET, // Replace with your network.
        };

        const alchemy = new Alchemy(settings);

        // Print owner's wallet address:
        const ownerAddr = body.address;
        console.log("fetching NFTs for address:", ownerAddr);
        console.log("...");

        // Print total NFT count returned in the response:
        const nftsForOwner = await alchemy.nft.getNftsForOwner(ownerAddr);
        console.log("number of NFTs found:", nftsForOwner.totalCount);
        console.log("...");

        // Print contract address and tokenId for each NFT:

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

        for (const policy of policies)
        {
            for (const nft of nftsForOwner.ownedNfts) {
                if(policy.contractAddress === nft.contract.address){
                    return NextResponse.json(
                        { message: true },
                        { status: 201 }
                    )
                }
            }
        }

        return NextResponse.json(
            { message: false },
            { status: 201 }
        )
    } catch (e) {
        console.log(e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
