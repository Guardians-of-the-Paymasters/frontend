import Image from "next/image";
import SectionAccordion from "./components/common/SectionAccordion";
import Text from "./components/common/Text";
import PolicyDetails from "./components/PolicyDetails";
import Form from "./components/common/Form";
import SpendingRules from "./components/SpendingRules";
import Button from "./components/common/Button";
import SmartContractRules from "./components/SmartContractRules";

export default function Home() {
    return (
        <div className="bg-primary-black flex min-h-screen w-screen flex-col px-36 py-20">
            <PolicyDetails />
            <SpendingRules />
            <SmartContractRules />
        </div>
    );
}
