import { Flex, FormControl, FormErrorMessage, FormLabel, Icon, IconButton, Input, Select } from "@chakra-ui/react";
import { TYPE_OF_CLAIM } from "../../app/app_constants";
import { getRecentYears } from "../../utlils/utill_methods";
import { PriceInput } from "../inputs";
import { DeleteIcon } from "../../icons";
import { ChangeEvent } from "react";

interface ClaimInfoFormProps {
    isNotDeletable: boolean,
    values: {
        type: { value: string, error: boolean },
        year: { value: string, error: boolean },
        amount: { value: number, error: boolean },
        description: { value: string, error: boolean }
    },
    onChangeValue: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: 'type' | 'year' | 'amount' | 'desciption') => void,
    onClickDelete: () => void
}

const ClaimInfoForm = ({ values, isNotDeletable, onChangeValue, onClickDelete }: ClaimInfoFormProps) => {
    return (
        <FormControl isInvalid = {Object.values(values).some(e => e.error)}>
            <Flex flexShrink={0} direction={['column', 'column', 'column', 'row', 'row']} w = '100%' py = {['10px', '10px', '10px', '0px', '0px']} gap = '20px' alignItems={['flex-start', 'flex-start', 'flex-start', 'center', 'center']}>

                <FormControl flexShrink={0} w = {['100%', '100%', '100%', '16%', '16%']} isInvalid = {values.type.error}>
                    <FormLabel display={['block', 'block', 'block', 'none', 'none']}>Type of Claim</FormLabel>
                    <Select value = {values.type.value} onChange = {e => onChangeValue(e, 'type')}>
                        {
                            TYPE_OF_CLAIM.map(e => {
                                return <option key = {e.id} value = {e.id}>{e.value}</option>
                            })
                        }
                    </Select>
                    <FormErrorMessage ml = '10px' display={['block', 'block', 'block', 'none', 'none']}>Type of claim is required!</FormErrorMessage>
                </FormControl>

                <FormControl flexShrink={0} w = {['100%', '100%', '100%', '16%', '16%']} isInvalid = {values.year.error}>
                    <FormLabel display={['block', 'block', 'block', 'none', 'none']}>Year of Claim</FormLabel>
                    <Select value = {values.year.value} onChange = {e => onChangeValue(e, 'year')}>
                        {
                            getRecentYears().reverse().map(e => {
                                return <option key = {e} value = {e}>{e}</option>
                            })
                        }
                    </Select>
                    <FormErrorMessage ml = '10px' display={['block', 'block', 'block', 'none', 'none']}>Year of claim is required!</FormErrorMessage>
                </FormControl>

                <FormControl flexShrink={0} w = {['100%', '100%', '100%', '16%', '16%']} isInvalid = {values.amount.error}>
                    <FormLabel display={['block', 'block', 'block', 'none', 'none']}>Amount of Claim</FormLabel>
                    <PriceInput 
                        currentPrice = {values.amount.value}
                        onChange = {e => onChangeValue(e, 'amount')}
                        forceUpdateOnPriceChange
                    />
                    <FormErrorMessage ml = '10px' display={['block', 'block', 'block', 'none', 'none']}>Amount of claim is required!</FormErrorMessage>
                </FormControl>

                <FormControl flexShrink={0} w = {['100%', '100%', '100%', '33%', '33%']} isInvalid = {values.description.error}>
                    <FormLabel display={['block', 'block', 'block', 'none', 'none']}>Description</FormLabel>
                    <Input value = {values.description.value} onChange = {e => onChangeValue(e, 'desciption')} placeholder = "Describe claim details" />
                    <FormErrorMessage ml = '10px' display={['block', 'block', 'block', 'none', 'none']}>Description is required!</FormErrorMessage>
                </FormControl>

                {
                    isNotDeletable != true &&
                    <IconButton 
                        onClick = {onClickDelete}
                        variant = {'unstyled'}
                        aria-label = {"delete_info"} 
                        isRound  
                        icon = {<Icon w = 'auto' h = 'auto' minW = '45px' minH = '45px' as = {DeleteIcon} />}
                    />
                }

            </Flex>
            <FormErrorMessage ml = '10px' display={['none', 'none', 'none', 'block', 'block']}>All information are required!</FormErrorMessage>
        </FormControl>
    );
}

export default ClaimInfoForm;