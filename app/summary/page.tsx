"use client"
import { Button, Flex, FormControl, FormErrorMessage, Heading, Icon, Input, InputGroup, InputRightElement, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { EXCESS, PROTECTION_AND_LIABILITY_COVERAGE, TOOLTIP_INFO } from "@/components/app/app_constants";
import { useClient, useLocalStorage, useSessionStorage } from "@/components/hooks";
import { InfoIcon, PromoCodeIcon } from "@/components/icons";
import { ChangeEvent, useEffect, useState } from "react";
import ResponsiveTooltip from "@/components/tooltip";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import React from "react";


const Summary: NextPage<{}> = ({}) => {
    const [coverageSessionData, setCoverageSessionData] = useSessionStorage('coverages', null);
    const [localData, setLocalData] = useLocalStorage('clinic_form_data', null);
    const [data, setData] = useState({ 
        promoCode: { value: localData?.promoCode ?? '', isApplied: localData?.promoCode && localData.promoCode != '', error: false }, 
        insStartDate: { value: localData?.insStartDate ?? '', error: false } 
    });
    const isClient = useClient();
    const router = useRouter();

    useEffect(() => {
        if(coverageSessionData == null) router.replace('/');
        if(localData?.selectedInsType == null) router.replace('/insurance_type')
    }, [coverageSessionData, localData, router])

    const onChangePromoCode = (event: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, promoCode: { value: event.target.value, isApplied: false, error: false } }))
    }

    const onChangeInsStartDate = (event: ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value;
        setData(prev => ({ ...prev, insStartDate: { value: date, error: date == '' } }))
    }

    const onApplyOrRemovePromoCode = () => {
        setData(prev => ({ 
            ...prev, 
            promoCode: {
                isApplied: prev.promoCode.isApplied ? false : prev.promoCode.value != '', 
                error: prev.promoCode.isApplied ? false : prev.promoCode.value == '',
                value: prev.promoCode.isApplied ? '' : prev.promoCode.value 
            } 
        }))
    }

    const validate = () => {
        const tempData: typeof data = JSON.parse(JSON.stringify(data));
        tempData.insStartDate.error = tempData.insStartDate.value == '';
        setData(tempData);
        return tempData.insStartDate.error == true;
    }

    const onClickProcceedToPurchase = () => {
        if(validate()) return ;
        if(localData) {
            setLocalData({ 
                ...localData, 
                promoCode: data.promoCode.isApplied ? data.promoCode.value : '',
                insStartDate: data.insStartDate.value
            })
        }
        router.push('/claim_declaration');
    }

    const onClickBack = () => {
        router.push('/protection_liability_coverage');
    }

    return (
        <Flex w = '100%' direction={'column'} gap = '10px'  py = '20px'>
            {
                isClient && <Flex 
                    w = '100%' 
                    minH = '150px' 
                    bg = {'white'}
                    gap = {['30px', '30px', '30px', '20px', '30px']}
                    borderRadius={'10px'}
                    direction={['column', 'column', 'column', 'row', 'row']}
                    p = {[
                        '20px 20px',
                        '20px 20px',
                        '20px 20px',
                        '40px 30px 40px 40px',
                        '40px 30px 40px 40px',
                    ]}
                    boxShadow={'0 2px 8px rgba(0, 0, 0, .2)'}
                    color = 'brand.text'
                >
                    {/* Section 1 - Clinic info and selected coverages */}
                    <Flex w = {['100%', '100%', '100%', '70%', '70%']} direction={'column'}>
        
                        {/* Summary heading and edit details button */}
                        <Flex w = '100%' gap = '35px' alignItems={'center'} justifyContent={'space-between'}>
                            <Heading as = {'h1'} fontSize={'23px'}>Summary</Heading>
                            <Button size = 'sm' variant={'outline'} borderColor = 'brand.borderColor' h = '40px'>EDIT DETAILS</Button>
                        </Flex>
                        
                        {/* Divider */}
                        <Flex
                            my = '20px' 
                            w = {[...Array(5).keys()].map((e, index) => index < 3 ? 'calc(100% + 40px)' : '100%')} 
                            ml = {[...Array(5).keys()].map((e, index) => index < 3 ? '-20px' : '0px')}
                            h ='1px' bg = 'brand.borderColor'
                        ></Flex>
        
                        {/* Basic clinic info and Coverages */}
                        <Flex gap = {'20px'} direction={'column'} >

                            {/* Basic clinic info */}
                            <TableContainer py = {['0px', '0px', '0px', '10px', '10px']} px = {['0px', '0px', '0px', '20px', '20px']} borderWidth={['0px', '0px', '0px', '1px', '1px']} borderColor={'brand.borderColor'} maxW = '100%'>
                                <Table variant={'unstyled'}>
                                    <Tbody>
                                        <Tr fontSize={'16px'} fontWeight={'bold'}>
                                            <Td py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>Clinic Name</Td>
                                            <Td py = '10px'  px = {'0px'} whiteSpace={'pre-wrap'}>DYM International Clinic</Td>
                                        </Tr>
                                        <Tr fontSize={'16px'} fontWeight={'bold'}>
                                            <Td py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>Coverage Period</Td>
                                            <Td py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>12 Months</Td>
                                        </Tr>
                                        <Tr fontSize={'16px'} fontWeight={'bold'}>
                                            <Td py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>Location</Td>
                                            <Td py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>KL</Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>

                            {/* Divider */}
                            <Flex 
                                w = {[...Array(5).keys()].map((e, index) => index < 3 ? 'calc(100% + 40px)' : '100%')} 
                                ml = {[...Array(5).keys()].map((e, index) => index < 3 ? '-20px' : '0px')}
                                display={['flex', 'flex', 'flex', 'none', 'none']} 
                                h ='1px' bg = 'brand.borderColor'
                            ></Flex>

                            {/* Desktop view insurance coverage table */}
                            <TableContainer display={['none', 'none', 'none', 'block', 'block']}>
                                <Table variant={'unstyled'}>
                                    <Thead>
                                        <Tr >
                                            <Th fontSize={'20px'} color = 'brand.primary' px = '0px'>{localData?.selectedInsType == 'FIRE' ? 'FIRE INSURANCE' : 'FIRE & PERILS INSURANCE'}</Th>
                                            <Th px = '5px'></Th>
                                            <Th fontSize={'15px'} color = 'brand.primary'>COVERAGE VALUE</Th>
                                            <Th fontSize={'15px'} color = 'brand.primary'>PREMIUM</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '10px', textIndent: '-99999px' }}>
                                        {
                                            localData?.selectedCoverages.map((coverage, index) => {
                                                const coverageData = coverageSessionData?.coverages?.find(e => e.id == coverage.id);
                                                return <Tr key = {coverage.id}>
                                                    <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>{coverageData?.name}</Td>
                                                    <Td px = '5px'></Td>
                                                    <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM 10000</Td>
                                                    <Td fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.primary' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM 675</Td>
                                                </Tr>
                                            })
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>

                            {/* Mobile view insurance coverage table */}
                            <TableContainer display={['block', 'block', 'block', 'none', 'none']}>
                                <Table variant={'unstyled'}>
                                    <Thead>
                                        <Tr>
                                            <Th colSpan={2} fontSize={'20px'} color = 'brand.primary' px = '0px'>{localData?.selectedInsType == 'FIRE' ? 'FIRE INSURANCE' : 'FIRE & PERILS INSURANCE'}</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '10px', textIndent: '-99999px' }}>
                                        {
                                            localData?.selectedCoverages.map((coverage, index) => {
                                                const coverageData = coverageSessionData?.coverages?.find(e => e.id == coverage.id);
                                                const bgColor = index % 2 != 0 ? 'white' : 'tableStripedColor.100';
                                                return <React.Fragment key={coverage.id}>
                                                    <Tr>
                                                        <Th px = '10px' pb = '5px' pt = {index % 2 != 0 ? '20px' : undefined} colSpan={2} fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bgColor} textTransform={'none'}>{coverageData?.name}</Th>
                                                    </Tr>
                                                    <Tr>
                                                        <Th px = '10px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>COVERAGE VALUE</Th>
                                                        <Td px = '10px' fontWeight={'bold'} bg = {bgColor}>RM 1,000,000</Td>
                                                    </Tr>
                                                    <Tr>
                                                        <Th px = '10px' pt = '5px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>PREMIUM</Th>
                                                        <Td px = '10px' pt = '5px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>RM 675</Td>
                                                    </Tr>
                                                </React.Fragment>
                                            })
                                        }
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            
                            {
                                localData?.selectedOptionalCoverages && localData?.selectedOptionalCoverages?.length > 0 &&
                                <>
                                    {/* Desktop view optional cover table */}
                                    <TableContainer display={['none', 'none', 'none', 'block', 'block']}>
                                        <Table variant={'unstyled'}>
                                            <Thead>
                                                <Tr >
                                                    <Th w = '40%' fontSize={'20px'} color = 'brand.primary' px = '0px'>OPTIONAL COVER</Th>
                                                    <Th px = '5px'></Th>
                                                    <Th w = '40%' fontSize={'15px'} color = 'brand.primary'></Th>
                                                    <Th fontSize={'15px'} color = 'brand.primary'></Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '10px', textIndent: '-99999px' }}>
                                                {
                                                    localData?.selectedOptionalCoverages.map((coverage, index) => {
                                                        let coverageData = coverageSessionData?.optionalCoverages?.find(e => e.id == coverage.id);
                                                        const isProtectionAndLiabilityCoverage = coverage.id == PROTECTION_AND_LIABILITY_COVERAGE.id;
                                                        if(isProtectionAndLiabilityCoverage) {
                                                            coverageData = {
                                                                name: PROTECTION_AND_LIABILITY_COVERAGE.name
                                                            } as any
                                                        }
                                                        return <Tr key = {coverage.id}>
                                                            <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>{coverageData?.name}</Td>
                                                            <Td px = '5px'></Td>
                                                            <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM 10000</Td>
                                                            <Td fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.primary' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM 675</Td>
                                                        </Tr>
                                                    })
                                                }
                                            </Tbody>
                                        </Table>
                                    </TableContainer>

                                    {/* Mobile view optional cover table */}
                                    <TableContainer display={['block', 'block', 'block', 'none', 'none']}>
                                        <Table variant={'unstyled'}>
                                            <Thead>
                                                <Tr>
                                                    <Th colSpan={2} fontSize={'20px'} color = 'brand.primary' px = '0px'>OPTIONAL COVER</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '10px', textIndent: '-99999px' }}>
                                                {
                                                    localData?.selectedOptionalCoverages.map((coverage, index) => {
                                                        const bgColor = index % 2 != 0 ? 'white' : 'tableStripedColor.100';
                                                        let coverageData = coverageSessionData?.optionalCoverages?.find(e => e.id == coverage.id);
                                                        const isProtectionAndLiabilityCoverage = coverage.id == PROTECTION_AND_LIABILITY_COVERAGE.id;
                                                        if(isProtectionAndLiabilityCoverage) {
                                                            coverageData = {
                                                                name: PROTECTION_AND_LIABILITY_COVERAGE.name
                                                            } as any
                                                        }
                                                        return <React.Fragment key = {coverage.id}>
                                                            <Tr>
                                                                <Th px = '10px' pb = '5px' pt = {index % 2 != 0 ? '20px' : undefined} colSpan={2} fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bgColor} textTransform={'none'}>{coverageData?.name}</Th>
                                                            </Tr>
                                                            <Tr>
                                                                <Th px = '10px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>COVERAGE VALUE</Th>
                                                                <Td px = '10px' fontWeight={'bold'} bg = {bgColor}>RM 1,000,000</Td>
                                                            </Tr>
                                                            <Tr>
                                                                <Th px = '10px' pt = '5px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>PREMIUM</Th>
                                                                <Td px = '10px' pt = '5px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>RM 675</Td>
                                                            </Tr>
                                                        </React.Fragment>
                                                    })
                                                }
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </>
                            }
                            
                            {
                                localData?.selectedInsType == 'FIRE_PERILS' && 
                                <>
                                    {/* Desktop view excess table */}
                                    <TableContainer display={['none', 'none', 'none', 'block', 'block']}>
                                        <Table variant={'unstyled'}>
                                            <Thead>
                                                <Tr >
                                                    <Th colSpan={2}  px = '0px'>
                                                        <Heading fontSize={'20px'} color = 'brand.primary'>
                                                            EXCESS
                                                            <ResponsiveTooltip 
                                                                wrapperDivProps = {{ verticalAlign: 'middle', ml: '10px' }}
                                                                label = {TOOLTIP_INFO.excess.content}
                                                                toolTipWidth={'350px'}
                                                            >
                                                                <Icon w = 'auto' h = 'auto' as = {InfoIcon} />
                                                            </ResponsiveTooltip>
                                                        </Heading>
                                                    </Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '10px', textIndent: '-99999px' }}>
                                                {
                                                    EXCESS.map((excess, index) => {
                                                        return <Tr key = {excess.title}>
                                                             <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>{excess.title}</Td>
                                                             <Td px = '7px'></Td>
                                                             <Td fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>{excess.value}</Td>
                                                        </Tr>
                                                    })
                                                }
                                            </Tbody>
                                        </Table>
                                    </TableContainer>

                                    {/* Mobile view excess table */}
                                    <TableContainer display={['block', 'block', 'block', 'none', 'none']}>
                                        <Table variant={'unstyled'}>
                                            <Thead>
                                                <Tr>
                                                    <Th colSpan={2} fontSize={'20px'} color = 'brand.primary' px = '0px'>
                                                        <Heading fontSize={'20px'} color = 'brand.primary'>
                                                            EXCESS
                                                            <ResponsiveTooltip 
                                                                wrapperDivProps = {{ verticalAlign: 'middle', ml: '10px' }}
                                                                label = {TOOLTIP_INFO.excess.content}
                                                                toolTipWidth={'350px'}
                                                            >
                                                                <Icon w = 'auto' h = 'auto' as = {InfoIcon} />
                                                            </ResponsiveTooltip>
                                                        </Heading>
                                                    </Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '10px', textIndent: '-99999px' }}>
                                                {
                                                    EXCESS.map((excess, index) => {
                                                        const bgColor = index % 2 != 0 ? 'white' : 'tableStripedColor.100';
                                                        return <React.Fragment key = {excess.title}>
                                                            <Tr>
                                                                <Th px = '10px' pb = '5px' pt = {index % 2 != 0 ? '20px' : undefined} colSpan={2} fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bgColor} textTransform={'none'}>{excess?.title}</Th>
                                                            </Tr>
                                                            <Tr>
                                                                <Td px = '10px' bg = {bgColor} fontSize={'15px'} whiteSpace={'pre-wrap'}>{excess.value}</Td>
                                                            </Tr>
                                                        </React.Fragment>
                                                    })
                                                }
                                            </Tbody>
                                        </Table>
                                    </TableContainer>
                                </>
                            }

                        </Flex>

                    </Flex>

                    {/* Desktop view vertical divider */}
                    <Flex 
                        h = {[...Array(5).keys()].map((e, index) => index > 2 ? 'calc(100% + 80px)' : '100%')}
                        mt = {[...Array(5).keys()].map((e, index) => index > 2 ? '-40px' : '0px')}
                        display = {[...Array(5).keys()].map((e, index) => index > 2 ? 'flex' : 'none')}
                        w = '1px' 
                        bg = 'brand.borderColor'
                    ></Flex>
        
                    {/* Section 2 - Calculations (total, nett, discount, etc), Promocode, Ins start date and action buttons */}
                    <Flex flexShrink={0} w = {['100%', '100%', '100%', '30%', '30%']} gap = '20px' direction={'column'}>

                        <TableContainer>
                            <Table variant={'unstyled'}>
                                <Tbody>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Total Premium</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM 6,240.00</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Discount</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RAM 0</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Nett Premium</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM 6,240.00</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Tax 6%</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM 195.00</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Stamp Duty</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM 10.00</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Final Premium</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM 6,445.00</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>

                        <Flex w = '100%' gap = '10px' direction={'column'}>
                            <Heading as = 'h1' color = 'brand.text' fontSize={'23px'}>Promo code</Heading>
                            <FormControl isInvalid = {data.promoCode.error}>
                                <InputGroup>
                                    <Input value = {data.promoCode.value} onChange = {onChangePromoCode} placeholder = "Ex. DS1234" />
                                    <InputRightElement h = '100%'>
                                        <Icon as = {PromoCodeIcon} h = 'auto' w = 'auto' />
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage ml = '10px'>Please enter promocode</FormErrorMessage>
                            </FormControl>
                            <Button 
                                onClick={onApplyOrRemovePromoCode} 
                                width={'fit-content'} h = '40px'
                                bg = {data.promoCode.isApplied ? 'brand.gray' : 'brand.darkViolet'}
                                color = 'white' _hover = {{}} _focus={{}}
                            >
                                {data.promoCode.isApplied ? 'REMOVE' : 'APPLY'}
                            </Button>
                        </Flex>

                        <Flex w = '100%' gap = '10px' direction={'column'}>
                            <Heading as = 'h1' color = 'brand.text' fontSize={'23px'}>Insurance Start Date</Heading>
                            <FormControl isInvalid = {data.insStartDate.error}>
                                <InputGroup>
                                    <Input value = {data.insStartDate.value} onChange = {onChangeInsStartDate} type = 'date' placeholder = "Choose" />
                                    {/* <InputRightElement h = '100%'>
                                        <Icon as = {CalendarIcon} h = 'auto' w = 'auto' />
                                    </InputRightElement> */}
                                </InputGroup>
                                <FormErrorMessage ml = '10px'>Insurance start date is required!</FormErrorMessage>
                            </FormControl>
                        </Flex>
                        
                        <Flex mt = '20px' w = '100%' flexWrap={'wrap'} gap ='15px'>
                            <Button onClick = {onClickProcceedToPurchase} w = '100%' bg = 'brand.secondary' color = 'white' _hover = {{}} _focus={{}}>PROCEED TO PURCHASE</Button>
                            <Button onClick = {onClickBack} flex = {1} bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>BACK</Button>
                            <Button flex = {1} bg = 'brand.darkViolet' color = 'white' _hover = {{}} _focus={{}} whiteSpace={'pre-wrap'}>EMAIL ME A QUOTE</Button>
                        </Flex>

                    </Flex>
                    
                </Flex>
            }
        </Flex>
    );
}

export default Summary;