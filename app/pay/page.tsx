"use client"
import { Button, Flex, Text, FormControl, FormErrorMessage, Heading, Icon, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { DEFAULT_FIRE_INS_PERCENTAGE, DEFAULT_FIRE_PERILS_INS_PERCENTAGE, EXCESS, PROTECTION_AND_LIABILITY_COVERAGE, STAMP_DUTY, TAX_PERCENTAGE, TOOLTIP_INFO } from "@/components/app/app_constants";
import { useClient, useLocalStorage, useSessionStorage } from "@/components/hooks";
import { InfoIcon, PromoCodeIcon } from "@/components/icons";
import { ChangeEvent, useEffect, useState } from "react";
import ResponsiveTooltip from "@/components/tooltip";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import React from "react";
import useCoverage from "@/components/hooks/use_coverage";
import { ClinicData, Coverage, InsuranceType, SelectedCoverage } from "@/components/types";
import { convertToPriceFormat, formatDateToYyyyMmDd, getDateAfter365Days } from "@/components/utill_methods";
import axiosClient from "@/components/axios";
import Image from 'next/image';
import { calculatePremiumForCoverage, calculatePremiumForOptionalCoverage, calculateSummary } from "@/components/calculation";

const Summary: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData, updateDataWithNewQuoteId } = useCoverage(localData?.quoteId);
    const [payLoading, setPayLoading] = useState(false);
    const appliedPromoDiscountPercentage = localData?.promoCodePercentage ?? 0;
    const isClient = useClient();
    const router = useRouter();

    useEffect(() => {
        if(localData == null || localData.quoteId == null || localData.quoteId == '') router.replace('/');
        if(localData?.selectedInsType == null) router.replace('/insurance_type')
    }, [localData, router])

    const coverageValue = (coverage: SelectedCoverage) => {
        return (coverage?.field_1 ?? 0) + (coverage?.field_2 ?? 0)
    }

    const { totalPremium, discount, netPremium, tax, finalPremium } = calculateSummary(
        localData?.selectedCoverages ?? [], 
        localData?.selectedOptionalCoverages ?? [], 
        localData?.selectedInsType ?? 'FIRE', 
        appliedPromoDiscountPercentage, 
        coveragesData ?? { coverages: [], optionalCoverages: [] }
    );

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
                                            <Td minW = '150px' py = '10px'  px = {'0px'} whiteSpace={'pre-wrap'}>{localData?.basic?.name}</Td>
                                        </Tr>
                                        <Tr fontSize={'16px'} fontWeight={'bold'}>
                                            <Td py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>Coverage Period</Td>
                                            <Td minW = '150px' py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>12 Months</Td>
                                        </Tr>
                                        <Tr fontSize={'16px'} fontWeight={'bold'}>
                                            <Td py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>Location</Td>
                                            <Td minW = '150px' py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>{localData?.basic?.address}</Td>
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
                                                const coverageData = coveragesData?.coverages?.find(e => e.CoverageID == coverage.id);
                                                return <Tr key = {coverage.id}>
                                                    <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>{coverageData?.CoverageName}</Td>
                                                    <Td px = '5px'></Td>
                                                    <Td w = '37%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM {convertToPriceFormat(coverageValue(coverage))}</Td>
                                                    <Td fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.primary' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM {convertToPriceFormat(calculatePremiumForCoverage(coverage, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', coverageData))}</Td>
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
                                                const coverageData = coveragesData?.coverages?.find(e => e.CoverageID == coverage.id);
                                                const bgColor = index % 2 != 0 ? 'white' : 'tableStripedColor.100';
                                                return <React.Fragment key={coverage.id}>
                                                    <Tr>
                                                        <Th px = '10px' pb = '5px' pt = {index % 2 != 0 ? '20px' : undefined} colSpan={2} fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bgColor} lineHeight={1.3} textTransform={'none'}>{coverageData?.CoverageName}</Th>
                                                    </Tr>
                                                    <Tr>
                                                        <Th px = '10px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>COVERAGE VALUE</Th>
                                                        <Td px = '10px' fontWeight={'bold'} bg = {bgColor}>RM {convertToPriceFormat(coverageValue(coverage))}</Td>
                                                    </Tr>
                                                    <Tr>
                                                        <Th px = '10px' pt = '5px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>PREMIUM</Th>
                                                        <Td px = '10px' pt = '5px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>RM {convertToPriceFormat(calculatePremiumForCoverage(coverage, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', coverageData))}</Td>
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
                                                    <Th w = '37%' fontSize={'15px'} color = 'brand.primary'></Th>
                                                    <Th fontSize={'15px'} color = 'brand.primary'></Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '10px', textIndent: '-99999px' }}>
                                                {
                                                    localData?.selectedOptionalCoverages.map((coverage, index) => {
                                                        let coverageData = coveragesData?.optionalCoverages?.find(e => e.CoverageID == coverage.id);
                                                        const isProtectionAndLiabilityCoverage = coverage.id == PROTECTION_AND_LIABILITY_COVERAGE.id;
                                                        if(isProtectionAndLiabilityCoverage) {
                                                            coverage = { id: coverage.id, field_1: PROTECTION_AND_LIABILITY_COVERAGE.coverageValue }
                                                            coverageData = {
                                                                CoverageName: PROTECTION_AND_LIABILITY_COVERAGE.name,
                                                                isABR: 0,
                                                                InsPercent: 0.0405,
                                                            } as any
                                                        }
                                                        return <Tr key = {coverage.id}>
                                                            <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>{coverageData?.CoverageName}</Td>
                                                            <Td px = '5px'></Td>
                                                            <Td w = '37%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM {convertToPriceFormat(coverageValue(coverage))}</Td>
                                                            <Td fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.primary' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM {convertToPriceFormat(calculatePremiumForOptionalCoverage(coverage, coverageData!, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', localData?.selectedCoverages ?? [], coveragesData?.coverages ?? []))}</Td>
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
                                                        let coverageData = coveragesData?.optionalCoverages?.find(e => e.CoverageID == coverage.id);
                                                        const isProtectionAndLiabilityCoverage = coverage.id == PROTECTION_AND_LIABILITY_COVERAGE.id;
                                                        if(isProtectionAndLiabilityCoverage) {
                                                            coverage = { id: coverage.id, field_1: PROTECTION_AND_LIABILITY_COVERAGE.coverageValue }
                                                            coverageData = {
                                                                CoverageName: PROTECTION_AND_LIABILITY_COVERAGE.name,
                                                                isABR: 0,
                                                                InsPercent: 0.0405,
                                                            } as any
                                                        }
                                                        return <React.Fragment key = {coverage.id}>
                                                            <Tr>
                                                                <Th px = '10px' pb = '5px' pt = {index % 2 != 0 ? '20px' : undefined} colSpan={2} fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bgColor} lineHeight={1.3} textTransform={'none'}>{coverageData?.CoverageName}</Th>
                                                            </Tr>
                                                            <Tr>
                                                                <Th px = '10px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>COVERAGE VALUE</Th>
                                                                <Td px = '10px' fontWeight={'bold'} bg = {bgColor}>RM {convertToPriceFormat(coverageValue(coverage))}</Td>
                                                            </Tr>
                                                            <Tr>
                                                                <Th px = '10px' pt = '5px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>PREMIUM</Th>
                                                                <Td px = '10px' pt = '5px' color = 'brand.primary' fontWeight={'bold'} bg = {bgColor}>RM {convertToPriceFormat(calculatePremiumForOptionalCoverage(coverage, coverageData!, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', localData?.selectedCoverages ?? [], coveragesData?.coverages ?? []))}</Td>
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
                                                                <Th px = '10px' pb = '5px' pt = {index % 2 != 0 ? '20px' : undefined} colSpan={2} fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bgColor} lineHeight={1.3} textTransform={'none'}>{excess?.title}</Th>
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
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(totalPremium)}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Discount</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(discount, true)}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Nett Premium</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(netPremium)}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Tax 6%</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(tax)}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Stamp Duty</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(STAMP_DUTY)}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Final Premium</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(finalPremium)}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                        
                        <Flex mt = '20px' w = '100%' flexWrap={'wrap'} gap ='15px'>
                            <Button onClick = {e => {}} w = '100%' bg = 'brand.secondary' color = 'white' _hover = {{}} _focus={{}}>PROCEED TO PAY</Button>
                        </Flex>

                    </Flex>
                    
                </Flex>
            }
        </Flex>
    );
}

export default Summary;

