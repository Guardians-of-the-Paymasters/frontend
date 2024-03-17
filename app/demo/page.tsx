"use client";

import injectedModule from "@web3-onboard/injected-wallets";
import metamaskSDK from "@web3-onboard/metamask";
import { init, useConnectWallet, useSetChain } from "@web3-onboard/react";
import Button from "../components/common/Button";
import { useEffect } from "react";

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

    return (
        <div className="flex w-screen items-center justify-center px-32 py-20">
            <Button text={wallet ? addressShortFormat(wallet.accounts[0].address) : "connect"} onClick={handleConnect} />
        </div>
    );
}
