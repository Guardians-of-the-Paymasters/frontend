import SectionAccordion from "./common/SectionAccordion";
import Button from "./common/Button";
import Form from "./common/Form";
import { useState } from "react";

interface SpendingRulesProps {
    canBeOpened: boolean;
    onCompleted: () => void;
}

const SpendingRules = ({ canBeOpened, onCompleted }: SpendingRulesProps) => {
    const [maxTransactionsPerUser, setMaxTransactionsPerUser] = useState<number>(0);
    const [maxTransactionsPerPolicy, setMaxTransactionsPerPolicy] = useState<number>(0);
    const [maxGasPerUser, setMaxGasPerUser] = useState<number>(0);
    const [maxGasPerPolicy, setMaxGasPerPolicy] = useState<number>(0);

    return (
        <SectionAccordion disabled={!canBeOpened} title="Spending Rules">
            <div className="flex flex-col gap-10">
                <Form onChange={setMaxTransactionsPerUser} title="Max Transactions per User" placeholder="0" type="number" />
                <Form onChange={setMaxTransactionsPerPolicy} title="Max Transactions per Policy" placeholder="0" type="number" />
                <Form onChange={setMaxGasPerUser} title="Max Gas per User" placeholder="0" type="number" />
                <Form onChange={setMaxGasPerPolicy} title="Max Gas per Policy" placeholder="0" type="number" />
                <Button
                    text="Next"
                    onClick={onCompleted}
                    disabled={!maxGasPerPolicy && !maxGasPerUser && !maxTransactionsPerPolicy && !maxTransactionsPerUser}
                />
            </div>
        </SectionAccordion>
    );
};

export default SpendingRules;
