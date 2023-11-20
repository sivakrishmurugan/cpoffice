import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { OptionalCoverage, SelectedCoverage } from "../types";
import { removeLeadingZeros } from "../utill_methods";
import ExpanableList from "../expandable_list";
import { PriceInput } from "../inputs";
import { ChangeEvent } from "react";
import Image from 'next/image';

interface OptionalCoverageFromProps {
    coverage: OptionalCoverage,
    isAdded: boolean,
    onClickAddOrRemove: () => void,
    onChangeFieldValue: (event: ChangeEvent<HTMLInputElement>) => void,
    values?: SelectedCoverage,
    errors?: { field_1: boolean, field_2?: boolean }
}

const OptionalCoverageForm = ({ values, isAdded, errors, coverage, onClickAddOrRemove, onChangeFieldValue }: OptionalCoverageFromProps) => {
    const percentageResult = (percent: number, total: number) => {
        const result = ((percent/ 100) * total).toFixed(2);
        return removeLeadingZeros(result);
    };
    const total = (values?.field_1 ?? 0) + (values?.field_2 ?? 0)
    const premium = percentageResult(coverage.premiumPercentage, total);

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
                        <Image src={coverage.icon} alt={'Coverage Icon'} fill />
                    </Flex>
                    <Heading as = {'h1'} fontSize={'23px'}>{coverage.name}</Heading>
                </Flex>
                
                <Flex my = '20px' w = {'calc(100% + 40px)'} ml = '-20px' display={['flex', 'flex', 'none', 'none', 'none']} h ='1px' bg = 'brand.borderColor'></Flex>

                <Flex mt = {['0px', '0px', '60px', '60px', '60px']} w = {['100%', '100%', '100%', '90%', '80%']} gap = {'20px'} direction={['column', 'column', 'column', 'row', 'row']}>

                    <Flex w = {'100%'} direction={'column'} gap = {['20px', '20px', '30px', '30px', '30px']}>
                        <Flex display={['flex', 'flex', 'none', 'none', 'none']}>
                            <ExpanableList
                                list = {coverage.includes}
                                title = "Coverage includes" 
                            />
                        </Flex>
                        <Flex display={['none', 'none', 'flex', 'flex', 'flex']} gap = '10px' maxW = '350px' direction={'column'}>
                            <Text fontSize = '16px' fontWeight={'bold'}>Coverage includes: </Text>
                            <UnorderedList ml = '40px' fontSize={'14px'}>
                                {
                                    coverage.includes.map(includedItem => {
                                        return <ListItem key = {includedItem}>{includedItem}</ListItem>;
                                    })
                                }
                            </UnorderedList>
                        </Flex>
                    </Flex>
                    
                    <Flex w = {'100%'} direction={'column'} gap = '30px'>
                        <Flex direction={'column'} maxW={['100%', '100%', '100%', '500px', '500px']} gap = '10px'>
                            {
                                Object.entries(coverage.fields).filter(e => e != null && e[1].label != null && e[1].label != '').map(([field, fieldValues], index) => {
                                    const fieldKey = field == 'field_1' ? 'field_1' : 'field_2';
                                    const value = values?.[fieldKey] ?? 0;
                                    const error = fieldKey == 'field_1' && errors?.field_1;
                                    return <FormControl key = {field + fieldValues.label} isInvalid = {error}>
                                        <FormLabel>{fieldValues.label}</FormLabel>
                                        <PriceInput 
                                            fieldName = {field}
                                            currentPrice = {value}
                                            onChange = {onChangeFieldValue}
                                            groupProps = {{ w: ['100%', '100%', '100%', '300px', '300px'] }}
                                            forceUpdateOnPriceChange
                                        />
                                        <FormErrorMessage ml = '10px'>Required!</FormErrorMessage>
                                        {fieldValues.note != null && fieldValues.note != '' && <Text mt = '10px' fontSize={'14px'}>Note: {fieldValues.note}</Text>}
                                    </FormControl>
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
                        <Heading textAlign={'end'} as = 'h1' fontSize={'24px'}>RM {premium}</Heading>
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