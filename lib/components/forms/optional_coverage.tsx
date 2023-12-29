import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { ClinicData, Coverage, SelectedCoverage } from "../../types";
import ExpanableList from "../expandable_list";
import { PriceInput } from "../inputs";
import { ChangeEvent } from "react";
import Image from 'next/image';
import { useSessionStorage } from "../../hooks";
import useCoverage from "../../hooks/use_coverage";
import { AUDITOR_FEE_REPLACE_TEXT, MAX_AUDITOR_FEE_PERCENTAGE } from "../../app/app_constants";
import { convertToPriceFormat } from "../../utlils/utill_methods";
import { calculatePremiumForOptionalCoverage, percentageResult } from "../../utlils/calculation";
import ResponsiveTooltip from "../tooltip";

interface OptionalCoverageFromProps {
    coverage: Coverage,
    isAdded: boolean,
    onClickAddOrRemove: () => void,
    onChangeFieldValue: (event: ChangeEvent<HTMLInputElement>) => void,
    values?: SelectedCoverage,
    errors?: { field_1: boolean, field_2: boolean }
}

const OptionalCoverageForm = ({ values, isAdded, errors, coverage, onClickAddOrRemove, onChangeFieldValue }: OptionalCoverageFromProps) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData } = useCoverage(localData?.quoteId);
    const selectedInsType = localData?.selectedInsType ?? 'FIRE';
    
    const premium = calculatePremiumForOptionalCoverage(values, coverage, selectedInsType, localData?.selectedCoverages ?? [], coveragesData?.coverages ?? [])
    const icon = '/icons/' + coverage.ImageName.replace('.jpg', '.svg');

    const isProtectAgainstLossOfRevenueCoverage = coverage.CoverageName == 'Protect against Loss of Revenue';

    const coverageIncludes = coverage.Includes['Coverage includes'].map(item => {
        if(isProtectAgainstLossOfRevenueCoverage && item.includes(AUDITOR_FEE_REPLACE_TEXT)) {
            let replaceText = (values?.field_2 ?? 0) > 0 ? 'RM ' + convertToPriceFormat(values?.field_2 ?? 0, false, true) : '';
            const splittedText = item.replace(AUDITOR_FEE_REPLACE_TEXT, `<replace_text><b>${replaceText}<b><replace_text>`).split('<replace_text>')
            return <Text key = {item}>{splittedText.map(e => e.startsWith('<b>') ? <Text key = {e} as = 'b' color = 'brand.primary'>{e.replaceAll('<b>', ' ')}</Text> : e)}</Text>
            //return item.replace(AUDITOR_FEE_REPLACE_TEXT, replaceText);
        }
        return item;
    })

    const inputFields = Object.entries(coverage.CoverageFields).filter(e => e != null && e[1].label != null && e[1].label != '').map(([field, fieldValues], index) => {
        let label: null |string | JSX.Element = fieldValues.label;
        let error = null as string | null;
        const fieldKey = field == 'field_1' ? 'field_1' : 'field_2';
        const value = values?.[fieldKey] ?? 0;
        const field2MaxValue = Math.round(Number(percentageResult(MAX_AUDITOR_FEE_PERCENTAGE, values?.field_1 ?? 0)));
        if(isProtectAgainstLossOfRevenueCoverage && fieldKey == 'field_2' && (values?.field_1 ?? 0) > 0) {   
            label = <Text>{label} <Text as = 'b' color = 'brand.primary'>(Max. RM {convertToPriceFormat(field2MaxValue, true,  true)})</Text></Text>;
        }
        if(errors?.[fieldKey] == true) {
            if(fieldKey == 'field_1') error = 'Required!';
            if(fieldKey == 'field_2') error = `Coverage cannot be more than RM ${convertToPriceFormat(field2MaxValue, true, true)}`;
        }
        
        return {
            name: fieldKey,
            label: label,
            value: value,
            error: error,
            note: fieldValues.note,
            isDisabled: fieldKey == 'field_2' && (values?.field_1 ?? 0) < 1
        }
    })

    return (
        <Flex 
            w = '100%' 
            minH = '150px' 
            bg = {'white'}
            gap = '30px'
            borderRadius={'10px'}
            direction={['column', 'column', 'column', 'row', 'row']}
            p = {[
                '20px 20px',
                '20px 20px',
                '40px 30px 40px 40px',
                '40px 30px 40px 40px',
                '40px 30px 40px 40px',
            ]}
            boxShadow={'0 2px 8px rgba(0, 0, 0, .2)'}
            color = 'brand.text'
        >
            <Flex w = {['100%', '100%', '100%', '80%', '80%']} direction={'column'}>

                <Flex w = '100%' gap = '35px' alignItems={'center'}>
                    <Flex position={'relative'} flexShrink={0} w = {['40px', '40px', '80px', '80px', '80px']} h = {['40px', '40px', '80px', '80px', '80px']}>
                        <Image src={icon} alt={'Coverage Icon'} fill />
                    </Flex>
                    <Heading as = {'h1'} fontSize={'23px'}>{coverage.CoverageName}</Heading>
                </Flex>
                
                <Flex my = '20px' w = {'calc(100% + 40px)'} ml = '-20px' display={['flex', 'flex', 'none', 'none', 'none']} h ='1px' bg = 'brand.borderColor'></Flex>

                <Flex mt = {['0px', '0px', '60px', '60px', '60px']} w = {['100%', '100%', '100%', '90%', '80%']} gap = {'20px'} direction={['column', 'column', 'column', 'row', 'row']}>

                    <Flex w = {'100%'} direction={'column'} gap = {['20px', '20px', '30px', '30px', '30px']}>
                        <Flex display={['flex', 'flex', 'none', 'none', 'none']}>
                            <ExpanableList
                                list = {coverageIncludes}
                                title = "Coverage includes" 
                            />
                        </Flex>
                        <Flex display={['none', 'none', 'flex', 'flex', 'flex']} gap = '10px' maxW = '350px' direction={'column'}>
                            <Text fontSize = '16px' fontWeight={'bold'}>Coverage includes: </Text>
                            <UnorderedList ml = '40px' fontSize={'14px'}>
                                {
                                    coverageIncludes.map((includedItem, index) => {
                                        return <ListItem key = {index}>{includedItem}</ListItem>;
                                    })
                                }
                            </UnorderedList>
                        </Flex>
                    </Flex>
                    
                    <Flex w = {'100%'} direction={'column'} gap = '30px'>
                        <Flex direction={'column'} maxW={['100%', '100%', '100%', '500px', '500px']} gap = '10px'>
                            {
                                inputFields.map((field, index) => {
                                    return <ResponsiveTooltip key = {field.name} isDisabled = {field.isDisabled == false} placement="bottom-start" label = {'Gross revenue required!'}>
                                        <FormControl isInvalid = {field.error != null && field.isDisabled == false}>
                                            <FormLabel>{field.label}</FormLabel>
                                            <PriceInput 
                                                fieldName = {field.name}
                                                currentPrice = {field.isDisabled ? 0 : field.value}
                                                onChange = {onChangeFieldValue}
                                                isDisabled = {field.isDisabled}
                                                groupProps = {{ w: ['100%', '100%', '100%', '300px', '300px'] }}
                                                forceUpdateOnPriceChange
                                            />
                                            <FormErrorMessage ml = '10px'>{field.error}</FormErrorMessage>
                                            {field.note != null && field.note != '' && <Text mt = '10px' fontSize={'14px'}>Note: {field.note}</Text>}
                                        </FormControl>
                                    </ResponsiveTooltip>
                                })
                            }
                        </Flex>
                        
                    </Flex>
                </Flex>
            </Flex>

            <Flex minW = '260px' w = {['100%', '100%', '100%', '20%', '20%']} gap = '30px' direction={'column'}>
                <Flex 
                    minH = {['0px', '0px', '250px', '250px', '250px']}
                    direction = {'column'}
                    borderRadius={'8px'} 
                    border = '1px solid #e1e1e1' 
                    boxShadow={'0 2px 5px rgba(0, 0, 0, .07)'} 
                    p = '20px 20px 15px'
                    gap = '20px'
                    backgroundImage = {'/icons/pre-Circle.svg'}
                    backgroundPosition = {'100% 0'}
                    backgroundSize = {'auto'}
                    backgroundRepeat = {'no-repeat'}
                    justifyContent={'space-between'}
                >
                    <Text color = '#4a4a4a' fontSize = {'16px'} fontWeight={'bold'}>PREMIUM</Text>
                    <Flex w = '100%' gap = '10px' direction={'column'}>
                        <Text fontSize={'14px'} color = 'brand.text'>Protection from revenue loss resulting from covered events or circumstances.</Text>
                        <Heading textAlign={'end'} as = 'h1' fontSize={'24px'}>RM {convertToPriceFormat(premium, true)}</Heading>
                    </Flex>
                </Flex>
                <Button 
                    onClick={onClickAddOrRemove} 
                    w = '100%'
                    bg={isAdded ? 'brand.gray' : "brand.primary"} color = 'white' 
                    _hover = {{}} _focus={{}}
                >
                    {isAdded ? 'REMOVE' : 'ADD'}
                </Button>
            </Flex>
            
        </Flex>
    );
}

export default OptionalCoverageForm;