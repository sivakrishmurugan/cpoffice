"use client"
import { useClient, useLocalStorage, useSessionStorage } from "@/components/hooks";
import { getNumberFromString } from "@/components/utill_methods";
import { OptionalCoverageForm } from "@/components/forms";
import { Button, Flex, Heading } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import BottomActions from "@/components/bottom_actions";
import { SelectedCoverage } from "@/components/types";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import useCoverage from "@/components/hooks/use_coverage";


const OptionalCoverages: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useLocalStorage('clinic_form_data', null);
    const { isLoading, coveragesData } = useCoverage(localData?.quoteId);
    const [data, setData] = useState<SelectedCoverage[]>(coveragesData?.optionalCoverages.map(e => {
        const fieldValuesFormLocalData = localData?.selectedOptionalCoverages.find(localCoverageData => localCoverageData.id == e.CoverageID);
        return { id: e.CoverageID, field_1: fieldValuesFormLocalData?.field_1 ?? 0, field_2: fieldValuesFormLocalData?.field_2 ?? 0 }
    }) ?? []);
    const [selectedCoverages, setSelectedCoverages] = useState<(string | number)[]>(localData?.selectedOptionalCoverages.map(e => e.id) ?? []);
    type ErrorType = { noCoverage: boolean, fieldErrors: { id: number | string, field_1: boolean, field_2?: boolean }[] }
    const [errors, setErrors] = useState<ErrorType>({ noCoverage: false, fieldErrors: [] });
    const isClient = useClient();
    const router = useRouter();

    useEffect(() => {
        if(localData?.quoteId == null || localData?.quoteId == '') {
            router.replace('/');
        }
    }, [localData, router])

    const onClickAddOrRemove = (coverageId: string | number) => {
        let tempData: typeof selectedCoverages = JSON.parse(JSON.stringify(selectedCoverages));
        if (tempData.includes(coverageId)) {
            tempData = tempData.filter(e => e != coverageId)
        } else {
            tempData.push(coverageId)
        }
        setSelectedCoverages(tempData)
        setErrors(prev => ({ 
            noCoverage: false, 
            fieldErrors: prev.fieldErrors.filter(e => e.id != coverageId) 
        }))
    }
    
    const validateField = (coverage: SelectedCoverage) => {
        if(coverage.field_1 == null) return ;
        const fieldError = errors.fieldErrors.find(e => e.id == coverage.id);
        if(coverage.field_1 == 0 && (fieldError == null || fieldError?.field_1 == false)) {
            let fieldErrors: ErrorType['fieldErrors'] = JSON.parse(JSON.stringify(errors.fieldErrors));
            setErrors(prev => ({...prev, fieldErrors: [...fieldErrors.filter(e => e.id != coverage.id), { id: coverage.id, field_1: true }]}))
        }
        if(coverage.field_1 > 0 && fieldError != null && fieldError?.field_1 == true) {
            let fieldErrors: ErrorType['fieldErrors'] = JSON.parse(JSON.stringify(errors.fieldErrors));
            setErrors(prev => ({...prev, fieldErrors: [...fieldErrors.filter(e => e.id != coverage.id), { id: coverage.id, field_1: false }]}))
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
        setLocalData({ 
            ...localData, 
            selectedOptionalCoverages: [
                ...localData.selectedOptionalCoverages.filter(e => coverages.findIndex(c => c.id == e.id) < 0), 
                ...coverages
            ] 
        })
    }

    const validate = () => {
        const tempErrors: ErrorType = JSON.parse(JSON.stringify(errors));
        tempErrors.noCoverage = false;
        tempErrors.fieldErrors = data.filter(e => selectedCoverages.includes(e.id)).map(e => e.field_1 == null || e.field_1 < 1 ? { id: e.id, field_1: true } : null).filter(Boolean) as ErrorType['fieldErrors']
        setErrors(tempErrors)
        return tempErrors.fieldErrors.some(e => e.field_1 == true);
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
                isClient &&
                <BottomActions>
                    <Button onClick = {onClickBack} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>BACK</Button>
                    <Button 
                        onClick = {onClickNext} 
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