import { InputGroup, Input, InputLeftElement, InputRightElement, InputGroupProps } from "@chakra-ui/react";
import { convertToPriceFormat } from "../../utlils/utill_methods";
import React, { ChangeEvent, useRef } from "react";
import { useEffect } from "react";

interface PriceInputProps {
    fieldName?: string,
    currentPrice: number,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    forceUpdateOnPriceChange?: boolean,
    rightElement?: JSX.Element | string | null,
    groupProps?: InputGroupProps,
    'data-testid'?: string
}

const PriceInput = ({ fieldName = 'price_input', currentPrice, onChange, rightElement, groupProps = {}, forceUpdateOnPriceChange = false, 'data-testid': testid = 'price_input' }: PriceInputProps) => {
    let ref = useRef<HTMLInputElement>(null!);

    useEffect(() => {
        if(forceUpdateOnPriceChange && ref.current != document.activeElement) {
            ref.current.value = convertToPriceFormat(currentPrice, false, true);
        }
    }, [currentPrice, forceUpdateOnPriceChange])
    
    const onBlurPrice = () => {
        if(ref == null || ref.current == null) return ;
        ref.current.value = convertToPriceFormat(currentPrice, false, true);
    }

    return (
        <InputGroup {...groupProps}>
            <InputLeftElement pointerEvents="none" w = '50px' h='100%'>RM</InputLeftElement>
            <Input 
                ref = {ref}
                name = {fieldName}
                defaultValue = {convertToPriceFormat(currentPrice, false, true)} 
                onBlur = {onBlurPrice}
                onChange = {onChange} 
                placeholder = "0"
                inputMode = 'numeric'
                data-testid = {testid}
            />
            {rightElement != null && <InputRightElement w = '50px' h = '100%'>{rightElement}</InputRightElement>}
        </InputGroup>
    );
}

export default PriceInput;