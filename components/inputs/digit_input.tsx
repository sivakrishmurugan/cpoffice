"use client"
import { Input, InputProps } from "@chakra-ui/react";
import React, { ChangeEvent, useRef } from "react";
import { useEffect } from "react";

interface DigitInputProps {
    fieldName?: string,
    currentValue: number,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    forceUpdateOnValueChange?: boolean,
    emptyOnZero?: boolean,
    inputProps?: InputProps,
    'data-testid'?: string
}

const DigitInput = ({ fieldName = 'digit_input', emptyOnZero = false, inputProps = {}, currentValue, onChange, forceUpdateOnValueChange = false, 'data-testid': testid = 'digit_input' }: DigitInputProps) => {
    let ref = useRef<HTMLInputElement>(null!);

    useEffect(() => {
        if(forceUpdateOnValueChange && ref.current != document.activeElement) {
            ref.current.value = currentValue == 0 && emptyOnZero ? '' : currentValue.toString();
        }
    }, [currentValue, emptyOnZero, forceUpdateOnValueChange])
    
    const onBlurPrice = () => {
        if(ref == null || ref.current == null) return ;
        ref.current.value = currentValue == 0 && emptyOnZero ? '' : currentValue.toString();
    }

    return (
        <Input 
            ref = {ref}
            name = {fieldName}
            defaultValue = {currentValue} 
            onBlur = {onBlurPrice}
            onChange = {onChange} 
            pattern="[0-9]*"
            inputMode="numeric"
            data-testid = {testid}
            {...inputProps}
        />
    );
}

export default DigitInput;