"use client"
import { useClient, useLocalStorage, useSessionStorage } from "@/components/hooks";
import { Alert, AlertIcon, Button, Flex  } from "@chakra-ui/react";
import { getNumberFromString } from "@/components/utill_methods";
import { ClinicData, SelectedCoverage } from "@/components/types";
import { ChangeEvent, useEffect, useState } from "react";
import BottomActions from "@/components/bottom_actions";
import { CoverageForm } from "@/components/forms";
import { useRouter } from "next/navigation";
import useCoverage from "@/components/hooks/use_coverage";
import axiosClient from "@/components/axios";
import { NextPage } from "next";


const Coverages: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData } = useCoverage(localData?.quoteId);
    const [data, setData] = useState<SelectedCoverage[]>(localData?.selectedCoverages.filter(e => e.id != coveragesData?.coverages.find(e => e.CoverageName == 'Removal of Debris')?.CoverageID) ?? []);
    type ErrorType = { 
        noCoverage: boolean, 
        fieldErrors: { 
            id: string | number, 
            field_1: { isInvalid: boolean, message: string }, 
            field_2?: { isInvalid: boolean, message: string } 
        }[] 
    }
    const [errors, setErrors] = useState<ErrorType>({ noCoverage: false, fieldErrors: [] });
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
        setData(tempData)
        setErrors(prev => ({ 
            noCoverage: tempData.length < 1, 
            fieldErrors: prev.fieldErrors.filter(e => e.id != coverageId) 
        }))
    }
    
    const validateField = (coverage: SelectedCoverage) => {
        if(coverage.field_1 == null) return ;
        const fieldError = errors.fieldErrors.find(e => e.id == coverage.id);
        if(coverage.field_1 == 0 && (fieldError == null || fieldError?.field_1.isInvalid == false)) {
            let fieldErrors: ErrorType['fieldErrors'] = JSON.parse(JSON.stringify(errors.fieldErrors));
            setErrors(prev => ({...prev, fieldErrors: [...fieldErrors.filter(e => e.id != coverage.id), { id: coverage.id, field_1: { isInvalid: true, message: 'Required!' } }]}))
        }
        if(coverage.field_1 > 0 && fieldError != null && fieldError?.field_1.isInvalid == true) {
            let fieldErrors: ErrorType['fieldErrors'] = JSON.parse(JSON.stringify(errors.fieldErrors));
            setErrors(prev => ({...prev, fieldErrors: [...fieldErrors.filter(e => e.id != coverage.id), { id: coverage.id, field_1: { isInvalid: false, message: '' } }]}))
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
        tempErrors.noCoverage = data.length < 1;
        tempErrors.fieldErrors = data.map(e => e.field_1 == null || e.field_1 < 1 ? { id: e.id, field_1: { isInvalid: true, message: 'Required!' } } : null).filter(Boolean) as ErrorType['fieldErrors']
        setErrors(tempErrors)
        return tempErrors.noCoverage == true || tempErrors.fieldErrors.some(e => e.field_1.isInvalid == true || e.field_2?.isInvalid == true);
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
                    You should add atleast one coverage!
                </Alert>
            }
            <BottomActions>
                <Button onClick = {onClickBack} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>BACK</Button>
                <Button onClick = {onClickNext} isDisabled = {errors.noCoverage || errors.fieldErrors.some(e => e.field_1)} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.secondary' color = 'white' _hover = {{}} _focus={{}}>NEXT</Button>
            </BottomActions>
        </Flex>
    );
}

export default Coverages;