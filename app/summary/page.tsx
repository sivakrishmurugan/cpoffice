"use client"
import { Button, Flex, Text, FormControl, FormErrorMessage, Heading, Icon, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalContent, ModalOverlay, Table, TableContainer, Tbody, Td, Tr, FormLabel, useRadioGroup, useRadio, UseRadioProps, IconButton, Alert, AlertIcon } from "@chakra-ui/react";
import { FORM_FIELD_ERROR_MESSAGES, STAMP_DUTY } from "@/lib/app/app_constants";
import { useClient, useSessionStorage } from "@/lib/hooks";
import { EditIcon, PICIDIcon, PICNameIcon } from "@/lib/icons";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import React from "react";
import useCoverage from "@/lib/hooks/use_coverage";
import { ClaimDeclarationAdditionalData, ClinicData } from "@/lib/types";
import { convertDateToString, convertStringToDate, convertToPriceFormat, getDateAfter365Days, validateField } from "@/lib/utlils/utill_methods";
import axiosClient from "@/lib/utlils/axios";
import Image from 'next/image';
import { calculateSummary } from "@/lib/utlils/calculation";
import ClaimFormPopup from "@/lib/components/forms/claim_form_popup";
import { DateInput } from "@/lib/components/inputs";
import SummaryTables from "@/lib/components/summary_tables";

