import SectionAccordion from "./common/SectionAccordion";
import Button from "./common/Button";
import Form from "./common/Form";
import Text from "./common/Text";

const PolicyDetails = () => {
    return (
        <SectionAccordion title="Policy Details">
            <div className="flex flex-col gap-14">
                <Form title="Policy Name" placeholder="Ex. Gas fee Sponsor" />
                <Button text="Next" />
            </div>
        </SectionAccordion>
    );
};

export default PolicyDetails;
