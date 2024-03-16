"use client";

import SectionAccordion from "./common/SectionAccordion";
import Button from "./common/Button";
import Form from "./common/Form";
import { useState } from "react";
import { useActivity } from "../contexts";

interface PolicyDetailsProps {
    onCompleted: () => void;
}

const PolicyDetails = ({ onCompleted }: PolicyDetailsProps) => {
    const [{ policyName }, dispatch] = useActivity();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "updatePolicyName", policyName: e.target.value });
    };

    return (
        <SectionAccordion title="Policy Details">
            <div className="flex flex-col gap-14">
                <Form title="Policy Name" placeholder="Ex. Gas fee Sponsor" onChange={handleChange} />
                <Button text="Next" onClick={onCompleted} disabled={policyName.length == 0} />
            </div>
        </SectionAccordion>
    );
};

export default PolicyDetails;
