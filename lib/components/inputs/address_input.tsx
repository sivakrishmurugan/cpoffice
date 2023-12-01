import { InputGroup, Input, InputLeftElement, useOutsideClick, InputRightElement, InputGroupProps, Icon, Menu, MenuButton, MenuList, MenuItem, Flex } from "@chakra-ui/react";
import { convertToPriceFormat } from "../../utlils/utill_methods";
import React, { ChangeEvent, useRef, useState } from "react";
import { useEffect } from "react";
import { IcLocationPin } from "@/lib/icons";
import usePlacesAutocomplete, {
    RequestOptions,
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";

interface AddressInputProps {
    fieldName?: string,
    currentValue: string,
    onChange: (address: string) => void,
    groupProps?: InputGroupProps,
    'data-testid'?: string
}

const AddressInput = ({ fieldName = 'price_input', currentValue, onChange, groupProps = {}, 'data-testid': testid = 'price_input' }: AddressInputProps) => {
    let listFirstItemRef = useRef<HTMLButtonElement>(null!);
    let outSideRef = useRef<HTMLDivElement>(null!);
    const { ready, value, suggestions, setValue, clearSuggestions } = usePlacesAutocomplete({ debounce: 300, requestOptions: { componentRestrictions: { country: "my" } } });
    useOutsideClick({
        ref: outSideRef,
        handler: () => clearSuggestions(),
    })

    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
        setValue(event.target.value);
    }

    const onSelectAddress = (address: string) => {
       onChange(address)
       clearSuggestions()
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.code == 'ArrowDown' || event.code == 'ArrowUp') {
            console.log('forforwing focus')
            listFirstItemRef.current.focus()
        }
    }

    return (
        <Flex w = '100%' direction = 'column' ref = {outSideRef}>
            <Menu matchWidth autoSelect isOpen = {suggestions.status.toLowerCase() == 'ok'} placement="bottom" eventListeners = {{ scroll: false }}>
                <Flex w = '100%' position={'relative'} direction={'column'}>
                    <MenuButton pointerEvents={'none'} position={'absolute'} w = '100%' h = '100%' zIndex={0} />
                    <InputGroup zIndex={999} {...groupProps}>
                        <Input 
                            name = {fieldName}
                            value={currentValue}
                            onChange = {onChangeInput} 
                            placeholder="ex. 2 Angkasaraya Jln Ampang, Kuala Lumpur" 
                            data-testid = {testid}
                            onKeyDown={onKeyDown}
                            autoComplete="off"
                        />
                        <InputRightElement h = '100%'>
                            <Icon as = {IcLocationPin} h = 'auto' w = 'auto' />
                        </InputRightElement>
                    </InputGroup>
                </Flex>
                <MenuList>
                    {
                        suggestions.data.map((item: { description: string }, index) => {
                            return <MenuItem 
                                ref = {index == 0 ? listFirstItemRef : null}
                                onClick={() => onSelectAddress(item.description)} 
                                alignItems={'flex-start'}
                                icon={<Icon mt = '3px' w = 'auto' h = 'auto' as = {IcLocationPin} />}
                            >
                                {item.description}
                            </MenuItem>
                        })
                    }
                </MenuList>
            </Menu>
        </Flex>
    );
}

export default AddressInput;