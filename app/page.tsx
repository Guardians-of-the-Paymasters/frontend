"use client";

import PolicyDetails from "./components/PolicyDetails";
import SpendingRules from "./components/SpendingRules";
import SmartContractRules from "./components/SmartContractRules";
import AccessControls from "./components/AccessControls";
import { useState } from "react";
import ExpiryAndDurations from "./components/ExpiryAndDurations";
import ActivityContextProvider from "./contexts";

export default function Home() {
    const [completed, setCompleted] = useState(0);

    const handleNext = (sectionNumber: number) => {
        setCompleted(sectionNumber);
    };

    return (
        <ActivityContextProvider>
            <div className="bg-primary-black flex min-h-screen w-screen flex-col px-20 py-16 xl:px-36 xl:py-20">
                <PolicyDetails onCompleted={() => handleNext(1)} />
                <SpendingRules canBeOpened={completed > 0} onCompleted={() => handleNext(2)} />
                <SmartContractRules canBeOpened={completed > 1} onCompleted={() => handleNext(3)} />
                <AccessControls canBeOpened={completed > 2} onCompleted={() => handleNext(4)} />
                <ExpiryAndDurations canBeOpened={completed > 3} onCompleted={() => handleNext(5)} />
            </div>
        </ActivityContextProvider>
    );
}
