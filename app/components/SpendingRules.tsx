import SectionAccordion from "./common/SectionAccordion";
import Button from "./common/Button";
import Form from "./common/Form";
import Text from "./common/Text";

const SpendingRules = () => {
    return (
        <SectionAccordion title="Spending Rules">
            <div className="flex flex-col gap-10">
                <Form title="Max Transactions per User" placeholder="0" type="number" />
                <Form title="Max Transactions per Policy" placeholder="0" type="number" />
                <Form title="Max Gas per User" placeholder="0" type="number" />
                <Form title="Max Gas per Policy" placeholder="0" type="number" />
                <Button text="Next" />
            </div>
        </SectionAccordion>
    );
};

export default SpendingRules;
