"use client"
import { useClient, useLocalStorage, useSessionStorage } from "@/lib/hooks";
import { convertToPriceFormat, getNumberFromString } from "@/lib/utlils/utill_methods";
import { OptionalCoverageForm } from "@/lib/components/forms";
import { Text, Alert, AlertIcon, Button, Flex, Heading, Modal, ModalBody, ModalContent, ModalOverlay } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import BottomActions from "@/lib/components/bottom_actions";
import { ClinicData, SelectedCoverage } from "@/lib/types";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import useCoverage from "@/lib/hooks/use_coverage";
import { MAX_COVERAGE_VALUE, PROTECTION_AND_LIABILITY_COVERAGE } from "@/lib/app/app_constants";
import MaxLimitExceededPopup from "@/lib/components/max_cover_limit_popup";
import Image from "next/image";

const OptionalCoverages: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData } = useCoverage(localData?.quoteId);
    const [data, setData] = useState<SelectedCoverage[]>(coveragesData?.optionalCoverages.map(e => {
        const fieldValuesFormLocalData = localData?.selectedOptionalCoverages.find(localCoverageData => localCoverageData.id == e.CoverageID);
        return { id: e.CoverageID, field_1: fieldValuesFormLocalData?.field_1 ?? 0, field_2: fieldValuesFormLocalData?.field_2 ?? 0 }
    }) ?? []);
    const [selectedCoverages, setSelectedCoverages] = useState<(string | number)[]>(localData?.selectedOptionalCoverages.map(e => e.id) ?? []);
    type ErrorType = { 
        noCoverage: boolean, 
        maxLimit: { isExceeded: boolean, currentTotalValue: number },
        fieldErrors: { id: number | string, field_1: boolean, field_2?: boolean }[] 
    }
    const [maxLimitPopupOpen, setMaxLimitPopupOpen] = useState(false);
    const [skipConfirmPopup, setSkipConfirmPopup] = useState(false);
    const [errors, setErrors] = useState<ErrorType>({ noCoverage: false, maxLimit: { isExceeded: false, currentTotalValue: 0 }, fieldErrors: [] });
    const isClient = useClient();
    const router = useRouter();

    useEffect(() => {
        if(localData?.quoteId == null || localData?.quoteId == '') {
            router.replace('/');
        } else if(localData?.selectedInsType == null) {
            router.replace('/insurance_type');
        }
    }, [localData, router])

    const onClickAddOrRemove = (coverageId: string | number) => {
        let tempData: typeof selectedCoverages = JSON.parse(JSON.stringify(selectedCoverages));
        if (tempData.includes(coverageId)) {
            tempData = tempData.filter(e => e != coverageId)
        } else {
            tempData.push(coverageId)
        }
        const totalCoverageValue = calculateTotalCoverageValue(getCurrentCoveragesList(data.filter(e => tempData.includes(e.id))));
        setSelectedCoverages(tempData)
        setErrors(prev => ({ 
            noCoverage: false, 
            maxLimit: { isExceeded: totalCoverageValue > MAX_COVERAGE_VALUE, currentTotalValue: totalCoverageValue },
            fieldErrors: prev.fieldErrors.filter(e => e.id != coverageId) 
        }))
    }

    const calculateTotalCoverageValue = (allSelectedCoverages: SelectedCoverage[]) => {
        return allSelectedCoverages.reduce((out, coverage) => out + (coverage.field_1 ?? 0) + (coverage.field_2 ?? 0), 0);
    }

    const getCurrentCoveragesList = (coverages: SelectedCoverage[]) => {
        const coveragesInCurrentPage = coveragesData?.optionalCoverages?.map(e => e.CoverageID) ?? [];
        const coveragesNotInCurrentPage: (string | number)[] = [PROTECTION_AND_LIABILITY_COVERAGE.id];
        return [
            ...coverages.filter(e => coveragesInCurrentPage.includes(e.id)),
            ...(localData?.selectedOptionalCoverages ?? []).filter(e => coveragesNotInCurrentPage.includes(e.id)),
            ...(localData?.selectedCoverages ?? [])
        ];
    }
    
    const validateField = (coverage: SelectedCoverage) => {
        if(coverage.field_1 == null) return ;
        const fieldError = errors.fieldErrors.find(e => e.id == coverage.id);
        const totalCoverageValue = calculateTotalCoverageValue(getCurrentCoveragesList(data.filter(e => selectedCoverages.includes(e.id)).map(e => e.id == coverage.id ? coverage : e)));
        const isMaxCoverageValueExceeded = totalCoverageValue > MAX_COVERAGE_VALUE;
        
        if(coverage.field_1 == 0 && (fieldError == null || fieldError?.field_1 == false)) {
            let fieldErrors: ErrorType['fieldErrors'] = JSON.parse(JSON.stringify(errors.fieldErrors));
            setErrors(prev => ({
                ...prev, 
                maxLimit: { isExceeded: isMaxCoverageValueExceeded, currentTotalValue: totalCoverageValue },
                fieldErrors: [...fieldErrors.filter(e => e.id != coverage.id), { id: coverage.id, field_1: true }]
            }))
        }
        if(coverage.field_1 > 0 && fieldError != null && fieldError?.field_1 == true) {
            let fieldErrors: ErrorType['fieldErrors'] = JSON.parse(JSON.stringify(errors.fieldErrors));
            setErrors(prev => ({
                ...prev, 
                maxLimit: { isExceeded: isMaxCoverageValueExceeded, currentTotalValue: totalCoverageValue },
                fieldErrors: [...fieldErrors.filter(e => e.id != coverage.id), { id: coverage.id, field_1: false }]
            }))
        } else if((errors.maxLimit.isExceeded && isMaxCoverageValueExceeded == false) || (errors.maxLimit.isExceeded == false && isMaxCoverageValueExceeded)) {
            setErrors(prev => ({ 
                ...prev, 
                maxLimit: { isExceeded: isMaxCoverageValueExceeded, currentTotalValue: totalCoverageValue } 
            }))
        }
    }

    const onFieldValueChange = (event: ChangeEvent<HTMLInputElement> , coverageId: string | number) => {
        const coverage = data.find(e => e.id == coverageId);
        if(coverage == null) return ;
        const field = event.target.name == 'field_2' ? 'field_2' : 'field_1';
        let value: null | number = 0;
        if(event.target.value != '') { value = getNumberFromString(event.target.value) ?? 0 }
        value = Math.trunc(value);
        coverage[field] = value;
        setData(prev => prev.map(e => e.id == coverageId ? coverage : e))
        
        if(coverage.field_1 == null) return ;
        validateField(coverage);
    }

    const updateLocalData = (coverages: SelectedCoverage[]) => {
        if(localData == null) return ;
        const coveragesInCurrentPage = coveragesData?.optionalCoverages?.map(e => e.CoverageID) ?? [];
        const coveragesNotInCurrentPage: (string | number)[] = [PROTECTION_AND_LIABILITY_COVERAGE.id];
        const coveragesToBeUpdated = [
            ...coverages.filter(e => coveragesInCurrentPage.includes(e.id)),
            ...localData.selectedOptionalCoverages.filter(e => coveragesNotInCurrentPage.includes(e.id))
        ];
        setLocalData({ 
            ...localData, 
            selectedOptionalCoverages: coveragesToBeUpdated
        })
    }

    const validate = () => {
        const tempErrors: ErrorType = JSON.parse(JSON.stringify(errors));
        const totalCoverageValue = calculateTotalCoverageValue(getCurrentCoveragesList(data));
        tempErrors.maxLimit.isExceeded = totalCoverageValue > MAX_COVERAGE_VALUE;
        tempErrors.maxLimit.currentTotalValue = totalCoverageValue;
        tempErrors.noCoverage = false;
        tempErrors.fieldErrors = data.filter(e => selectedCoverages.includes(e.id)).map(e => e.field_1 == null || e.field_1 < 1 ? { id: e.id, field_1: true } : null).filter(Boolean) as ErrorType['fieldErrors']
        setErrors(tempErrors)
        if(tempErrors.maxLimit.isExceeded) setMaxLimitPopupOpen(true)
        return tempErrors.maxLimit.isExceeded == true || tempErrors.fieldErrors.some(e => e.field_1 == true);
    }

    const onClickSkipOrNext = () => {
        if(localData == null || validate()) return ;
        if(selectedCoverages.length < 1 && data.some(e => ((e.field_1 ?? 0) + (e.field_2 ?? 0)) > 0)) {
            setSkipConfirmPopup(true);
        } else {
            onClickNext()
        }
    }

    const onClickNext = () => {
        if(localData == null || validate()) return ;
        updateLocalData(data.filter(e => selectedCoverages.includes(e.id)));
        router.push('/protection_liability_coverage');
    }

    const onClickBack = () => {
        router.push('/insurance_type');
    }

    return (
        <Flex w = '100%' direction={'column'} gap = '10px'  py = '20px'>
            <MaxLimitExceededPopup 
                isOpen = {maxLimitPopupOpen}
                onClose = {() => setMaxLimitPopupOpen(false)}
                currentValue = {errors.maxLimit.currentTotalValue}
            />

            <SkipConfirmPopup 
                isOpen = {skipConfirmPopup}
                onClose = {() => setSkipConfirmPopup(false)}
                onClickYes = {onClickNext}
            />

            <Heading as = 'h1' ml = '20px' my = '20px' fontSize={'23px'}>Optional Coverage</Heading> 
            {
                isClient && coveragesData?.optionalCoverages.map(coverage => {
                    return <OptionalCoverageForm
                        key = {coverage.CoverageID}
                        isAdded = {selectedCoverages.includes(coverage.CoverageID)}
                        coverage={coverage} 
                        onClickAddOrRemove={() => onClickAddOrRemove(coverage.CoverageID)} 
                        onChangeFieldValue={(e) => onFieldValueChange(e, coverage.CoverageID)} 
                        values = {data.find(e => e.id == coverage.CoverageID)}
                        errors = {errors.fieldErrors.find(e => e.id == coverage.CoverageID)}
                    />
                })
            }
            
            {
                errors.maxLimit.isExceeded &&
                <Alert mt = '20px' status='error' borderRadius={'8px'}>
                    <AlertIcon />
                    Total coverage value (coverages & optional coverages) cannot be more than RM 10,000,000. Your current total coverage value is RM {convertToPriceFormat(errors.maxLimit.currentTotalValue, true, true)}
                </Alert>
            }

            {
                isClient &&
                <BottomActions>
                    <Button onClick = {onClickBack} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>BACK</Button>
                    <Button 
                        onClick = {onClickSkipOrNext} 
                        isDisabled = {errors.fieldErrors.filter(e => selectedCoverages.includes(e.id)).some(e => e.field_1)} 
                        width = {['100%', '100%', '250px', '250px', '250px']} 
                        minW = '150px' 
                        bg = {selectedCoverages.length > 0 ? 'brand.secondary' : 'brand.green'}
                        color = 'white' _hover = {{}} _focus={{}}
                    >
                        {selectedCoverages.length > 0 ? 'NEXT' : 'SKIP'}
                    </Button>
                </BottomActions>
            }
        </Flex>
    );
}

