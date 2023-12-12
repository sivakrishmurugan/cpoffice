import { Button, Collapse, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Icon, ListItem, OrderedList, Text, UnorderedList } from "@chakra-ui/react";
import { Coverage, SelectedCoverage } from "../../types";
import { CONSULTANT_FEE_REPLACE_TEXT, DEFAULT_FIRE_INS_PERCENTAGE, DEFAULT_FIRE_PERILS_INS_PERCENTAGE, MAX_CONSULTANT_FEE_PERCENTAGE, TOOLTIP_INFO } from "../../app/app_constants";
import ExpanableList from "../expandable_list";
import ResponsiveTooltip from "../tooltip";
import { PriceInput } from "../inputs";
import { ChangeEvent } from "react";
import { InfoIcon } from "../../icons";
import Image from 'next/image';
import { convertToPriceFormat } from "../../utlils/utill_methods";
import { percentageResult } from "../../utlils/calculation";
import FirePerilsInsTooltip from "../fire_perils_ins_tooltip";

interface CoverageFromProps {
    coverage: Coverage,
    onClickAddOrRemove: () => void,
    onChangeFieldValue: (event: ChangeEvent<HTMLInputElement>) => void,
    alwaysOpen?: boolean,
    isAdded?: boolean | null,
    values?: SelectedCoverage,
    errors?: { field_1: boolean, field_2: boolean }
}

