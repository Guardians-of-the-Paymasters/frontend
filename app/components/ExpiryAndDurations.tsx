"use client";

import SectionAccordion from "./common/SectionAccordion";
import Form from "./common/Form";
import Button from "./common/Button";
import { useState } from "react";
import { useActivity } from "../contexts";
import axios from "axios";

interface ExpiryAndDurationsProps {
    canBeOpened: boolean;
}

const ExpiryAndDurations = ({ canBeOpened }: ExpiryAndDurationsProps) => {
    const [policyStart, setPolicyStart] = useState<string>("");
    const [policyEnd, setPolicyEnd] = useState<string>("");
    const [
        {
            smartContractAddress,
            functionsSelected,
            abi,
            policyName,
            nftIds,
            policyEndTimestamp,
            policyStartTimestamp,
            addresses,
            maxGasPerPolicy,
            maxGasPerUser,
        },
        dispatch,
    ] = useActivity();

    const handleSubmit = () => {
        const startTimestamp = new Date(policyStart).getTime() / 1000; // Convert to seconds
        const endTimestamp = new Date(policyEnd).getTime() / 1000; // Convert to seconds

        dispatch({ type: "updatePolicyStart", policyStart: startTimestamp.toString() });
        dispatch({ type: "updatePolicyEnd", policyEnd: endTimestamp.toString() });

        submit();
    };

    const handlePolicyStart = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPolicyStart(e.target.value);
    };

    const handlePolicyEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPolicyEnd(e.target.value);
    };

    const submit = async () => {
        const response = await axios.post("/api/smartContractPolicy", {
            contractAddress: smartContractAddress,
            sponsoredMethods: functionsSelected,
            abi: abi,
            policyName: policyName,
            maxGasPerUser: maxGasPerUser,
            maxGasPerPolicy: maxGasPerPolicy,
            allowlist: addresses,
            nftIds: nftIds,
            policyStart: policyStartTimestamp,
            policyEnd: policyEndTimestamp,
        });

        console.log(response);

        if (response.status === 200) {
            alert("Policy created successfully");
        }
    };

    return (
        <SectionAccordion disabled={!canBeOpened} title="Expiry and Durations">
            <div className="flex w-full flex-col gap-14">
                <div className="flex w-full items-center gap-10">
                    <Form title="Policy Start" className="!w-full" onChange={handlePolicyStart} placeholder="" type="datetime-local" />
                    <Form title="Policy End" className="!w-full" placeholder="" type="datetime-local" onChange={handlePolicyEnd} />
                </div>
                <Button text="Submit" onClick={handleSubmit} />
            </div>
        </SectionAccordion>
    );
};

export default ExpiryAndDurations;
