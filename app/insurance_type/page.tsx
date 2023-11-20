"use client"
import { Alert, AlertIcon, Button, Flex, Heading, Icon, ListItem, OrderedList, Table, TableCaption, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { useClient, useLocalStorage, useSessionStorage } from "@/components/hooks";
import { Coverage, InsuranceType, SelectedCoverage } from "@/components/types";
import { removeLeadingZeros } from "@/components/utill_methods";
import { TOOLTIP_INFO } from "@/components/app/app_constants";
import { useEffect, useState } from "react";
import { CheckIcon, InfoIcon } from "@/components/icons";
import ResponsiveTooltip from "@/components/tooltip";
import { useRouter } from "next/navigation";
import { NextPage } from "next";


const Coverages: NextPage<{}> = ({}) => {
    const [coverageSessionData, setCoverageSessionData] = useSessionStorage('coverages', null);
    const [localData, setLocalData] = useLocalStorage('clinic_form_data', null);
    const [insType, setInsType] = useState<InsuranceType>(localData?.selectedInsType ?? null);
    const [error, setError] = useState(false);
    const isClient = useClient();
    const router = useRouter();

    useEffect(() => {
        if(coverageSessionData == null) { 
            router.replace('/'); 
        } else if(coverageSessionData != null && (localData?.selectedCoverages.length ?? 0) < 1) {
            router.replace('/coverage');
        }
    }, [coverageSessionData, localData, router])

    const percentageResult = (percent: number, total: number) => {
        const result = ((percent/ 100) * total).toFixed(2);
        return removeLeadingZeros(result);
    };

    const calculatePremium = (selectedCoverage: SelectedCoverage, type: 'FIRE' | 'FIRE_PERILS', coverage?: Coverage, ) => {
        const total = (selectedCoverage.field_1 ?? 0) ?? (selectedCoverage?.field_2 ?? 0);
        return type == 'FIRE' ? percentageResult(coverage?.fireInsPremiumPercentage ?? 0, total) : percentageResult(coverage?.fireAndPerilsInsPremiumPercentage ?? 0, total);
    }

    const onSelectInsType = (type: InsuranceType) => {
        setError(type == null);
        setInsType(type);
    }

    const validate = () => {
        setError(insType == null);
        return insType == null;
    }

    const onClickNext = () => {
        if(validate()) return ;
        if(localData) {
            setLocalData({ ...localData, selectedInsType: insType });
            router.push('/optional_coverage');
        }  
    }

    const onClickBack = () => {
        router.push('/coverage');
    }

    const { fireInsPremiumTotal, fireAndPerilsInsPremiumTotal } = localData?.selectedCoverages.reduce((out, selected) => {
        const coverageData = coverageSessionData?.coverages?.find(e => e.id == selected.id);
        if(coverageData == null) return out;
        const total = (selected.field_1 ?? 0) ?? (selected?.field_2 ?? 0);
        let calculatedResultForFireInsPremium = percentageResult(coverageData?.fireInsPremiumPercentage ?? 0, total);
        let calculatedResultForFireAndPerilsInsPremium = percentageResult(coverageData?.fireAndPerilsInsPremiumPercentage ?? 0, total);
        out.fireInsPremiumTotal += parseFloat(calculatedResultForFireInsPremium.toString());
        out.fireAndPerilsInsPremiumTotal += parseFloat(calculatedResultForFireAndPerilsInsPremium.toString());
        return out;
    }, { fireInsPremiumTotal: 0, fireAndPerilsInsPremiumTotal: 0 }) ?? { fireInsPremiumTotal: 0, fireAndPerilsInsPremiumTotal: 0 };

    return (
        <Flex w = '100%' direction={'column'} gap = '10px'  py = '20px'>
            
            <Flex 
                w = '100%' gap = '30px' direction={'column'} minH = '150px'
                borderRadius={'10px'} bg = 'white'
                padding={['20px', '20px', '20px', '40px 30px 40px 40px', '40px 30px 40px 40px']}
                border = {['1px', '0px', '0px', '0px', '0px']}
                borderColor={'brand.borderColor'}
                boxShadow={[
                    'none',
                    '0 2px 8px rgba(0, 0, 0, .2)',
                    '0 2px 8px rgba(0, 0, 0, .2)',
                    '0 2px 8px rgba(0, 0, 0, .2)',
                    '0 2px 8px rgba(0, 0, 0, .2)',
                ]}
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
                                                <ResponsiveTooltip 
                                                    wrapperDivProps = {{ verticalAlign: 'middle', ml: '10px' }}
                                                    label = {
                                                        <Flex maxW = '380px' direction={'column'}>
                                                            <Heading as = 'h3' fontSize={'18px'}>{TOOLTIP_INFO.fireAndPerilsIns.title}</Heading>
                                                            <OrderedList ml = '30px'>
                                                                {
                                                                    TOOLTIP_INFO.fireAndPerilsIns.contents.map(e => {
                                                                        return <ListItem key = {e}>{e}</ListItem>
                                                                    })
                                                                }
                                                            </OrderedList>
                                                        </Flex>
                                                    }
                                                >
                                                    <Icon w = 'auto' h = 'auto' as = {InfoIcon} />
                                                </ResponsiveTooltip>
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
                                isClient && localData?.selectedCoverages?.map((coverage, index) => {
                                    const coverageData = coverageSessionData?.coverages?.find(e => e.id == coverage.id);
                                    return <Tr key = {coverage.id} color = '#424551' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>
                                        <Td w = '30%' p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>{coverageData?.name}</Td>
                                        <Td w = '35%' p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>RM {calculatePremium(coverage, 'FIRE', coverageData)}</Td>
                                        <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>RM {calculatePremium(coverage, 'FIRE_PERILS', coverageData)}</Td>
                                    </Tr>
                                })
                            }
                            {
                                isClient &&
                                <Tr color = '#424551'>
                                    <Td w = '30%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>Total</Td>
                                    <Td w = '35%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>RM {fireInsPremiumTotal}</Td>
                                    <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>RM {fireAndPerilsInsPremiumTotal}</Td>
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
                                        <Button onClick={() => onSelectInsType('FIRE')} variant={'outline'} fontSize={'18px'}>Select</Button>
                                    }
                                </Td>
                                <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>
                                    {
                                        isClient && insType == 'FIRE_PERILS' ?
                                        <Flex w = 'fit-content' h = '45px' px = '20px' bg = 'green.200' borderRadius={'8px'} justifyContent={'center'} alignItems={'center'} gap = '10px'>
                                            <Icon as = {CheckIcon} w = '25px' h = '25px' />
                                            <Text>SELECTED</Text>
                                        </Flex> :
                                        <Button onClick={() => onSelectInsType('FIRE_PERILS')} variant={'outline'} fontSize={'18px'}>Select</Button>
                                    }
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>

                {/* Mobile view heading */}
                <Heading as = "h1" textAlign={'center'} mb = '20px' fontSize={'23px'} fontWeight={'bold'} color = '#040431' display={['block', 'block', 'block', 'none', 'none']}>Select your coverage</Heading>

                {/* Mobile view fire insurance table */}
                <TableContainer w = '100%' display={['block', 'block', 'block', 'none', 'none']} border = '1px' borderColor={'brand.borderColor'} borderRadius={'8px'}>
                    <Table variant='unstyled'>
                        <Thead>
                            <Tr>
                                <Th colSpan={2} borderBottom={'none'} padding = '20px 20px 0' textTransform={'none'} color = '#424551'>
                                    <Flex direction={'column'} gap = '10px'>
                                        <Heading as = 'h1' fontSize={'24px'} whiteSpace={'pre-wrap'}>FIRE INSURANCE</Heading>
                                        <Heading as = 'h3' fontSize={'18px'}>PREMIUM</Heading>
                                    </Flex>
                                </Th>
                            </Tr>
                        </Thead>
                        <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '20px', textIndent: '-99999px' }}>
                            {
                                isClient && localData?.selectedCoverages?.map((coverage, index) => {
                                    const coverageData = coverageSessionData?.coverages?.find(e => e.id == coverage.id);
                                    return <Tr key = {coverage.id} color = '#424551' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>
                                        <Td p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>{coverageData?.name}</Td>
                                        <Td p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>RM {calculatePremium(coverage, 'FIRE', coverageData)}</Td>
                                    </Tr>
                                })
                            }
                            {
                                isClient &&
                                <Tr color = '#424551'>
                                    <Td w = '30%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>Total</Td>
                                    <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'} whiteSpace={'pre-wrap'}>RM {fireInsPremiumTotal}</Td>
                                </Tr>
                            }
                            <Tr color = '#424551'>
                                <Td colSpan={2} p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>
                                    {
                                        isClient && insType == 'FIRE' ?
                                        <Flex w = '100%' h = '45px' px = '20px' bg = 'green.200' borderRadius={'8px'} justifyContent={'center'} alignItems={'center'} gap = '10px'>
                                            <Icon as = {CheckIcon} w = '25px' h = '25px' />
                                            <Text>SELECTED</Text>
                                        </Flex> :
                                        <Button onClick={() => onSelectInsType('FIRE')} w = '100%' variant={'outline'} fontSize={'18px'}>Select</Button>
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
                                            <Heading as = 'h1' fontSize={'24px'} whiteSpace={'pre-wrap'}>
                                                FIRE & PERILS INSURANCE
                                                <ResponsiveTooltip 
                                                    wrapperDivProps = {{ verticalAlign: 'middle', ml: '10px' }}
                                                    label = {
                                                        <Flex maxW = '380px' direction={'column'}>
                                                            <Heading as = 'h3' fontSize={'18px'}>{TOOLTIP_INFO.fireAndPerilsIns.title}</Heading>
                                                            <OrderedList ml = '30px'>
                                                                {
                                                                    TOOLTIP_INFO.fireAndPerilsIns.contents.map(e => {
                                                                        return <ListItem key = {e}>{e}</ListItem>
                                                                    })
                                                                }
                                                            </OrderedList>
                                                        </Flex>
                                                    }
                                                >
                                                    <Icon w = 'auto' h = 'auto' as = {InfoIcon} />
                                                </ResponsiveTooltip>
                                            </Heading>
                                        </Flex>
                                        <Flex gap ='10px' alignItems={'center'} flexWrap={'wrap'}>
                                            <Heading as = 'h3' fontSize={'18px'}>PREMIUM</Heading>
                                            <Text w = 'fit-content' fontSize={'12px'} color={'white'} bg = 'brand.yellow' p = '5px 20px' borderRadius={'49px'}>Recommended</Text>
                                        </Flex>
                                    </Flex>
                                </Th> 
                            </Tr>
                        </Thead>
                        <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '20px', textIndent: '-99999px' }}>
                            {
                                isClient && localData?.selectedCoverages?.map((coverage, index) => {
                                    const coverageData = coverageSessionData?.coverages?.find(e => e.id == coverage.id);
                                    return <Tr key = {coverage.id} color = '#424551' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>
                                        <Td p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>{coverageData?.name}</Td>
                                        <Td p = '20px' fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'}>RM {calculatePremium(coverage, 'FIRE_PERILS', coverageData)}</Td>
                                    </Tr>
                                })
                            }
                            {
                                isClient &&
                                <Tr color = '#424551'>
                                    <Td w = '30%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>Total</Td>
                                    <Td w = '50%' p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'} whiteSpace={'pre-wrap'}>RM {fireAndPerilsInsPremiumTotal}</Td>
                                </Tr>
                            }
                            <Tr color = '#424551'>
                                <Td colSpan={2} p = '20px' fontWeight={'bold'} fontSize={'18px'} borderBottom={'none'}>
                                    {
                                        isClient && insType == 'FIRE_PERILS' ?
                                        <Flex w = '100%' h = '45px' px = '20px' bg = 'green.200' borderRadius={'8px'} justifyContent={'center'} alignItems={'center'} gap = '10px'>
                                            <Icon as = {CheckIcon} w = '25px' h = '25px' />
                                            <Text>SELECTED</Text>
                                        </Flex> :
                                        <Button onClick={() => onSelectInsType('FIRE_PERILS')} w = '100%' variant={'outline'} fontSize={'18px'}>Select</Button>
                                    }
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>

                {
                    error &&
                    <Alert mt = '20px' status='error' borderRadius={'8px'}>
                        <AlertIcon />
                        Please select insurance type!
                    </Alert>
                }

                <Flex mt = '20px' w = '100%' gap = '20px' justifyContent={'center'}>
                    <Button onClick = {onClickBack} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>BACK</Button>
                    <Button onClick = {onClickNext} isDisabled = {error} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.secondary' color = 'white' _hover = {{}} _focus={{}}>NEXT</Button>
                </Flex>

            </Flex>

        </Flex>
    );
}

export default Coverages;