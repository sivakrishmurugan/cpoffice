import { Button, Flex, Text, Heading, Modal, ModalOverlay, ModalContent, ModalBody, IconButton, Input, Select } from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { ClaimInfoRowForm } from ".";
import { ClaimDeclarationAdditionalData } from "@/lib/types";
import { getNumberFromString, getRecentYears } from "@/lib/utlils/utill_methods";
import axiosClient from "@/lib/utlils/axios";
import { useCoverage } from "@/lib/hooks";

interface ClaimFormPopupProps {
    isOpen: boolean,
    onClose: () => void,
    quoteId: string,
    list: ClaimDeclarationAdditionalData[],
    onClickSubmit: (list: ClaimDeclarationAdditionalData[]) => void,
}

const getModifiedClaimInfoForLocalState = (info?: ClaimDeclarationAdditionalData) => {
    return {
        id: Math.random().toString(),
        type: { value: info?.type ?? 'Property', error: false },
        year: { value: info?.year ?? getRecentYears(1)[0], error: false },
        amount: { value: info?.amount ?? 0, error: false },
        description: { value: info?.description ?? '', error: false }
    }
}

const ClaimFormPopup = ({ list, quoteId, isOpen, onClose, onClickSubmit }: ClaimFormPopupProps) => {
    const { updateDataWithNewQuoteId } = useCoverage(quoteId);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [data, setData] = useState([
        ...list?.map(e => getModifiedClaimInfoForLocalState(e)) ?? [], 
        ...(list.length < 1 ? [getModifiedClaimInfoForLocalState()] : [])
    ]);

    useEffect(() => {
        setData([
            ...list?.map(e => getModifiedClaimInfoForLocalState(e)) ?? [], 
            ...(list.length < 1 ? [getModifiedClaimInfoForLocalState()] : [])
        ])
    }, [list])

    const onChangeClaimInfoValues = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: 'type' | 'year' | 'amount' | 'desciption', index: number) => {
        const tempData: typeof data = JSON.parse(JSON.stringify(data));
        switch(field) {
            case 'type': {
                tempData[index].type.value = event.target.value;
                tempData[index].type.error = event.target.value == '';
                break;
            }
            case 'year': {
                tempData[index].year.value = event.target.value;
                tempData[index].year.error = event.target.value == '';
                break;
            }
            case 'desciption': {
                tempData[index].description.value = event.target.value;
                tempData[index].description.error = event.target.value == '';
                break;
            }
            case 'amount': {
                let value: null | number = 0;
                if(event.target.value != '') { value = getNumberFromString(event.target.value) ?? 0 }
                value = Math.trunc(value);
                tempData[index].amount.value = value;
                tempData[index].amount.error = value < 1;
                break;
            }
        }
        setData(prev => tempData);
    }

    const onClickDeleteClaimRow = (index: number) => {
        setData(prev => prev.filter((_, i) => i != index))
    }

    const onClickAddRecord = () => {
        setData(prev => [...prev, getModifiedClaimInfoForLocalState()])
    }

    const validate = () => {
        const tempData: typeof data = JSON.parse(JSON.stringify(data));
        tempData.forEach(e => {
            e.amount.error = e.amount.value < 1;
            e.type.error = e.type.value == '';
            e.year.error = e.year.value == '';
            e.description.error = e.description.value == '';
        })
        setData(tempData);
        return tempData.some(e => Object.values(e).some(value => typeof value == 'string' ? false : value.error))
    }

    const onSubmit = async () => {
        if(validate()) return ;
        setSubmitLoading(true);
        try {
            const res = await axiosClient.post('/api/clinicshield/insertclaims', {
                QuoteID: quoteId,
                ClaimDeclaration: JSON.stringify(data.map(e => ({
                    ClaimType: e.type.value,
                    ClaimYear: e.year.value,
                    ClaimAmount: e.amount.value.toString(),
                    Description: e.description.value
                })))
            });
            if(res && res.data && res.data[0]) {
                if(res.data?.[0]?.Success == 1) {
                    onClickSubmit(data.map(e => ({
                        type: e.type.value,
                        year: e.year.value,
                        amount: e.amount.value,
                        description: e.description.value,
                    })));
                }
            } 
        } catch(e: any) {
            if(e?.response?.status == 401) {
                await updateDataWithNewQuoteId(quoteId);
                onSubmit()
            }
        }
        setSubmitLoading(false)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior = 'inside' closeOnOverlayClick = {false}>
            <ModalOverlay />
            <ModalContent borderRadius={'12px'} maxW = {['90%', '90%', 'auto', 'auto', '65rem']}>
                <ModalBody py ={'40px'} px = '40px'>
                    <Flex direction={'column'} gap = '20px'>
                        <Text fontSize={'16px'} color = 'brand.text' fontWeight={'bold'}>Please provide additional information</Text>
                        <Flex flexShrink={0} w = '100%' gap = '15px' direction={'column'}>

                            {/* Desktop view information fields header */}
                            <Flex display={['none', 'none', 'none', 'flex', 'flex']} flexShrink={0} w = '100%' gap = '20px'>
                                <Text w = '16%' color = 'brand.text' fontSize={'14px'}>Type of Claim</Text>
                                <Text w = '16%' color = 'brand.text' fontSize={'14px'}>Year of Claim</Text>
                                <Text w = '16%' color = 'brand.text' fontSize={'14px'}>Amount of Claim</Text>
                                <Text w = '33%' color = 'brand.text' fontSize={'14px'}>Description</Text>
                            </Flex>
                            
                            {
                                data.map((item, index, array) => {
                                    return <ClaimInfoRowForm
                                        key = {item.id}
                                        isNotDeletable = {index == 0 && array.length == 1}
                                        values = {item}
                                        onChangeValue = {(e, field) => onChangeClaimInfoValues(e, field, index)}
                                        onClickDelete = {() => onClickDeleteClaimRow(index)}
                                    />
                                })
                            }
                            
                            <Button onClick={onClickAddRecord} h = '45px' mt = '20px' width={['100%', '100%', '100%', '130px', '130px']} variant={'outline'} fontSize={'14px'}>+ Add Record</Button>

                        </Flex>
                    </Flex>
                    <Flex mt = '20px' w = '100%' gap = '20px' justifyContent={'center'}>
                        <Button onClick = {onClose} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>Cancel</Button>
                        <Button onClick = {onSubmit} isLoading = {submitLoading} isDisabled = {data.some(e => Object.values(e).some(value => typeof value == 'string' ? false : value.error))} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.secondary' color = 'white' _hover = {{}} _focus={{}}>Add</Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default ClaimFormPopup;
