import SectionAccordion from "./common/SectionAccordion";
import Button from "./common/Button";
import Form from "./common/Form";
import { useState } from "react";
import { useActivity } from "../contexts";

interface SpendingRulesProps {
    canBeOpened: boolean;
    onCompleted: () => void;
}

const SpendingRules = ({ canBeOpened, onCompleted }: SpendingRulesProps) => {
    const [{ maxTransactionsPerPolicy, maxTransactionsPerUser, maxGasPerPolicy, maxGasPerUser }, dispatch] = useActivity();

    const setMaxTransactionsPerUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "updateMaxTransactionsPerUser", maxTransactionsPerUser: Number(e.target.value) });
    };

    const setMaxTransactionsPerPolicy = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "updateMaxTransactionsPerPolicy", maxTransactionsPerPolicy: Number(e.target.value) });
    };

    const setMaxGasPerUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "updateMaxGasPerUser", maxGasPerUser: Number(e.target.value) });
    };

    const setMaxGasPerPolicy = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch({ type: "updateMaxGasPerPolicy", maxGasPerPolicy: Number(e.target.value) });
    };

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
