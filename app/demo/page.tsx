"use client";

import injectedModule from "@web3-onboard/injected-wallets";
import metamaskSDK from "@web3-onboard/metamask";
import { init, useConnectWallet, useSetChain } from "@web3-onboard/react";
import Button from "../components/common/Button";
import { useEffect, useState } from "react";
import axios from "axios";

const injected = injectedModule();
const metamaskSDKWallet = metamaskSDK({
    options: {
        extensionOnly: false,
        dappMetadata: {
            name: "Galaxythrone",
        },
    },
});

const CHAIN_ID = "0xaa36a7";

init({
    wallets: [injected, metamaskSDKWallet],
    chains: [
        {
            id: CHAIN_ID,
            token: "ETH",
            label: "Sepolia",
            rpcUrl: "https://ethereum-sepolia-rpc.publicnode.com",
        },
    ],
    accountCenter: {
        desktop: {
            enabled: false,
            containerElement: "body",
        },
        mobile: {
            enabled: false,
            containerElement: "body",
        },
    },
});

export default function Demo() {
    const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
    const [{ connectedChain }, setChain] = useSetChain();
    const [hasBeenCalled, setHasBeenCalled] = useState(false);

    const addressShortFormat = (address: string, amount?: number) => {
        if (!amount) amount = 4;
        return address.slice(0, amount) + "..." + address.slice(address.length - amount, address.length);
    };

    const handleConnect = () => {
        if (!wallet && typeof window !== "undefined") {
            connect();
        } else if (!connecting && wallet) {
            disconnect({ label: wallet.label });
        }
    };

    useEffect(() => {
        if (wallet && connectedChain?.id !== CHAIN_ID) {
            setChain({ chainId: CHAIN_ID });
        }
    }, [connectedChain, wallet]);

    const triggerBackend = async () => {
        if (!wallet || !wallet.accounts || !wallet.accounts[0].address) return;

        console.log("hasBeenCalled", hasBeenCalled);

        try {
            let apiUrl = "/api/requestPaymasterSignature";
            let postData = {
                ownerAddress: wallet.accounts[0].address,
                functionData: hasBeenCalled ? "0x68656c6c6f" : "0x6865",
            };

            const response = await axios.post(apiUrl, postData);

            if (response.status !== 200) {
                // Handle non-200 responses if needed
                alert("An error occurred");
                return;
            }

            alert("Success!");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 500) {
                alert("Policy not set for this method");
                setHasBeenCalled(true);
            } else {
                console.error("An unexpected error occurred:", error);
                alert("An error occurred");
            }
        }
    };

    return (
        <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-10 px-32 py-20">
            <div>
                <Button text={wallet ? addressShortFormat(wallet.accounts[0].address) : "connect"} onClick={handleConnect} />
            </div>
            <div>{wallet && <Button text="request user operation sponsorship" onClick={triggerBackend} />}</div>
        </div>
    );
}