const Summary: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData, updateDataWithNewQuoteId } = useCoverage(localData?.quoteId);
    const[showProcessingPopup, setShowProcessingPopup] = useState(false);
    const [data, setData] = useState({ 
        loading: null as null | 'PROMO_CODE' | 'EMAIL_QUOTE' | 'PROCEED',
        emailQuoteSuccessPopupOpen: false,
        claimInfoPopupOpen: false,
        promoCode: { 
            value: localData?.promoCode == null || localData?.promoCode == '' || localData?.promoCode == '0.00' ? '' : localData?.promoCode, 
            isApplied: localData?.promoCode == null || localData?.promoCode == '' || localData?.promoCode == '0.00' ? false : true, 
            appliedPercentage: localData?.promoCodePercentage ?? 0,
            error: null as string | null 
        }, 
        PICName: { value: localData?.PICName ?? '', error: null as string | null },
        PICID: { value: localData?.PICID ?? '', error: null as string | null },
        insStartDate: { value: localData?.insStartDate ?? '', error: false },
        previouslyClaimed: {
            isClaimed: localData?.claimDeclaration?.previouslyClaimed ?? null as boolean | null,
            error: false
        },
        claimInfoList: localData?.claimDeclaration?.addtionalInfo ?? []
    });
    const isClient = useClient();
    const router = useRouter();

    const { getRootProps: getPreviouslyClaimedRootProps, getRadioProps: getPreviouslyClaimedRadioProps } = useRadioGroup({
        name: 'previously_claimed_radio',
        onChange: async (value: 'yes' | 'no') => {
            setData(prev => ({ 
                ...prev,
                claimInfoPopupOpen: value == 'yes',
                previouslyClaimed: {
                    isClaimed: value == 'yes',
                    error: false
                },
                claimInfoList: value == 'yes' ? prev.claimInfoList : []
            }))
            if(value != 'yes' && data.claimInfoList.length > 0) {
                if(localData) setLocalData({
                    ...localData,
                    claimDeclaration: {
                        previouslyClaimed: false,
                        addtionalInfo: []
                    }
                })
                await axiosClient.post('/api/clinicshield/insertclaims', {
                    QuoteID: localData?.quoteId,
                    ClaimDeclaration: JSON.stringify([])
                });
            }
        },
    });
    const previouslyClaimedRadioGroup = getPreviouslyClaimedRootProps();

    useEffect(() => {
        if(localData == null || localData.quoteId == null || localData.quoteId == '') {
            router.replace('/');
        } else if(localData?.selectedInsType == null) {
            router.replace('/insurance_type')
        }
    }, [localData, router])

    const onChangePromoCode = (event: ChangeEvent<HTMLInputElement>) => {
        if(data.promoCode.isApplied) return ;
        setData(prev => ({ ...prev, promoCode: { value: event.target.value, isApplied: false, appliedPercentage: 0, error: null } }))
    }

    const onApplyOrRemovePromoCode = async () => {
        if(localData == null) return ;
        if(data.promoCode.value == '' && data.promoCode.isApplied == false) {
            setData(prev => ({ ...prev, promoCode: { ...prev.promoCode, error: 'Please enter the promo code!' } }))
            return ;
        }

        if(data.promoCode.isApplied == true) {
            setData(prev => ({ ...prev, promoCode: { value: '', isApplied: false, appliedPercentage: 0, error: null } }))
            return ;
        }

        const toBeUpdatedData = { error: 'Invalid promo code!' as string | null, discount: 0 }
        setData(prev => ({ ...prev, loading: 'PROMO_CODE' }))
        try {
            const res = await axiosClient.post('/api/clinicshield/promocheck', { PromoCode: data.promoCode.value })
            if(res.data && res.data[0] && res.data[0].Success == 1) {
                toBeUpdatedData.discount = res.data[0].Percentage == null || res.data[0].Percentage == '' ? 0 : res.data[0].Percentage;
                toBeUpdatedData.error = null;
            } else if(res.data && res.data[0] && res.data[0].Expired == 1) {
                toBeUpdatedData.error = 'Promo code expired!'
            } else if(res.data && res.data[0] && res.data[0].Exceed == 1) {
                toBeUpdatedData.error = 'Promo code exceeded!'
            }
        } catch(e: any) {
            if(e?.response?.status == 401) {
                await updateDataWithNewQuoteId(localData?.quoteId);
                onApplyOrRemovePromoCode()
            }
        }
        
        setData(prev => ({ 
            ...prev, 
            loading: null,
            promoCode: {
                appliedPercentage: Number(toBeUpdatedData.discount),
                isApplied: toBeUpdatedData.error == null, 
                error: toBeUpdatedData.error,
                value: prev.promoCode.value 
            } 
        }))
    }

    const onChangePICName = (event: ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value.trimStart();

        const { isEmpty, isContainsFormatError } = validateField(inputValue, 'PICName');
        setData(prev => ({ 
            ...prev, 
            PICName: {
                value: inputValue,
                error: isEmpty ? FORM_FIELD_ERROR_MESSAGES.PICName.required : isContainsFormatError ? FORM_FIELD_ERROR_MESSAGES.PICName.format : null
            } 
        }));
    }

    const onChangePICID = (event: ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value.trimStart();

        const { isEmpty, isContainsFormatError } = validateField(inputValue, 'PICID');
        setData(prev => ({ 
            ...prev, 
            PICID: {
                value: inputValue,
                error: isEmpty ? FORM_FIELD_ERROR_MESSAGES.PICID.required : isContainsFormatError ? FORM_FIELD_ERROR_MESSAGES.PICID.format : null
            } 
        }));
    }

    const onChangeInsStartDate = (event: ChangeEvent<HTMLInputElement>) => {
        const date = event.target.value;
        setData(prev => ({ ...prev, insStartDate: { value: date, error: date == '' } }))
    }

    const onClickEditClaimInfo = () => {
        setData(prev => ({ ...prev, claimInfoPopupOpen: true }))
    }

    const onClickSubmitClaims = (claims: ClaimDeclarationAdditionalData[]) => {
        setData(prev => ({ ...prev, claimInfoPopupOpen: false, claimInfoList: claims, previouslyClaimed: { isClaimed: true, error: false } }))
    }

    const { totalPremium, discount, netPremium, tax, finalPremium } = calculateSummary(
        localData?.selectedCoverages ?? [], 
        localData?.selectedOptionalCoverages ?? [], 
        localData?.selectedInsType ?? 'FIRE', 
        data.promoCode.appliedPercentage ?? 0, 
        coveragesData ?? { coverages: [], optionalCoverages: [] }
    );

    const validate = () => {
        const tempData: typeof data = JSON.parse(JSON.stringify(data));
        
        tempData.insStartDate.error = tempData.insStartDate.value == '';

        const validatedPICNameResult = validateField(data.PICName.value.trim(), 'PICName');
        tempData.PICName.error = validatedPICNameResult.isEmpty ? FORM_FIELD_ERROR_MESSAGES.PICName.required : validatedPICNameResult.isContainsFormatError ? FORM_FIELD_ERROR_MESSAGES.PICName.format : null;

        const validatedPICIDResult = validateField(data.PICID.value.trim(), 'PICID');
        tempData.PICID.error = validatedPICIDResult.isEmpty ? FORM_FIELD_ERROR_MESSAGES.PICID.required : validatedPICIDResult.isContainsFormatError ? FORM_FIELD_ERROR_MESSAGES.PICID.format : null;

        tempData.previouslyClaimed.error = tempData.previouslyClaimed.isClaimed == null;

        setData(tempData);
        return tempData.PICName.error != null || tempData.PICID.error != null || tempData.insStartDate.error == true || tempData.previouslyClaimed.error == true || (tempData.previouslyClaimed.isClaimed == true && tempData.claimInfoList.length < 1);
    }

    const onClickSubmit =  async (submitFor: 'EMAIL_QUOTE' | 'PROCEED' = 'PROCEED') => {
        if(localData == null || validate()) return ;

        const { totalPremium, discount, netPremium, tax, finalPremium } = calculateSummary(
            localData?.selectedCoverages ?? [], 
            localData?.selectedOptionalCoverages ?? [], 
            localData?.selectedInsType ?? 'FIRE', 
            data.promoCode.appliedPercentage ?? 0, 
            coveragesData ?? { coverages: [], optionalCoverages: [] }
        );
        
        setData(prev => ({ ...prev, loading: submitFor }));
        try {
            const res = await axiosClient.post('/api/clinicshield/setquote', {
                QuoteType: submitFor == 'EMAIL_QUOTE' ? 'email' : 'proceed',
                QuoteID: localData?.quoteId,
                ClinicName: localData?.basic.name,
                PICName: data.PICName.value,
                PICID: data.PICID.value,
                ClaimDeclaration: data.previouslyClaimed.isClaimed ? 'YES' : 'NO',
                InsuranceStartDate: data.insStartDate.value,
                InsuranceEndDate: getDateAfter365Days(data.insStartDate.value),
                TotalPremium: totalPremium,
                DiscountAmount: discount,
                PromoCode: data.promoCode.value,
                PromoPercentage: data.promoCode.appliedPercentage,
                NetPremium: netPremium,
                Tax: tax,
                StampDuty: STAMP_DUTY,
                FinalPremium: finalPremium
            });
            
            if(res.data && res.data[0] && res.data?.[0]?.Success == 1) {
                setLocalData({ 
                    ...localData, 
                    claimDeclaration: {
                        previouslyClaimed: data.previouslyClaimed.isClaimed,
                        addtionalInfo: data.claimInfoList
                    },
                    PICName: data.PICName.value,
                    PICID: data.PICID.value,
                    promoCode: data.promoCode.isApplied ? data.promoCode.value : '',
                    promoCodePercentage: data.promoCode.isApplied ? data.promoCode.appliedPercentage : 0,
                    insStartDate: data.insStartDate.value
                })

                if (submitFor == "PROCEED") {
                  //router.push('/claim_declaration');
                  if (data.previouslyClaimed.isClaimed || res.data?.[0]?.blocklistNameStatus == 1) {
                    setShowProcessingPopup(true);
                  } else {
                    const { finalPremium } = calculateSummary(
                      localData?.selectedCoverages ?? [],
                      localData?.selectedOptionalCoverages ?? [],
                      localData?.selectedInsType ?? "FIRE",
                      localData?.promoCodePercentage ?? 0,
                      coveragesData ?? { coverages: [], optionalCoverages: [] }
                    );
                    await redirectToPayment(localData.quoteId, finalPremium);
                  }
                } else {
                  setData((prev) => ({
                    ...prev,
                    loading: null,
                    emailQuoteSuccessPopupOpen: true,
                  }));
                }
            }
        } catch(e: any) {
            console.log('setquote failed', e)
            if(e?.response?.status == 401) {
                await updateDataWithNewQuoteId(localData?.quoteId);
                onClickSubmit(submitFor)
            }
        }
        setData(prev => ({ ...prev, loading: null }));
    }

    const redirectToPayment = async (encryptedQuoteId: string, amount: number) => {
        try {
            const res = await axiosClient.post('/api/clinicshield/dopayment', {
                QuoteID: encryptedQuoteId,
                Payment: amount.toString()
            })
            if(res.data && res.data.Success == 1 && res.data.Data.respCode && res.data.Data.respCode == '0000') {
                router.push(res.data.Data.webPaymentUrl);
            }
        } catch(e) {
            console.log('do payment api failed: ', e)
        }
    }

    const onClickCloseEmailQuotePopup = () => {
        setData(prev => ({ ...prev, emailQuoteSuccessPopupOpen: false }));
        router.replace('/');
    }

    const onCloseClaimPopup = () => {
        setData(prev => ({ 
            ...prev, 
            claimInfoPopupOpen: false, 
            previouslyClaimed: { 
                isClaimed: prev.claimInfoList.length > 0 ? prev.previouslyClaimed.isClaimed : null, 
                error: false 
            } 
        }))
    }

    const onCloseProccessingPopup = () => {
        router.replace('/')
        setShowProcessingPopup(false); 
    }

    const onClickEditDetails = () => router.push('/coverage');

    const onClickBack = () => {
        router.push('/protection_liability_coverage');
    }

    return (
        <Flex w = '100%' direction={'column'} gap = '10px'  py = '20px'>
            <QutoeClaimInfoProcessPopup 
                isOpen = {showProcessingPopup}
                onClose = {onCloseProccessingPopup}
            />
            <EmailQuotePopup 
                isOpen = {data.emailQuoteSuccessPopupOpen}
                onClose = {onClickCloseEmailQuotePopup}
            />
            <ClaimFormPopup 
                isOpen = {data.claimInfoPopupOpen}
                onClose = {onCloseClaimPopup}
                quoteId = {localData?.quoteId ?? ''}
                list = {data.claimInfoList}
                onClickSubmit = {onClickSubmitClaims}
            />
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
                            <Button onClick={onClickEditDetails} size = 'sm' variant={'outline'} borderColor = 'brand.borderColor' h = '40px'>EDIT DETAILS</Button>
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
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(totalPremium, true, false)}</Td>
                                    </Tr>
                                    {/* <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Discount</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(discount, true)}</Td>
                                    </Tr> */}
                                    {/* <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Nett Premium</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(netPremium, true, false)}</Td>
                                    </Tr> */}
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Tax 6%</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(tax, true, false)}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Stamp Duty</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(STAMP_DUTY, true, false)}</Td>
                                    </Tr>
                                    <Tr>
                                        <Td px ='0px' fontWeight={'bold'} fontSize={'16px'}>Final Premium</Td>
                                        <Td px = '0px' color = 'brand.secondary' fontWeight={'bold'} fontSize={'20px'} textAlign={'end'}>RM {convertToPriceFormat(finalPremium, true, false)}</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>

                        {/* <Flex w = '100%' gap = '10px' direction={'column'}>
                            <Heading as = 'h1' color = 'brand.text' fontSize={'23px'}>Promo code</Heading>
                            <FormControl isInvalid = {data.promoCode.error != null}>
                                <InputGroup>
                                    <Input value = {data.promoCode.value} onChange = {onChangePromoCode} isDisabled = {data.promoCode.isApplied} placeholder = "Ex. DS1234" />
                                    <InputRightElement h = '100%' w = 'auto' pr = '15px'>
                                        <Flex gap = '15px' alignItems={'center'}>
                                            {data.promoCode.isApplied && <Icon as = {CheckIconGreen} h = '100%' w = '20px' />}
                                            <Icon as = {PromoCodeIcon} h = 'auto' w = 'auto' />
                                        </Flex>
                                    </InputRightElement>
                                </InputGroup>
                                <FormErrorMessage ml = '10px'>{data.promoCode.error}</FormErrorMessage>
                            </FormControl>
                            <Button 
                                onClick={onApplyOrRemovePromoCode} 
                                isLoading = {data.loading == 'PROMO_CODE'}
                                width={'fit-content'} h = '40px'
                                bg = {data.promoCode.isApplied ? 'brand.gray' : 'brand.darkViolet'}
                                color = 'white' _hover = {{}} _focus={{}}
                            >
                                {data.promoCode.isApplied ? 'EDIT' : 'APPLY'}
                            </Button>
                        </Flex> */}

                        <FormControl isInvalid = {data.PICName.error != null}>
                            <FormLabel>Person In Charge Name (PCN)</FormLabel>
                            <InputGroup>
                                <Input
                                    name = 'person_in_charge_name'
                                    value = {data.PICName.value}
                                    onChange = {onChangePICName}
                                    placeholder="ex. John Smith" 
                                />
                                <InputRightElement h = '100%'>
                                    <Icon as = {PICNameIcon} h = 'auto' w = 'auto' />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage ml = '10px'>{data.PICName.error}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid = {data.PICID.error != null}>
                            <FormLabel>Person In Charge IC (PIC)</FormLabel>
                            <InputGroup>
                                <Input
                                    name = 'person_in_charge_ic'
                                    value = {data.PICID.value}
                                    onChange = {onChangePICID}
                                    placeholder="ex. MY12367" 
                                />
                                <InputRightElement h = '100%'>
                                    <Icon as = {PICIDIcon} h = 'auto' w = 'auto' />
                                </InputRightElement>
                            </InputGroup>
                            <FormErrorMessage ml = '10px'>{data.PICID.error}</FormErrorMessage>
                        </FormControl>

                        <FormControl isInvalid = {data.insStartDate.error}>
                            <FormLabel>Insurance Start Date</FormLabel>
                            <DateInput 
                                fieldName = "ins_start_date_input"
                                currentDate={convertStringToDate(data.insStartDate.value)} 
                                onChange={(newDate) => onChangeInsStartDate({ target: { value: convertDateToString(newDate) } } as ChangeEvent<HTMLInputElement>)}
                            />
                            {/* <InputGroup>
                                <Input value = {data.insStartDate.value} onChange = {onChangeInsStartDate} min = {formatDateToYyyyMmDd(new Date())} type = 'date' placeholder = "Choose" />
                            </InputGroup> */}
                            <FormErrorMessage ml = '10px'>Insurance start date is required!</FormErrorMessage>
                        </FormControl>

                        <Flex direction={'column'} gap = '15px'>
                            <Text fontSize={'16px'} color = 'brand.text' fontWeight={'bold'}>Have You Suffered Any Loss or Any Insurance Claim at the Insured Premises in the Past 3 Years?</Text>
                            <Flex gap = '15px' {...previouslyClaimedRadioGroup}>
                                <RadioCard {...getPreviouslyClaimedRadioProps({ value: 'yes' })} isChecked = {data.previouslyClaimed.isClaimed == true} width = {'100px'}>
                                    Yes
                                </RadioCard>
                                <RadioCard {...getPreviouslyClaimedRadioProps({ value: 'No' })} isChecked = {data.previouslyClaimed.isClaimed == false} width = {'100px'}>
                                    No
                                </RadioCard>
                            </Flex>
                            {
                                data.previouslyClaimed?.isClaimed &&
                                <Flex gap = '10px' alignItems={'center'}>
                                    <Flex w = '100%' p = '10px' bg = 'brand.bgColor' borderRadius={'3px'}>Number of Claims - {data.claimInfoList.length}</Flex>
                                    <IconButton onClick={onClickEditClaimInfo} variant = {'unstyled'} _hover={{bg: 'gray.100'}} isRound aria-label = 'edit_claims' icon = {<Icon  w = 'auto' h = 'auto' minW = '45px' minH = '45px' as = {EditIcon} />} />
                                </Flex>
                            }
                            {
                                data.previouslyClaimed.error &&
                                <Alert mt = '20px' status='error' borderRadius={'8px'}>
                                    <AlertIcon />
                                    {`Please select "Yes" or "No."`}
                                </Alert>
                            }
                        </Flex>
                        
                        <Flex mt = '20px' w = '100%' direction={'column'} flexWrap={'wrap'} gap ='15px'>
                            <Button onClick = {e => onClickSubmit('PROCEED')} isLoading = {data.loading == 'PROCEED'} w = '100%' bg = 'brand.secondary' color = 'white' _hover = {{}} _focus={{}}>PROCEED TO PURCHASE</Button>
                            <Flex gap = '15px'>
                                <Button w = '35%' onClick = {onClickBack} bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>BACK</Button>
                                <Button flexGrow={1} onClick = {e => onClickSubmit('EMAIL_QUOTE')} isLoading = {data.loading == 'EMAIL_QUOTE'} bg = 'brand.darkViolet' color = 'white' _hover = {{}} _focus={{}} whiteSpace={'pre-wrap'}>EMAIL ME A QUOTE</Button>
                            </Flex>
                        </Flex>

                    </Flex>
                    
                </Flex>
            }
        </Flex>
    );
}

