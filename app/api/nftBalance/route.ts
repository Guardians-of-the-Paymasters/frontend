import { NextResponse, NextRequest } from "next/server";
import { Network, Alchemy } from "alchemy-sdk";

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
        for (const nft of nftsForOwner.ownedNfts) {
            console.log("===");
            console.log("contract address:", nft.contract.address);
            console.log("token ID:", nft.tokenId);
        }
        console.log("===");

        // Uncomment this line to see the full api response:
        // console.log(response);

        // console.log("NFT name: ", response.title);
        // console.log("token type: ", response.tokenType);
        // console.log("tokenUri: ", response.tokenUri.gateway);
        // console.log("image url: ", response.rawMetadata.image);
        // console.log("time last updated: ", response.timeLastUpdated);
        // console.log("===");




    } catch (e) {
        console.log(e);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
