"use client";

import SectionAccordion from "./common/SectionAccordion";
import Button from "./common/Button";
import Form from "./common/Form";
import { useState } from "react";

interface PolicyDetailsProps {
    onCompleted: () => void;
}

const PolicyDetails = ({ onCompleted }: PolicyDetailsProps) => {
    const [policyName, setPolicyName] = useState<string>("");

    return (
        <SectionAccordion title="Policy Details">
            <div className="flex flex-col gap-14">
                <Form title="Policy Name" placeholder="Ex. Gas fee Sponsor" onChange={setPolicyName} />
                <Button text="Next" onClick={onCompleted} disabled={policyName.length == 0} />
            </div>
        </SectionAccordion>
    );
};

export default PolicyDetails;
