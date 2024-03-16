"use client";

import SectionAccordion from "./common/SectionAccordion";
import Form from "./common/Form";
import Button from "./common/Button";
import { useState } from "react";
import { useActivity } from "../contexts";

interface ExpiryAndDurationsProps {
    canBeOpened: boolean;
    onCompleted: () => void;
}

const ExpiryAndDurations = ({ canBeOpened, onCompleted }: ExpiryAndDurationsProps) => {
    const [policyStart, setPolicyStart] = useState<string>("");
    const [policyEnd, setPolicyEnd] = useState<string>("");
    const [_, dispatch] = useActivity();

    const handleSubmit = () => {
        const startTimestamp = new Date(policyStart).getTime() / 1000; // Convert to seconds
        const endTimestamp = new Date(policyEnd).getTime() / 1000; // Convert to seconds

        dispatch({ type: "updatePolicyStart", policyStart: startTimestamp.toString() });
        dispatch({ type: "updatePolicyEnd", policyEnd: endTimestamp.toString() });

        onCompleted(); // Proceed to next step or validation
    };

    const handlePolicyStart = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPolicyStart(e.target.value);
    };

    const handlePolicyEnd = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPolicyEnd(e.target.value);
    };

    return (
        <SectionAccordion disabled={!canBeOpened} title="Expiry and Durations">
            <div className="flex w-full flex-col gap-14">
                <div className="flex w-full items-center gap-10">
                    <Form title="Policy Start" className="!w-full" onChange={handlePolicyStart} placeholder="" type="datetime-local" />
                    <Form title="Policy End" className="!w-full" placeholder="" type="datetime-local" onChange={handlePolicyEnd} />
                </div>
                <Button text="Next" onClick={handleSubmit} />
            </div>
        </SectionAccordion>
    );
};

export default ExpiryAndDurations;
