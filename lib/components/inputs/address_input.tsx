import { InputGroup, Input, InputLeftElement, InputRightElement, InputGroupProps, Icon } from "@chakra-ui/react";
import { convertToPriceFormat } from "../../utlils/utill_methods";
import React, { ChangeEvent, useRef } from "react";
import { useEffect } from "react";
import { IcLocationPin } from "@/lib/icons";

interface AddressInputProps {
    fieldName?: string,
    currentValue: string,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    groupProps?: InputGroupProps,
    'data-testid'?: string
}

const AddressInput = ({ fieldName = 'price_input', currentValue, onChange, groupProps = {}, 'data-testid': testid = 'price_input' }: AddressInputProps) => {
    let ref = useRef<HTMLInputElement>(null!);

    return (
        <InputGroup {...groupProps}>
            <Input 
                ref = {ref}
                name = {fieldName}
                onChange = {onChange} 
                placeholder="ex. 2 Angkasaraya Jln Ampang, Kuala Lumpur" 
                data-testid = {testid}
            />
            <InputRightElement h = '100%'>
                <Icon as = {IcLocationPin} h = 'auto' w = 'auto' />
            </InputRightElement>
        </InputGroup>
    );
}

export default AddressInput;