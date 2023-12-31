"use client"
import { useClient, useSessionStorage } from "@/lib/hooks";
import { Alert, AlertIcon, Button, Flex } from "@chakra-ui/react";
import { convertToPriceFormat, getNumberFromString } from "@/lib/utlils/utill_methods";
import { ClinicData, SelectedCoverage } from "@/lib/types";
import { ChangeEvent, useEffect, useState } from "react";
import BottomActions from "@/lib/components/bottom_actions";
import { CoverageForm } from "@/lib/components/forms";
import { useRouter } from "next/navigation";
import useCoverage from "@/lib/hooks/use_coverage";
import { NextPage } from "next";
import { MAX_CONSULTANT_FEE_PERCENTAGE, MAX_COVERAGE_VALUE } from "@/lib/app/app_constants";
import MaxLimitExceededPopup from "@/lib/components/max_cover_limit_popup";
import { percentageResult } from "@/lib/utlils/calculation";


const Coverages: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData } = useCoverage(localData?.quoteId);
    const [data, setData] = useState<SelectedCoverage[]>(localData?.selectedCoverages.filter(e => e.id != coveragesData?.coverages.find(e => e.CoverageName == 'Removal of Debris')?.CoverageID) ?? []);
    type ErrorType = { 
        noCoverage: boolean, 
        maxLimit: { isExceeded: boolean, currentTotalValue: number },
        fieldErrors: { 
            id: string | number, 
            field_1: boolean, 
            field_2: boolean 
        }[] 
    }
    const [maxLimitPopupOpen, setMaxLimitPopupOpen] = useState(false);
    const [errors, setErrors] = useState<ErrorType>({ noCoverage: false, maxLimit: { isExceeded: false, currentTotalValue: 0 }, fieldErrors: [] });
    const isClient = useClient();
    const router = useRouter();

    useEffect(() => {
        if(localData?.quoteId == null || localData?.quoteId == '') {
            router.replace('/');
        }
    }, [localData, router])

    const onClickAddOrRemove = (coverageId: string | number) => {
        let tempData: typeof data = JSON.parse(JSON.stringify(data));
        if (tempData.findIndex(e => e.id == coverageId) > -1) {
            tempData = tempData.filter(e => e.id != coverageId)
        } else {
            tempData.push({ id: coverageId, field_1: 0, field_2: 0 })
        }
        const totalCoverageValue = calculateTotalCoverageValue(getCurrentCoveragesList(tempData));
        setData(tempData)
        setErrors(prev => ({ 
            maxLimit: { isExceeded: totalCoverageValue > MAX_COVERAGE_VALUE, currentTotalValue: totalCoverageValue },
            noCoverage: tempData.length < 1,
            fieldErrors: prev.fieldErrors.filter(e => e.id != coverageId) 
        }))
    }

    const calculateTotalCoverageValue = (allSelectedCoverages: SelectedCoverage[]) => {
        return allSelectedCoverages.reduce((out, coverage) => out + (coverage.field_1 ?? 0) + (coverage.field_2 ?? 0), 0);
    }

    const getCurrentCoveragesList = (coverages: SelectedCoverage[]) => {
        const coveragesInCurrentPage = coveragesData?.coverages.filter(e => e.CoverageName != 'Removal of Debris')?.map(e => e.CoverageID) ?? [];
        const coveragesNotInCurrentPage = coveragesData?.coverages.filter(e => e.CoverageName == 'Removal of Debris')?.map(e => e.CoverageID) ?? [];
        return [
            ...coverages.filter(e => coveragesInCurrentPage.includes(e.id)),
            ...(localData?.selectedCoverages ?? []).filter(e => coveragesNotInCurrentPage.includes(e.id)),
            ...(localData?.selectedOptionalCoverages ?? [])
        ];
    }
    
    const validateField = (coverage: SelectedCoverage) => {
        const field_1_value = coverage.field_1 ?? 0;
        const field_2_value = coverage.field_2 ?? 0;
        let fieldError = errors.fieldErrors.find(e => e.id == coverage.id);
        if(fieldError == null) fieldError = { id: coverage.id, field_1: false, field_2: false };
        const totalCoverageValue = calculateTotalCoverageValue(getCurrentCoveragesList(data.map(e => e.id == coverage.id ? coverage : e)));
        const isMaxCoverageValueExceeded = totalCoverageValue > MAX_COVERAGE_VALUE;
        
        const isField1ContainsError = field_1_value < 1;
        const isField2ContainsError = field_2_value > Math.round(Number(percentageResult(MAX_CONSULTANT_FEE_PERCENTAGE, field_1_value)));

        if((isField1ContainsError && fieldError.field_1 == false) || (isField2ContainsError && fieldError.field_2 == false)) {
            let fieldErrors: ErrorType['fieldErrors'] = JSON.parse(JSON.stringify(errors.fieldErrors));
            setErrors(prev => ({
                ...prev, maxLimit: { isExceeded: isMaxCoverageValueExceeded, currentTotalValue: totalCoverageValue },
                fieldErrors: [...fieldErrors.filter(e => e.id != coverage.id), { id: coverage.id, field_1: isField1ContainsError, field_2: isField2ContainsError }]
            }))
        } else if((isField1ContainsError == false && fieldError.field_1 == true) || (isField2ContainsError == false && fieldError.field_2 == true)) {
            let fieldErrors: ErrorType['fieldErrors'] = JSON.parse(JSON.stringify(errors.fieldErrors));
            setErrors(prev => ({
                ...prev, maxLimit: { isExceeded: isMaxCoverageValueExceeded, currentTotalValue: totalCoverageValue },
                fieldErrors: [...fieldErrors.filter(e => e.id != coverage.id), { id: coverage.id, field_1: isField1ContainsError, field_2: isField2ContainsError }]
            }))
        } else if((errors.maxLimit.isExceeded && errors.maxLimit.currentTotalValue != totalCoverageValue) || (errors.maxLimit.isExceeded && isMaxCoverageValueExceeded == false) || (errors.maxLimit.isExceeded == false && isMaxCoverageValueExceeded)) {
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
        value = Math.trunc(Math.abs(value));
        coverage[field] = value;
        if(field == 'field_1' && value < 1) coverage.field_2 = 0;
        setData(prev => prev.map(e => e.id == coverageId ? coverage : e))
        
        if(coverage.field_1 == null) return ;
        validateField(coverage);
    }

    const updateLocalData = (coverages: SelectedCoverage[]) => {
        if(localData == null) return ;
        const coveragesInCurrentPage = coveragesData?.coverages.filter(e => e.CoverageName != 'Removal of Debris')?.map(e => e.CoverageID) ?? [];
        const coveragesNotInCurrentPage = coveragesData?.coverages.filter(e => e.CoverageName == 'Removal of Debris')?.map(e => e.CoverageID) ?? [];
        const coveragesToBeUpdated = [
            ...coverages.filter(e => coveragesInCurrentPage.includes(e.id)),
            ...localData.selectedCoverages.filter(e => coveragesNotInCurrentPage.includes(e.id))
        ];
        setLocalData({ 
            ...localData, 
            selectedCoverages: coveragesToBeUpdated
        })
    }

    const validate = () => {
        const tempErrors: ErrorType = JSON.parse(JSON.stringify(errors));
        const totalCoverageValue = calculateTotalCoverageValue(getCurrentCoveragesList(data));
        tempErrors.maxLimit.isExceeded = totalCoverageValue > MAX_COVERAGE_VALUE;
        tempErrors.maxLimit.currentTotalValue = totalCoverageValue;
        tempErrors.noCoverage = data.length < 1;
        tempErrors.fieldErrors = data.map(e => {
            const isField1ContainsError = (e.field_1 ?? 0) < 1;
            const isField2ContainsError = (e.field_2 ?? 0) > Number(percentageResult(MAX_CONSULTANT_FEE_PERCENTAGE, (e.field_1 ?? 0)));
            return { id: e.id, field_1: isField1ContainsError, field_2: isField2ContainsError }
        }).filter(e => e.field_1 == true || e.field_2 == true)
        setErrors(tempErrors)
        if(tempErrors.maxLimit.isExceeded) setMaxLimitPopupOpen(true)
        return tempErrors.noCoverage == true ||  tempErrors.maxLimit.isExceeded == true || tempErrors.fieldErrors.some(e => e.field_1 == true || e.field_2 == true);
    }

    const onClickNext = async () => {
        if(validate()) return ;
        
        updateLocalData(data);
        router.push('/debris');
    }

    const onClickBack = () => {
        router.push('/');
    }

    return (
        <Flex w = '100%' direction={'column'} gap = '10px'  py = '20px'>
            <MaxLimitExceededPopup 
                isOpen = {maxLimitPopupOpen}
                onClose = {() => setMaxLimitPopupOpen(false)}
                currentValue = {errors.maxLimit.currentTotalValue}
            />
            {
                isClient && coveragesData?.coverages.filter(e => e.CoverageName != 'Removal of Debris').map(coverage => {
                    return <CoverageForm 
                        key = {coverage.CoverageID}
                        coverage={coverage} 
                        onClickAddOrRemove={() => onClickAddOrRemove(coverage.CoverageID)} 
                        onChangeFieldValue={(e) => onFieldValueChange(e, coverage.CoverageID)} 
                        values = {data.find(e => e.id == coverage.CoverageID)}
                        errors = {errors.fieldErrors.find(e => e.id == coverage.CoverageID)}
                    />
                })
            }
            {
                errors.noCoverage &&
                <Alert mt = '20px' status='error' borderRadius={'8px'}>
                    <AlertIcon />
                    You Should Add at Least One Coverage!
                </Alert>
            }
            {
                errors.maxLimit.isExceeded &&
                <Alert mt = '20px' status='error' borderRadius={'8px'}>
                    <AlertIcon />
                    Total coverage value (coverages & optional coverages) cannot be more than RM 10,000,000. Your current total coverage value is RM {convertToPriceFormat(errors.maxLimit.currentTotalValue, true, true)}
                </Alert>
            }
            <BottomActions>
                <Button onClick = {onClickBack} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>BACK</Button>
                <Button onClick = {onClickNext} isDisabled = {errors.noCoverage || errors.fieldErrors.some(e => e.field_1 == true || e.field_2 == true)} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.secondary' color = 'white' _hover = {{}} _focus={{}}>NEXT</Button>
            </BottomActions>
        </Flex>
    );
}

export default Coverages;