export default Summary;

interface EmailQuotePopupProps {
    isOpen: boolean,
    onClose: () => void
}
 
const EmailQuotePopup = ({ isOpen, onClose }: EmailQuotePopupProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'12px'} maxW = {['90%', '90%', '38rem', '38rem', '38rem']}>
                <ModalBody py ={['40px', '40px', '0px', '0px', '0px']} >
                    <Flex p = {['0px', '0px', '30px', '30px', '30px']} direction={'column'} gap = '20px' alignItems={'center'}>
                        <Flex ml = '30px' position={'relative'} w = '120px' h = '120px'>
                            <Image src='/icons/quote-sent.svg' fill style = {{ objectFit: 'contain' }} alt={"quate_submit_in_process_image"} />
                        </Flex>
                        <Heading textAlign={'center'} color = 'brand.primary' fontSize={'16px'}>Your Quote has been sent to your email.</Heading>
                        <Button my = '20px' onClick = {onClose} w = '250px' bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>Close</Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

interface RadioCardProps extends UseRadioProps {
    children: ReactNode;
    width?: string | string[]
    height?: string | string[]
}

const RadioCard = ({ width = '100%', height = '40px', ...restProps }: RadioCardProps) => {
    const { getInputProps, getRadioProps } = useRadio(restProps)
  
    const input = getInputProps()
    const checkbox = getRadioProps()
  
    return (
      <Flex 
        w = {width} minH = {height}
        flexShrink={0}
        p = '10px' as='label' cursor='pointer'
        opacity = {restProps.isDisabled ? '0.6' : 'auto'}
        bg = {restProps.isChecked ? 'brand.secondary' : 'white'}
        color = {!restProps.isChecked ? 'black' : 'white'} 
        border = {!restProps.isChecked ? '1px' : '0px'} 
        borderRadius = {'6px'}
        borderColor={'brand.borderColor'}
    >
        <input {...input} />
        <Flex {...checkbox} m = 'auto' textAlign={'center'}>
            {restProps.children}
        </Flex>
      </Flex>
    )
}

