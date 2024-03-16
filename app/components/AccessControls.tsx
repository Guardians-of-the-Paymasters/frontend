"use client";

import { useState } from "react";
import SectionAccordion from "./common/SectionAccordion";
import Text from "./common/Text";
import AddressInputFields from "./AddressInputField";
import Button from "./common/Button";

const AccessControls = () => {
    const [addresses, setAddresses] = useState<string[]>([""]);
    const [moveToNext, setMoveToNext] = useState<boolean>(false);
    const [allAddressesAreValid, setAllAddressesAreValid] = useState<boolean>(false);

    return (
        <SectionAccordion title="Access Controls">
            <div className="flex flex-col gap-14">
                <div className="flex flex-col gap-3">
                    <Text size="caption1" className="uppercase text-white">
                        Allow list
                    </Text>
                    <AddressInputFields addressesState={{ addresses, setAddresses }} />
                </div>
                <Button text="Next" onClick={() => setMoveToNext(true)} />
            </div>
        </SectionAccordion>
    );
};

export default AccessControls;