const CoverageForm = ({ values, errors, coverage, onClickAddOrRemove, onChangeFieldValue, alwaysOpen = false, isAdded = null }: CoverageFromProps) => {
    const total = (values?.field_1 ?? 0) + (values?.field_2 ?? 0)
    const fireInsPremium = percentageResult(coverage.Fireinsurance ?? DEFAULT_FIRE_INS_PERCENTAGE, total);
    const fireAndPerilsInsPremium = percentageResult(coverage.FirePerlis ?? DEFAULT_FIRE_PERILS_INS_PERCENTAGE, total);
    const icon = '/icons/' + coverage.ImageName.replace('.jpg', '.svg');

    const isBuildingCoverage = coverage.CoverageName == 'Building';

    const coverageIncludes = coverage.Includes['Coverage includes'].map(item => {
        if(isBuildingCoverage && item.includes(CONSULTANT_FEE_REPLACE_TEXT)) {
            let replaceText = (values?.field_2 ?? 0) > 0 ? 'RM ' + convertToPriceFormat(values?.field_2 ?? 0, false, true) : '';
            const splittedText = item.replace(CONSULTANT_FEE_REPLACE_TEXT, `<replace_text><b>${replaceText}<b><replace_text>`).split('<replace_text>')
            return <Text key = {item}>{splittedText.map(e => e.startsWith('<b>') ? <Text key = {e} as = 'b' color = 'brand.primary'>{e.replaceAll('<b>', ' ')}</Text> : e)}</Text>
            //return item.replace(CONSULTANT_FEE_REPLACE_TEXT, replaceText);
        }
        return item;
    })

    const inputFields = Object.entries(coverage.CoverageFields).filter(e => e != null && e[1].label != null && e[1].label != '').map(([field, fieldValues], index) => {
        let label: null |string | JSX.Element = fieldValues.label;
        let error = null as string | null;
        const fieldKey = field == 'field_1' ? 'field_1' : 'field_2';
        const value = values?.[fieldKey] ?? 0;
        const field2MaxValue = Math.round(Number(percentageResult(MAX_CONSULTANT_FEE_PERCENTAGE, values?.field_1 ?? 0)));
        if(isBuildingCoverage && fieldKey == 'field_2' && (values?.field_1 ?? 0) > 0) {   
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
            borderRadius={'10px'}
            direction={'column'}
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
            <Flex w = '100%' gap = '20px' alignItems={'center'}>

                <Flex w = '100%' gap = {['20px', '20px', '35px', '35px', '35px']} alignItems={'center'}>
                    <Flex position={'relative'} flexShrink={0} w = {['40px', '40px', '80px', '80px', '80px']} h = {['40px', '40px', '80px', '80px', '80px']}>
                        <Image src={icon} alt={'Coverage Icon'} fill />
                    </Flex>
                    <Heading fontSize={'23px'}>{coverage.CoverageName}</Heading>
                </Flex>

                <Flex w = '20%' display={['none', 'none', 'flex', 'flex', 'flex']}>
                    <Button 
                        onClick={onClickAddOrRemove} 
                        w = {['100%', '250px', '250px', '250px', '250px']} 
                        bg={values == null || isAdded == false ? 'brand.primary' : 'brand.gray'} color = 'white' 
                        _hover = {{}} _focus={{}}
                    >
                        {values == null || isAdded == false ? 'ADD' : 'REMOVE'}
                    </Button>
                </Flex>

            </Flex>
            
            <Flex my = '20px' w = {'calc(100% + 40px)'} ml = '-20px' display={['flex', 'flex', 'none', 'none', 'none']} h ='1px' bg = 'brand.borderColor'></Flex>

            <Collapse unmountOnExit animateOpacity in = {values != null || alwaysOpen}>
                <Flex mt = {['0px', '0px', '60px', '60px', '60px']} minH = '200px' gap = {['30px', '30px', '20px', '20px', '20px']} w = '100%' direction={['column', 'column', 'column', 'row', 'row']}>
                    
                    <Flex direction={'column'} gap ='20px' display={['flex', 'flex', 'none', 'none', 'none']}>
                        <ExpanableList
                            list = {coverageIncludes}
                            title = "Coverage includes" 
                        />
                        {
                            coverage.Excludes && coverage.Excludes["Coverage excludes"].length > 0 &&
                            <ExpanableList
                                list = {coverage.Excludes["Coverage excludes"]}
                                title = "Coverage excludes" 
                            />
                        }
                    </Flex>

                    <Flex w = {['100%', '100%%', '100%%', '33.3%', '33.3%']} display={['none', 'none', 'flex', 'flex', 'flex']} direction={'column'} gap = '30px'>
                        <Flex gap = '10px' maxW = '350px' direction={'column'}>
                            <Text fontSize = '16px' fontWeight={'bold'}>Coverage includes: </Text>
                            <UnorderedList ml = '40px' fontSize={'14px'}>
                                {
                                    coverageIncludes.map((includedItem, index) => {
                                        return <ListItem key = {index}>{includedItem}</ListItem>;
                                    })
                                }
                            </UnorderedList>
                        </Flex>
                        {
                            coverage.Excludes && coverage.Excludes["Coverage excludes"].length > 0 &&
                            <Flex gap = '10px' maxW = '350px' direction={'column'}>
                                <Text fontSize = '16px' fontWeight={'bold'}>Coverage excludes: </Text>
                                <UnorderedList ml = '40px' fontSize={'14px'}>
                                    {
                                        coverage.Excludes["Coverage excludes"].map(excludedItem => {
                                            return <ListItem key = {excludedItem}>{excludedItem}</ListItem>;
                                        })
                                    }
                                </UnorderedList>
                            </Flex>
                        }
                    </Flex>

                    <Flex w = {['100%', '100%', '100%%', '66.6%', '66.6%']} direction={'column'} gap = '30px'>
                        <Flex direction={'column'} maxW={['100%', '100%', '100%', '600px', '600px']} px = '1px' gap = '10px'>
                            {
                                inputFields.map((field, index) => {
                                    return <ResponsiveTooltip key = {field.name} isDisabled = {field.isDisabled == false} placement="bottom-start" label = {'Sum Insured required!'}>
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
                        <Flex direction={['column', 'column', 'row', 'row', 'row']} gap = '20px'>
                            <Flex direction={'column'} minW = {['100%', '100%', '280px', '280px', '280px']} minH = '137px' padding = '20px 20px 10px' borderRadius={'8px'} border = '1px solid #f2f2f2' justifyContent={'space-between'}>
                                <Heading as = 'h1' fontSize={'16px'}>FIRE INSURANCE</Heading>
                                <Flex gap = '10px' justifyContent={'space-between'} alignItems={'center'}>
                                    <Heading as = 'h1' fontSize={'16px'}>PREMIUM</Heading>
                                    <Heading as = 'h1' fontSize={'24px'}>RM {convertToPriceFormat(fireInsPremium, true)}</Heading>
                                </Flex>
                            </Flex>
                            <Flex direction={'column'} minW = {['100%', '100%', '280px', '280px', '280px']} minH = '137px' padding = '20px 20px 10px' borderRadius={'8px'} border = '1px solid #f2f2f2' justifyContent={'space-between'}>
                                <Flex direction={'column'} gap = '5px'>
                                    <Flex>
                                        <Heading as = 'h1' fontSize={'16px'}>
                                            FIRE & PERILS INSURANCE
                                            <FirePerilsInsTooltip>
                                                <Icon w = 'auto' h = 'auto' as = {InfoIcon} />
                                            </FirePerilsInsTooltip>
                                        </Heading>
                                    </Flex>
                                    <Text w = 'fit-content' fontSize={'12px'} color={'white'} bg = 'brand.yellow' p = '5px 20px' borderRadius={'49px'}>Recommended</Text>
                                </Flex>
                                <Flex gap = '10px' justifyContent={'space-between'} alignItems={'center'}>
                                    <Heading as = 'h1' fontSize={'16px'}>PREMIUM</Heading>
                                    <Heading as = 'h1' fontSize={'24px'}>RM {convertToPriceFormat(fireAndPerilsInsPremium, true)}</Heading>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Collapse>

            <Flex mt = {values != null ? '30px' : '0px'} display={['flex', 'flex', 'none', 'none', 'none']} justifyContent={'flex-end'}>
                <Button 
                    onClick={onClickAddOrRemove} 
                    w = {['100%', '100%', '250px', '250px', '250px']} 
                    bg={values == null || isAdded == false ? 'brand.primary' : 'brand.gray'} color = 'white' 
                    _hover = {{}} _focus={{}}
                >
                    {values == null || isAdded == false ? 'ADD' : 'REMOVE'}
                </Button>
            </Flex>
        </Flex>
    );
}

export default CoverageForm;