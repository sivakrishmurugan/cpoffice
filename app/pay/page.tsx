"use client"
import { Button, Flex, Text, FormControl, FormErrorMessage, Heading, Icon, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalOverlay, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { DEFAULT_FIRE_INS_PERCENTAGE, DEFAULT_FIRE_PERILS_INS_PERCENTAGE, EXCESS, PROTECTION_AND_LIABILITY_COVERAGE, STAMP_DUTY, TAX_PERCENTAGE, TOOLTIP_INFO } from "@/lib/app/app_constants";
import { useClient, useLocalStorage, useSessionStorage } from "@/lib/hooks";
import { InfoIcon, PromoCodeIcon } from "@/lib/icons";
import { ChangeEvent, useEffect, useState } from "react";
import ResponsiveTooltip from "@/lib/components/tooltip";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import React from "react";
import useCoverage from "@/lib/hooks/use_coverage";
import { ClinicData, Coverage, InsuranceType, SelectedCoverage } from "@/lib/types";
import { convertToPriceFormat, formatDateToYyyyMmDd, getDateAfter365Days } from "@/lib/utlils/utill_methods";
import axiosClient from "@/lib/utlils/axios";
import Image from 'next/image';
import { calculatePremiumForCoverage, calculatePremiumForOptionalCoverage, calculateSummary, getTotalPremiumsForFireAndPerilsInsurance } from "@/lib/utlils/calculation";
import SummaryTables from "@/lib/components/summary_tables";

const Summary: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData, updateDataWithNewQuoteId } = useCoverage(localData?.quoteId);
    const [payLoading, setPayLoading] = useState(false);
    const appliedPromoDiscountPercentage = localData?.promoCodePercentage ?? 0;
    const isClient = useClient();
    const router = useRouter();

    useEffect(() => {
        if(
            localData == null || 
            localData.quoteId == null || localData.quoteId == '' || 
            localData?.paymentApproved == false ||
            localData?.isPaid
        ) {
            router.replace('/');
        } 
    }, [localData, router])
    
    const { totalPremium, discount, netPremium, tax, finalPremium } = calculateSummary(
        localData?.selectedCoverages ?? [], 
        localData?.selectedOptionalCoverages ?? [], 
        localData?.selectedInsType ?? 'FIRE', 
        appliedPromoDiscountPercentage, 
        coveragesData ?? { coverages: [], optionalCoverages: [] }
    );

    const onClickPay = async () => {
        if(localData == null) return ;
        setPayLoading(true);
        try {
            const { finalPremium } = calculateSummary(
                localData?.selectedCoverages ?? [],
                localData?.selectedOptionalCoverages ?? [], 
                localData?.selectedInsType ?? 'FIRE', 
                localData?.promoCodePercentage ?? 0, 
                coveragesData ?? { coverages: [], optionalCoverages: [] }
            )
            const res = await axiosClient.post('/api/clinicshield/dopayment', {
                QuoteID: localData?.quoteId,
                Payment: finalPremium.toString()
            })
            if(res.data && res.data.Success == 1 && res.data.Data.respCode && res.data.Data.respCode == '0000') {
                router.push(res.data.Data.webPaymentUrl);
            }
        } catch(e: any) {
            console.log('do payment api failed: ', e)
            if(e?.response?.status == 401) {
                await updateDataWithNewQuoteId(localData?.quoteId);
                onClickPay()
            }
        }
        setPayLoading(false)
    }

    const onClickEditDetails = () => router.push('/coverage');

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
                            <Heading as = {'h1'} fontSize={'23px'}>Proposal approved</Heading>
                            {/* <Button onClick={onClickEditDetails} size = 'sm' variant={'outline'} borderColor = 'brand.borderColor' h = '40px'>EDIT PROPOSAL</Button> */}
                        </Flex>
                        
                        {/* Divider */}
                        <Flex
                            my = '20px' 
                            w = {[...Array(5).keys()].map((e, index) => index < 3 ? 'calc(100% + 40px)' : '100%')} 
                            ml = {[...Array(5).keys()].map((e, index) => index < 3 ? '-20px' : '0px')}
                            h ='1px' bg = 'brand.borderColor'
                        ></Flex>
        
                        {/* Basic clinic info and Coverages */}
                        <SummaryTables coveragesData={coveragesData} localData={localData} />

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
                                    {/* <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Discount</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(discount, true)}</Td>
                                    </Tr> */}
                                    {/* <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Nett Premium</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(netPremium)}</Td>
                                    </Tr> */}
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

                        <Flex direction={'column'} gap = '10px'>
                            <Text fontWeight={'bold'} fontSize={'16px'}>Insurance Start Date</Text>
                            <Text color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'}>{localData?.insStartDate}</Text>
                        </Flex>

                        <Flex direction={'column'} gap = '10px'>
                            <Text fontWeight={'bold'} fontSize={'16px'}>Insurance End Date</Text>
                            <Text color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'}>{getDateAfter365Days(localData?.insStartDate ?? '')}</Text>
                        </Flex>
                        
                        <Flex mt = '20px' w = '100%' flexWrap={'wrap'} gap ='15px'>
                            <Button onClick = {onClickPay} isLoading = {payLoading} w = '100%' bg = 'brand.secondary' color = 'white' _hover = {{}} _focus={{}}>PROCEED TO PAY</Button>
                        </Flex>

                    </Flex>
                    
                </Flex>
            }
        </Flex>
    );
}

export default Summary;

