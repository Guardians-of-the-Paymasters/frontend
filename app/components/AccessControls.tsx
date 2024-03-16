"use client";

import { useState } from "react";
import SectionAccordion from "./common/SectionAccordion";
import Text from "./common/Text";
import AddressInputFields from "./AddressInputField";
import Button from "./common/Button";

interface AccessControlsProps {
    canBeOpened: boolean;
    onCompleted: () => void;
}

const AccessControls = ({ canBeOpened, onCompleted }: AccessControlsProps) => {
    const [addresses, setAddresses] = useState<string[]>([""]);

    return (
        <SectionAccordion disabled={!canBeOpened} title="Access Controls">
            <div className="flex flex-col gap-14">
                <div className="flex flex-col gap-3">
                    <Text size="caption1" className="uppercase text-white">
                        Allow list
                    </Text>
                    <AddressInputFields addressesState={{ addresses, setAddresses }} />
                </div>
                <Button text="Next" onClick={onCompleted} disabled={addresses[0].length == 0} />
            </div>
        </SectionAccordion>
    );
};

export default AccessControls;
