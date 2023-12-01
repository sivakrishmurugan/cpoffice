import { InputGroup, Input, InputLeftElement, useOutsideClick, InputRightElement, InputGroupProps, Icon, Menu, MenuButton, MenuList, MenuItem, Flex } from "@chakra-ui/react";
import { convertToPriceFormat } from "../../utlils/utill_methods";
import React, { ChangeEvent, useRef } from "react";
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
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    groupProps?: InputGroupProps,
    'data-testid'?: string
}

const AddressInput = ({ fieldName = 'price_input', currentValue, onChange, groupProps = {}, 'data-testid': testid = 'price_input' }: AddressInputProps) => {
    let ref = useRef<HTMLInputElement>(null!);
    const { ready, value, suggestions, setValue, clearSuggestions } = usePlacesAutocomplete({ debounce: 300, requestOptions: { componentRestrictions: { country: "my" } } });
    useOutsideClick({
        ref: ref,
        handler: () => clearSuggestions(),
    })

    const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event);
        setValue(event.target.value);
    }

    console.log(suggestions)

    return (
        <Flex w = '100%' direction = 'column' ref = {ref}>
            <Menu matchWidth isOpen = {suggestions.status.toLowerCase() == 'ok'} placement="bottom" eventListeners = {{ scroll: false }}>
                <Flex w = '100%' position={'relative'} direction={'column'}>
                    <MenuButton position={'absolute'} w = '100%' h = '100%' zIndex={0} />
                    <InputGroup {...groupProps}>
                        <Input 
                            name = {fieldName}
                            onChange = {onChangeInput} 
                            placeholder="ex. 2 Angkasaraya Jln Ampang, Kuala Lumpur" 
                            data-testid = {testid}
                            autoComplete="off"
                        />
                        <InputRightElement h = '100%'>
                            <Icon as = {IcLocationPin} h = 'auto' w = 'auto' />
                        </InputRightElement>
                    </InputGroup>
                </Flex>
                <MenuList>
                    {
                        suggestions.data.map((item: { description: string }) => {
                            return <MenuItem key = {item.description}>{item.description}</MenuItem>
                        })
                    }
                </MenuList>
            </Menu>
        </Flex>
    );
}

export default AddressInput;