export default OptionalCoverages;

interface SkipConfirmPopupProps {
    isOpen: boolean,
    onClose: () => void,
    onClickYes: () => void
}
 
const SkipConfirmPopup = ({ isOpen, onClose, onClickYes }: SkipConfirmPopupProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'12px'} maxW = {['90%', '90%', '38rem', '38rem', '38rem']}>
                <ModalBody py ={['40px', '40px', '20px', '20px', '20px']} >
                    <Flex p = {['0px', '0px', '30px', '30px', '30px']} direction={'column'} gap = {'10px'} alignItems={'center'}>
                        <Heading textAlign={'center'} color = 'brand.primary' fontSize={'16px'}>You have entered values for optional coverages,</Heading>
                        <Heading textAlign={'center'} color = 'brand.primary' fontSize={'16px'}>but the package is not added</Heading>
                        <Heading textAlign={'center'} color = 'brand.primary' fontSize={'16px'}>Are you still want to skip?</Heading>
                        <Flex mt = '30px' gap = '20px'>
                            <Button onClick = {onClose} h = '40px' w = {['100px', '150px', '250px', '250px', '250px']} bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>No</Button>
                            <Button onClick = {onClickYes} h = '40px' w = {['100px', '150px', '250px', '250px', '250px']} bg = 'brand.secondary' color = 'white' _focus={{}} _hover={{}}>Yes</Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}