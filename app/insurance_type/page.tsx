"use client"
import { Alert, AlertIcon, Button, Flex, Heading, Icon, ListItem, OrderedList, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useClient, useSessionStorage } from "@/lib/hooks";
import { ClinicData, InsuranceType } from "@/lib/types";
import { useEffect, useState } from "react";
import { CheckIcon, InfoIcon } from "@/lib/icons";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import useCoverage from "@/lib/hooks/use_coverage";
import axiosClient from "@/lib/utlils/axios";
import { convertToPriceFormat } from "@/lib/utlils/utill_methods";
import { calculatePremiumForCoverage, getTotalPremiumsForFireAndPerilsInsurance } from "@/lib/utlils/calculation";
import FirePerilsInsTooltip from "@/lib/components/fire_perils_ins_tooltip";

const Coverages: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData, updateDataWithNewQuoteId } = useCoverage(localData?.quoteId);
    const [insType, setInsType] = useState<InsuranceType>(localData?.selectedInsType ?? null);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(false);
    const isClient = useClient();
    const router = useRouter();

    useEffect(() => {
        if(localData?.quoteId == null || localData?.quoteId == '') { 
            router.replace('/'); 
        } else if((localData?.selectedCoverages.length ?? 0) < 1) {
            router.replace('/coverage');
        }
    }, [localData, router])

    const onSelectInsType = (type: InsuranceType) => {
        setError(type == null);
        setInsType(type);
    }

    const validate = () => {
        setError(insType == null);
        return insType == null;
    }

    const onClickNext = async () => {
        if(localData == null || validate()) return ;
        setSubmitLoading(true);
        try {
            const toBeUpdatedCoverages = localData!.selectedCoverages.map(e => {
                const coverage = (coveragesData?.coverages ?? []).find(c => c.CoverageID == e.id);
                const coverageName = coverage?.CoverageName ?? '';
                const premium = calculatePremiumForCoverage(e, insType!, coverage)
                return {
                    ...e,
                    name: coverageName,
                    total: (e?.field_1 ?? 0) + (e?.field_2 ?? 0),
                    premium: isNaN(Number(premium)) ? 0 : Number(premium)
                }
            });
            const res = await axiosClient.post('/api/clinicshield/setcoverage', {
                QuoteID: localData.quoteId,
                InsuranceType: insType,
                Coverage: JSON.stringify(toBeUpdatedCoverages)
            });
            if(res && res.data && res.data[0]) {
                if(res.data?.[0]?.Success == 1) {
                    setLocalData({ ...localData, selectedInsType: insType });
                    router.push('/optional_coverage');
                }
            } 
        } catch(e: any) {
            console.log('setcover failed', e);
            if(e?.response?.status == 401) {
                await updateDataWithNewQuoteId(localData?.quoteId);
                onClickNext()
            }
        }
        setSubmitLoading(false);
    }

    const onClickBack = () => {
        router.push('/debris');
    }

    const { fireInsPremiumTotal, fireAndPerilsInsPremiumTotal } = getTotalPremiumsForFireAndPerilsInsurance(localData?.selectedCoverages ?? [], coveragesData?.coverages ?? [])

    type FieldSeperatedType = { id: string | number; name: string };
    type Field_1Type = FieldSeperatedType & { field_1?: number };
    type Field_2Type = FieldSeperatedType & { field_2?: number };

    const tableRows = localData?.selectedCoverages.map(e => {
        let coverageData = coveragesData?.coverages?.find(c => c.CoverageID == e.id);
        const temp: (Field_1Type | Field_2Type)[] = [{ field_1: e.field_1, id: e.id, name: coverageData?.CoverageName ?? '' }];
        if(e.field_2 && e.field_2 > 0) temp.push({ field_2: e.field_2, id: e.id, name: coverageData?.CoverageFields.field_2?.label?.replace('(optional)', '') ?? '' })
        return temp;
    }).flat() ?? [];

    return (
        <Flex w = '100%' direction={'column'} gap = '10px'  py = '20px'>
            
            {
                isClient &&
                <Flex 
                    w = '100%' gap = '30px' direction={'column'} minH = '150px'
                    borderRadius={'10px'} bg = 'white'
                    padding={['15px', '20px', '20px', '40px 30px 40px 40px', '40px 30px 40px 40px']}
                    boxShadow={'0 2px 8px rgba(0, 0, 0, .2)'}
                >

                    {/* Desktop view table */}
                    <TableContainer w = '100%' display={['none', 'none', 'none', 'block', 'block']}>
                        <Table variant='unstyled'>
                            <TableCaption mb = '40px' placement="top" fontSize={'23px'} fontWeight={'bold'} color = '#040431'>Select your coverage</TableCaption>
                            <Thead>
                                <Tr>
                                    <Th w = '30%' borderBottom={'none'} padding = '20px 20px 0'></Th>
                                    <Th w = '35%' borderBottom={'none'} padding = '20px 20px 0' textTransform={'none'} color = '#424551'>
                                        <Flex direction={'column'} gap = '10px'>
                                            <Heading as = 'h1' fontSize={'24px'}>FIRE INSURANCE</Heading>
                                            <Heading as = 'h3' fontSize={'18px'}>PREMIUM</Heading>
                                        </Flex>
                                    </Th>
                                    <Th w = '50%' borderBottom={'none'} padding = '20px 20px 0' textTransform={'none'} color = '#424551'>
                                        <Flex direction={'column'} gap = '10px'>
                                            <Flex>
                                                <Heading as = 'h1' fontSize={'24px'} >
                                                    FIRE & PERILS INSURANCE
                                                    <FirePerilsInsTooltip>
                                                        <Icon w = 'auto' h = 'auto' as = {InfoIcon} />
                                                    </FirePerilsInsTooltip>
                                                </Heading>
                                            </Flex>
                                            <Flex gap ='10px' alignItems={'center'}>
                                                <Heading as = 'h3' fontSize={'18px'}>PREMIUM</Heading>
                                                <Text w = 'fit-content' fontSize={'12px'} color={'white'} bg = 'brand.yellow' p = '5px 20px' borderRadius={'49px'}>Recommended</Text>
                                            </Flex>
                                        </Flex>
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '20px', textIndent: '-99999px' }}>
                                {
                                    isClient && tableRows?.map((coverage, index) => {
                                        const coverageData = coveragesData?.coverages?.find(e => e.CoverageID == coverage.id);
                                        const forField = 'field_2' in coverage ? 'field_2' : 'field_1';
                                        return <Tr key = {coverage.id} color = '#424551' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>
                                            <Td w = '30%' p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>{coverage?.name}</Td>
                                            <Td w = '35%' p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>RM {convertToPriceFormat(calculatePremiumForCoverage(coverage, 'FIRE', coverageData, forField), true)}</Td>
                                            <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>RM {convertToPriceFormat(calculatePremiumForCoverage(coverage, 'FIRE_PERILS', coverageData, forField), true)}</Td>
                                        </Tr>
                                    })
                                }
                                {
                                    isClient &&
                                    <Tr color = '#424551'>
                                        <Td w = '30%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>Total</Td>
                                        <Td w = '35%' p = '20px' borderBottom={'none'}>
                                            <Flex gap = '10px' flexWrap={'wrap'}>
                                                {fireInsPremiumTotal.actual != fireInsPremiumTotal.rounded && <Text as = 's' fontWeight={'bold'} fontSize={'18px'}>RM {convertToPriceFormat(fireInsPremiumTotal.actual, true)}</Text>}
                                                <Text fontWeight={'bold'} fontSize={'18px'}>RM {convertToPriceFormat(fireInsPremiumTotal.rounded, true)}</Text>
                                            </Flex>
                                        </Td>
                                        <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>
                                            <Flex gap = '10px' flexWrap={'wrap'}>
                                                {fireAndPerilsInsPremiumTotal.actual != fireAndPerilsInsPremiumTotal.rounded && <Text as = 's' fontWeight={'bold'} fontSize={'18px'}>RM {convertToPriceFormat(fireAndPerilsInsPremiumTotal.actual, true)}</Text>}
                                                <Text fontWeight={'bold'} fontSize={'18px'}>RM {convertToPriceFormat(fireAndPerilsInsPremiumTotal.rounded, true)}</Text>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                }
                                <Tr color = '#424551'>
                                    <Td w = '30%' p = '20px' borderBottom={'none'}></Td>
                                    <Td w = '35%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>
                                        {
                                            isClient && insType == 'FIRE' ?
                                            <Flex w = 'fit-content' h = '45px' px = '20px' bg = 'green.200' borderRadius={'8px'} justifyContent={'center'} alignItems={'center'} gap = '10px'>
                                                <Icon as = {CheckIcon} w = '25px' h = '25px' />
                                                <Text>SELECTED</Text>
                                            </Flex> :
                                            <Button onClick={() => onSelectInsType('FIRE')} minW = '150px' variant={'outline'} fontSize={'18px'} h = '45px'>Select</Button>
                                        }
                                    </Td>
                                    <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>
                                        {
                                            isClient && insType == 'FIRE_PERILS' ?
                                            <Flex w = 'fit-content' h = '45px' px = '20px' bg = 'green.200' borderRadius={'8px'} justifyContent={'center'} alignItems={'center'} gap = '10px'>
                                                <Icon as = {CheckIcon} w = '25px' h = '25px' />
                                                <Text>SELECTED</Text>
                                            </Flex> :
                                            <Button onClick={() => onSelectInsType('FIRE_PERILS')} minW = '150px' variant={'outline'} fontSize={'18px'} h = '45px'>Select</Button>
                                        }
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>

                    {/* Mobile view heading */}
                    <Heading as = "h1" mt = '20px' textAlign={'center'} fontSize={'23px'} fontWeight={'bold'} color = '#040431' display={['block', 'block', 'block', 'none', 'none']}>Select your coverage</Heading>

                    {/* Mobile view fire insurance table */}
                    <TableContainer w = '100%' display={['block', 'block', 'block', 'none', 'none']} border = '1px' borderColor={'brand.borderColor'} borderRadius={'8px'}>
                        <Table variant='unstyled'>
                            <Thead>
                                <Tr>
                                    <Th colSpan={2} borderBottom={'none'} padding = '20px 20px 0' textTransform={'none'} color = '#424551'>
                                        <Flex direction={'column'} gap = '10px'>
                                            <Heading as = 'h1' fontSize={['22px', '22px', '24px', '24px', '24px']} whiteSpace={'pre-wrap'}>FIRE INSURANCE</Heading>
                                            <Heading as = 'h3' fontSize={['16px','18px', '18px', '18px', '18px']}>PREMIUM</Heading>
                                        </Flex>
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '20px', textIndent: '-99999px' }}>
                                {
                                    isClient && tableRows?.map((coverage, index) => {
                                        const coverageData = coveragesData?.coverages?.find(e => e.CoverageID == coverage.id);
                                        const forField = 'field_2' in coverage ? 'field_2' : 'field_1';
                                        return <Tr key = {coverage.id} color = '#424551' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>
                                            <Td p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} whiteSpace={'pre-wrap'}>{coverage?.name}</Td>
                                            <Td p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} whiteSpace={'pre-wrap'}>RM {convertToPriceFormat(calculatePremiumForCoverage(coverage, 'FIRE', coverageData, forField), true)}</Td>
                                        </Tr>
                                    })
                                }
                                {
                                    isClient &&
                                    <Tr color = '#424551'>
                                        <Td w = '30%' p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} borderBottom={'none'}>Total</Td>
                                        <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} borderBottom={'none'} whiteSpace={'pre-wrap'}>
                                            <Flex gap = '10px' flexWrap={'wrap'}>
                                                {fireInsPremiumTotal.actual != fireInsPremiumTotal.rounded && <Text as = 's' fontWeight={'bold'} fontSize={'18px'}>RM {convertToPriceFormat(fireInsPremiumTotal.actual, true)}</Text>}
                                                <Text fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']}>RM {convertToPriceFormat(fireInsPremiumTotal.rounded, true)}</Text>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                }
                                <Tr color = '#424551'>
                                    <Td colSpan={2} p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} borderBottom={'none'}>
                                        {
                                            isClient && insType == 'FIRE' ?
                                            <Flex w = '100%' h = '45px' px = '20px' bg = 'green.200' borderRadius={'8px'} justifyContent={'center'} alignItems={'center'} gap = '10px'>
                                                <Icon as = {CheckIcon} w = '25px' h = '25px' />
                                                <Text>SELECTED</Text>
                                            </Flex> :
                                            <Button onClick={() => onSelectInsType('FIRE')} h = '45px' w = '100%' variant={'outline'} fontSize={['16px','18px', '18px', '18px', '18px']}>Select</Button>
                                        }
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>

                    {/* Mobile view fire and perils insurance table */}
                    <TableContainer w = '100%' display={['block', 'block', 'block', 'none', 'none']} border = '1px' borderColor={'brand.borderColor'} borderRadius={'8px'}>
                        <Table variant='unstyled'>
                            <Thead>
                                <Tr>
                                    <Th colSpan={2} borderBottom={'none'} padding = '20px 20px 0' textTransform={'none'} color = '#424551'>
                                        <Flex direction={'column'} gap = '10px'>
                                            <Flex>
                                                <Heading as = 'h1' fontSize={['22px', '22px', '24px', '24px', '24px']} whiteSpace={'pre-wrap'}>
                                                    FIRE & PERILS INSURANCE
                                                    <FirePerilsInsTooltip>
                                                        <Icon w = 'auto' h = 'auto' as = {InfoIcon} />
                                                    </FirePerilsInsTooltip>
                                                </Heading>
                                            </Flex>
                                            <Flex gap ='10px' alignItems={'center'} flexWrap={'wrap'}>
                                                <Heading as = 'h3' fontSize={['16px','18px', '18px', '18px', '18px']}>PREMIUM</Heading>
                                                <Text w = 'fit-content' fontSize={'12px'} color={'white'} bg = 'brand.yellow' p = '5px 20px' borderRadius={'49px'}>Recommended</Text>
                                            </Flex>
                                        </Flex>
                                    </Th> 
                                </Tr>
                            </Thead>
                            <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '20px', textIndent: '-99999px' }}>
                                {
                                    isClient && tableRows?.map((coverage, index) => {
                                        const coverageData = coveragesData?.coverages?.find(e => e.CoverageID == coverage.id);
                                        const forField = 'field_2' in coverage ? 'field_2' : 'field_1';
                                        return <Tr key = {coverage.id} color = '#424551' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>
                                            <Td p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} whiteSpace={'pre-wrap'}>{coverage?.name}</Td>
                                            <Td p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} whiteSpace={'pre-wrap'}>RM {convertToPriceFormat(calculatePremiumForCoverage(coverage, 'FIRE_PERILS', coverageData, forField), true)}</Td>
                                        </Tr>
                                    })
                                }
                                {
                                    isClient &&
                                    <Tr color = '#424551'>
                                        <Td w = '30%' p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} borderBottom={'none'}>Total</Td>
                                        <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} borderBottom={'none'} whiteSpace={'pre-wrap'}>
                                            <Flex gap = '10px' flexWrap={'wrap'}>
                                                {fireAndPerilsInsPremiumTotal.actual != fireAndPerilsInsPremiumTotal.rounded && <Text as = 's' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']}>RM {convertToPriceFormat(fireAndPerilsInsPremiumTotal.actual, true)}</Text>}
                                                <Text fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']}>RM {convertToPriceFormat(fireAndPerilsInsPremiumTotal.rounded, true)}</Text>
                                            </Flex>
                                        </Td>
                                    </Tr>
                                }
                                <Tr color = '#424551'>
                                    <Td colSpan={2} p = '20px' fontWeight={'bold'} fontSize={['16px','18px', '18px', '18px', '18px']} borderBottom={'none'}>
                                        {
                                            isClient && insType == 'FIRE_PERILS' ?
                                            <Flex w = '100%' h = '45px' px = '20px' bg = 'green.200' borderRadius={'8px'} justifyContent={'center'} alignItems={'center'} gap = '10px'>
                                                <Icon as = {CheckIcon} w = '25px' h = '25px' />
                                                <Text>SELECTED</Text>
                                            </Flex> :
                                            <Button onClick={() => onSelectInsType('FIRE_PERILS')} h = '45px' w = '100%' variant={'outline'} fontSize={'18px'}>Select</Button>
                                        }
                                    </Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </TableContainer>

                    {
                        fireInsPremiumTotal.actual != fireInsPremiumTotal.rounded  || fireAndPerilsInsPremiumTotal.actual != fireAndPerilsInsPremiumTotal.rounded ?
                        <Alert mt = '-10px' status='info' borderRadius={'8px'}>
                            <AlertIcon />
                            Minimum coverage premium is RM 75.00
                        </Alert> : <></>
                    }

                    {
                        error &&
                        <Alert mt = '-10px' status='error' borderRadius={'8px'}>
                            <AlertIcon />
                            Please select insurance type!
                        </Alert>
                    }

                    <Flex mt = '20px' w = '100%' gap = '20px' justifyContent={'center'}>
                        <Button onClick = {onClickBack} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>BACK</Button>
                        <Button onClick = {onClickNext} isLoading = {submitLoading} isDisabled = {error} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.secondary' color = 'white' _hover = {{}} _focus={{}}>NEXT</Button>
                    </Flex>

                </Flex>
            }

        </Flex>
    );
}

export default Coverages;