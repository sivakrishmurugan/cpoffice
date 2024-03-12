import { Flex, TableContainer, Table, Thead, Tbody, Tr, Th, Td, Heading, Icon, IconButton, Accordion, Collapse } from "@chakra-ui/react";
import { ClinicData, SelectedCoverage } from "../types";
import { CoverageResData } from "../hooks/use_sessionstorage";
import React, { useState } from "react";
import { convertToPriceFormat } from "../utlils/utill_methods";
import { calculatePremiumForCoverage, calculatePremiumForOptionalCoverage, getTotalPremiumsForFireAndPerilsInsurance } from "../utlils/calculation";
import { EXCESS, PROTECTION_AND_LIABILITY_COVERAGE, TOOLTIP_INFO } from "../app/app_constants";
import ResponsiveTooltip from "./tooltip";
import { CheckIcon, InfoIcon } from "../icons";
import { MdArrowForwardIos } from 'react-icons/md';

interface SummaryTablesProps {
    coveragesData: CoverageResData | null,
    localData: ClinicData | null
}

const SummaryTables = ({ coveragesData, localData }: SummaryTablesProps) => {
    const coverageValue = (coverage: SelectedCoverage) => {
        return (coverage?.field_1 ?? 0) + (coverage?.field_2 ?? 0)
    }
    const { fireInsPremiumTotal, fireAndPerilsInsPremiumTotal } = getTotalPremiumsForFireAndPerilsInsurance(localData?.selectedCoverages ?? [], coveragesData?.coverages ?? [])
    const selectedInsTotalPremium = localData?.selectedInsType == 'FIRE' ? fireInsPremiumTotal : fireAndPerilsInsPremiumTotal;
    const min75NoteText = selectedInsTotalPremium.actual != selectedInsTotalPremium.rounded ? 'Minimum coverage premium is RM 75.00' : null
    
    type FieldSeperatedType = { id: string | number; name: string };
    type Field_1Type = FieldSeperatedType & { field_1?: number };
    type Field_2Type = FieldSeperatedType & { field_2?: number };

    const coveragesTableRows = localData?.selectedCoverages.map(e => {
        let coverageData = coveragesData?.coverages?.find(c => c.CoverageID == e.id);
        const temp: (Field_1Type | Field_2Type)[] = [{ field_1: e.field_1, id: e.id, name: coverageData?.CoverageName ?? '' }];
        if(e.field_2 && e.field_2 > 0) temp.push({ field_2: e.field_2, id: e.id, name: coverageData?.CoverageFields.field_2?.label?.replace('(optional)', '') ?? '' })
        return temp;
    }).flat() ?? [];

    const optionalCoverageTableRows = localData?.selectedOptionalCoverages.map(e => {
        let coverageData = coveragesData?.optionalCoverages?.find(c => c.CoverageID == e.id);
        const temp: (Field_1Type | Field_2Type)[] = [{ field_1: e.field_1, id: e.id, name: coverageData?.CoverageName?.replace('Protect against ','').replace('Protect your Mobile Phones','Mobile/PDA') ?? '' }];
        if(e.field_2 && e.field_2 > 0) temp.push({ field_2: e.field_2, id: e.id, name: coverageData?.CoverageFields.field_2?.label?.replace('(optional)', '').replace('Laptop/Sum Insured', 'Laptop/Notebooks') ?? '' })
        return temp;
    }).flat() ?? [];

    return (
        <Flex gap = {'20px'} direction={'column'} >

            {/* Basic clinic info */}
            <TableContainer py = {['0px', '0px', '0px', '10px', '10px']} px = {['0px', '0px', '0px', '20px', '20px']} borderWidth={['0px', '0px', '0px', '1px', '1px']} borderColor={'brand.borderColor'} maxW = '100%'>
                <Table variant={'unstyled'}>
                    <Tbody>
                        <Tr fontSize={'16px'} fontWeight={'bold'}>
                            <Td py = '10px' w = '40%' px = {'0px'} pr = '20px' whiteSpace={'pre-wrap'}>Clinic Name</Td>
                            <Td minW = '150px' py = '10px'  px = {'0px'} whiteSpace={'pre-wrap'}>{localData?.basic?.name}</Td>
                        </Tr>
                        <Tr fontSize={'16px'} fontWeight={'bold'}>
                            <Td py = '10px' w = '40%' px = {'0px'}pr = '20px'  whiteSpace={'pre-wrap'}>Coverage Period</Td>
                            <Td minW = '150px' py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>12 Months</Td>
                        </Tr>
                        <Tr fontSize={'16px'} fontWeight={'bold'}>
                            <Td py = '10px' w = '40%' px = {'0px'} pr = '20px' whiteSpace={'pre-wrap'} verticalAlign={'top'}>Location</Td>
                            <Td lineHeight={1.5}  minW = '150px' py = '10px' px = {'0px'} whiteSpace={'pre-wrap'}>{localData?.basic?.address}</Td>
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
                            coveragesTableRows.map((coverage, index) => {
                                const coverageData = coveragesData?.coverages?.find(e => e.CoverageID == coverage.id);
                                const forField = 'field_2' in coverage ? 'field_2' : 'field_1';
                                return <Tr key = {coverage.id}>
                                    <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'} lineHeight={1.5} >{coverage.name}</Td>
                                    <Td px = '5px'></Td>
                                    <Td w = '37%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM {convertToPriceFormat(coverageValue(coverage), true, false)}</Td>
                                    <Td fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.primary' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM {convertToPriceFormat(calculatePremiumForCoverage(coverage, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', coverageData, forField), true, false)}</Td>
                                </Tr>
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>

            {min75NoteText != null && <Heading display={['none', 'none', 'none', 'flex', 'flex']} color = 'red' fontSize={'16px'}>{min75NoteText}</Heading>}

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
                            coveragesTableRows.map((coverage, index) => {
                                const coverageData = coveragesData?.coverages?.find(e => e.CoverageID == coverage.id);
                                const bgColor = index % 2 != 0 ? 'white' : 'tableStripedColor.100';
                                const forField = 'field_2' in coverage ? 'field_2' : 'field_1';
                                return <React.Fragment key={coverage.id}>
                                    <Tr>
                                        <Th px = '10px' pb = '5px' pt = {index % 2 != 0 ? '20px' : undefined} colSpan={2} fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bgColor} lineHeight={1.5} textTransform={'none'}>{coverage?.name}</Th>
                                    </Tr>
                                    <Tr>
                                        <Th px = '10px' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bgColor}>COVERAGE VALUE</Th>
                                        <Td px = '10px' fontSize={'16px'} fontWeight={'bold'} bg = {bgColor}>RM {convertToPriceFormat(coverageValue(coverage), true, false)}</Td>
                                    </Tr>
                                    <Tr>
                                        <Th px = '10px' pt = '5px' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bgColor}>PREMIUM</Th>
                                        <Td px = '10px' pt = '5px' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bgColor}>RM {convertToPriceFormat(calculatePremiumForCoverage(coverage, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', coverageData, forField), true, false)}</Td>
                                    </Tr>
                                </React.Fragment>
                            })
                        }
                    </Tbody>
                </Table>
            </TableContainer>

            {min75NoteText != null && <Heading display={['flex', 'flex', 'flex', 'none', 'none']} color = 'red' fontSize={'16px'}>{min75NoteText}</Heading>}
            
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
                                    optionalCoverageTableRows.map((coverage, index) => {
                                        let coverageData = coveragesData?.optionalCoverages?.find(e => e.CoverageID == coverage.id);
                                        const forField = 'field_2' in coverage ? 'field_2' : 'field_1';
                                        const isProtectionAndLiabilityCoverage = coverage.id == PROTECTION_AND_LIABILITY_COVERAGE.id;

                                        if(isProtectionAndLiabilityCoverage) {
                                            coverage = { id: coverage.id, field_1: PROTECTION_AND_LIABILITY_COVERAGE.coverageValue, name: PROTECTION_AND_LIABILITY_COVERAGE.name }
                                            coverageData = {
                                              CoverageName:
                                                PROTECTION_AND_LIABILITY_COVERAGE.name,
                                              isABR: 0,
                                              InsPercent: 0.031154,
                                            } as any;

                                            return <ProtectionAndLiabilityCoverageTableRow
                                                isMobile = {false}
                                                name={coverage?.name}
                                                cValue={coverageValue(coverage)}
                                                cPremium = {calculatePremiumForOptionalCoverage(coverage, coverageData!, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', localData?.selectedCoverages ?? [], coveragesData?.coverages ?? [], forField)}
                                                bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}
                                            />;
                                        }

                                        return <Tr>
                                            <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'} lineHeight={1.5} >{coverage?.name}</Td>
                                            <Td px = '5px'></Td>
                                            <Td w = '37%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>RM {convertToPriceFormat(coverageValue(coverage), true, false)}</Td>
                                            <Td fontWeight={'bold'} fontSize={'16px'} color = 'brand.primary' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>
                                                RM {convertToPriceFormat(calculatePremiumForOptionalCoverage(coverage, coverageData!, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', localData?.selectedCoverages ?? [], coveragesData?.coverages ?? [], forField), true, false)}
                                            </Td>
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
                                    optionalCoverageTableRows.map((coverage, index) => {
                                        const bgColor = index % 2 != 0 ? 'white' : 'tableStripedColor.100';
                                        let coverageData = coveragesData?.optionalCoverages?.find(e => e.CoverageID == coverage.id);
                                        const forField = 'field_2' in coverage ? 'field_2' : 'field_1';
                                        const isProtectionAndLiabilityCoverage = coverage.id == PROTECTION_AND_LIABILITY_COVERAGE.id;
                                        
                                        if(isProtectionAndLiabilityCoverage) {
                                            coverage = { id: coverage.id, field_1: PROTECTION_AND_LIABILITY_COVERAGE.coverageValue, name: PROTECTION_AND_LIABILITY_COVERAGE.name }
                                            coverageData = {
                                                CoverageName: PROTECTION_AND_LIABILITY_COVERAGE.name,
                                                isABR: 0,
                                                InsPercent: 0.0405,
                                            } as any;

                                            return <ProtectionAndLiabilityCoverageTableRow 
                                                isMobile
                                                name={coverage?.name}
                                                cValue={coverageValue(coverage)}
                                                cPremium = {calculatePremiumForOptionalCoverage(coverage, coverageData!, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', localData?.selectedCoverages ?? [], coveragesData?.coverages ?? [], forField)}
                                                bg = {bgColor}
                                            />
                                        }

                                        return <React.Fragment key = {coverage.id}>
                                            <Tr>
                                                <Th px = '10px' pb = '5px' pt = {index % 2 != 0 ? '20px' : undefined} colSpan={2} fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bgColor} lineHeight={1.5} textTransform={'none'}>{coverage?.name}</Th>
                                            </Tr>
                                            <Tr>
                                                <Th px = '10px' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bgColor}>COVERAGE VALUE</Th>
                                                <Td px = '10px' fontSize={'16px'} fontWeight={'bold'} bg = {bgColor}>RM {convertToPriceFormat(coverageValue(coverage), true, false)}</Td>
                                            </Tr>
                                            <Tr>
                                                <Th px = '10px' pt = '5px' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bgColor}>PREMIUM</Th>
                                                <Td px = '10px' pt = '5px' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bgColor}>RM {convertToPriceFormat(calculatePremiumForOptionalCoverage(coverage, coverageData!, localData?.selectedInsType == 'FIRE' ? 'FIRE' : 'FIRE_PERILS', localData?.selectedCoverages ?? [], coveragesData?.coverages ?? [], forField), true, false)}</Td>
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
                                        <Heading fontWeight={'bold'} fontSize={'20px'} color = 'brand.primary'>
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
                                                <Td w = '40%' lineHeight={1.5} fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>{excess.title}</Td>
                                                <Td px = '7px'></Td>
                                                <Td lineHeight={1.5} fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {index%2 != 0 ? 'white' : 'tableStripedColor.100'}>{excess.value}</Td>
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
                                        <Heading fontWeight={'bold'} fontSize={'20px'} color = 'brand.primary'>
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
                                                <Th lineHeight={1.6}  px = '10px' pb = '5px' pt = {index % 2 != 0 ? '20px' : undefined} colSpan={2} fontWeight={'bold'} fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bgColor} textTransform={'none'}>{excess?.title}</Th>
                                            </Tr>
                                            <Tr>
                                                <Td lineHeight={1.6}  px = '10px' bg = {bgColor} fontSize={'15px'} whiteSpace={'pre-wrap'}>{excess.value}</Td>
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
    );
}

export default SummaryTables;

const ProtectionAndLiabilityCoverageTableRow = ({ name, cValue, cPremium, bg, isMobile }: { name: string, cValue: number | string, cPremium: number | string, bg: string, isMobile: boolean }) => {
    const [isExpanded, setExpanded] = useState(false);

    if(isMobile) {
        return (
            <React.Fragment>
                <Tr>
                    <Th 
                        px = '10px' pb = '5px' pt = {'10px'} colSpan={2} fontWeight={'bold'} 
                        fontSize={'18px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bg} lineHeight={1.5} textTransform={'none'}
                    >
                        <Flex w = '100%' alignItems={'center'} justifyContent={'space-between'}>
                            {name}
                            <IconButton
                                mr = '50px' 
                                onClick={() => setExpanded(prev => !prev)} 
                                transform={isExpanded ? 'rotate(270deg)' : 'rotate(90deg)'}
                                size = 'sm' variant={'ghost'} isRound 
                                icon={<Icon w = '18px' h = '18px' as = {MdArrowForwardIos} color = 'black' />} 
                                aria-label={"expand button"} 
                            />
                        </Flex>
                    </Th>
                </Tr>
                <Tr>
                    <Th px = '10px' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bg}>COVERAGE VALUE</Th>
                    <Td px = '10px' fontSize={'16px'} fontWeight={'bold'} bg = {bg}>RM {convertToPriceFormat(cValue, true, false)}</Td>
                </Tr>
                <Tr>
                    <Th px = '10px' pt = '5px' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bg}>PREMIUM</Th>
                    <Td px = '10px' pt = '5px' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bg}>RM {convertToPriceFormat(cPremium, true, false)}</Td>
                </Tr>
                <Tr>
                    <Td p = {0} colSpan={2}>
                        <Collapse animateOpacity unmountOnExit in = {isExpanded}>
                            <Table variant={'unstyled'}>
                                <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '10px', textIndent: '-99999px' }}>
                                    {
                                        [
                                            { name: 'Burglary', coverageValue: 20000 },
                                            { name: 'Money inside premises', coverageValue: 5000 },
                                            { name: 'Money In transit', coverageValue: 5000 },
                                            { name: 'Fidelity guarantee', coverageValue: 10000 },
                                            { name: 'Plate glass', coverageValue: 10000 },
                                            { name: 'Public liability', coverageValue: 1000000 },
                                            { name: 'Employer liability', coverageValue: 250000 }
                                        ].map((item, i) => {
                                            return <Tr key = {item.name}>
                                                <Th px = '10px' pt = {i == 0 ? '15px' : undefined} w = '53%' color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bg} textTransform={'none'}>{item.name}</Th>
                                                <Td px = '10px' pt = {i == 0 ? '15px' : '5px'} color = 'brand.primary' fontSize={'16px'} fontWeight={'bold'} bg = {bg}>RM {convertToPriceFormat(item.coverageValue, true, false)}</Td>
                                            </Tr>
                                        })
                                    }
                                </Tbody>
                            </Table>
                        </Collapse>
                    </Td>
                </Tr>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <Tr>
                <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bg} lineHeight={1.5} >{name}</Td>
                <Td px = '5px'></Td>
                <Td w = '37%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bg}>RM {convertToPriceFormat(cValue, true, false)}</Td>
                <Td 
                    fontWeight={'bold'} fontSize={'16px'} pr = {0}
                    color = 'brand.primary' bg = {bg}
                >
                    RM {convertToPriceFormat(cPremium, true, false)}
                    <IconButton 
                        ml = '5px' mt = '-5px'
                        onClick={() => setExpanded(prev => !prev)} 
                        transform={isExpanded ? 'rotate(270deg)' : 'rotate(90deg)'}
                        size = 'sm' variant={'ghost'} isRound 
                        icon={<Icon w = '18px' h = '18px' as = {MdArrowForwardIos} color = 'black' />} 
                        aria-label={"expand button"} 
                    />
                </Td>
            </Tr>
            <Tr>
                <Td p = {0} colSpan={4}>
                    <Collapse animateOpacity unmountOnExit in = {isExpanded}>
                        <Table variant={'unstyled'}>
                            <Tbody _before={{ content: '"@"', display: 'block', lineHeight: '10px', textIndent: '-99999px' }}>
                                {
                                    [
                                        { name: 'Burglary', coverageValue: 20000 },
                                        { name: 'Money inside premises', coverageValue: 5000 },
                                        { name: 'Money In transit', coverageValue: 5000 },
                                        { name: 'Fidelity guarantee', coverageValue: 10000 },
                                        { name: 'Plate glass', coverageValue: 10000 },
                                        { name: 'Public liability', coverageValue: 1000000 },
                                        { name: 'Employer liability', coverageValue: 250000 }
                                    ].map((item, i) => {
                                        return <Tr>
                                            <Td w = '40%' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bg} lineHeight={1.5} >{item.name}</Td>
                                            <Td px = '2px' bg = 'white'></Td>
                                            <Td w = 'calc(100% - 1px)' fontWeight={'bold'} fontSize={'16px'} whiteSpace={'pre-wrap'} color = 'brand.text' bg = {bg}>RM {convertToPriceFormat(item.coverageValue, true, false)}</Td>
                                        </Tr>
                                    })
                                }
                            </Tbody>
                        </Table>
                    </Collapse>
                </Td>
            </Tr>
        </React.Fragment>
    );
}