interface QutoeClaimInfoProcessPopupProps {
    isOpen: boolean,
    onClose: () => void
}
 
const QutoeClaimInfoProcessPopup = ({ isOpen, onClose }: QutoeClaimInfoProcessPopupProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'12px'} maxW = {['90%', '90%', '38rem', '38rem', '38rem']}>
                <ModalBody py ={['40px', '40px', '0px', '0px', '0px']} >
                    <Flex p = {['0px', '0px', '30px', '30px', '30px']} direction={'column'} gap = '30px' alignItems={'center'}>
                        <Flex m = 'auto' position={'relative'} w = '100px' h = '100px'>
                            <Image src='/icons/Doc-processing.svg' fill style = {{ objectFit: 'contain' }} alt={"quate_submit_in_process_image"} />
                        </Flex>
                        <Heading textAlign={'center'} color = 'brand.primary' fontSize={'16px'}>We have received your request and we need more information and time to process your Insurance Application.</Heading>
                        <Text textAlign={'center'} color = 'brand.primary' fontSize={'14px'}>
                            Our friendly relationship manager will contact you shortly to work with you on your case. Should you have any queries, do call us at our hotline or whatsapp our friendly consultants at
                            <Text as = 'span' fontWeight={'bold'} fontSize={'16px'}> +60 1253 60700</Text>
                        </Text>
                        <Button onClick = {onClose} h = '40px' w = '250px' bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>Close</Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

