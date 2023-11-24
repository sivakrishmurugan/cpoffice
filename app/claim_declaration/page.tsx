"use client"
import { Button, Flex, Heading, Modal, ModalBody, ModalContent, ModalOverlay, Text, UseRadioProps, useRadio, useRadioGroup } from "@chakra-ui/react";
import { useClient, useLocalStorage, useSessionStorage } from "@/components/hooks";
import { getNumberFromString, getRecentYears } from "@/components/utill_methods";
import { ClaimDeclarationAdditionalData } from "@/components/types";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import ClaimInfoForm from "@/components/forms/claim_info";
import BottomActions from "@/components/bottom_actions";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import Image from 'next/image';
import axiosClient from "@/components/axios";
import useCoverage from "@/components/hooks/use_coverage";

const getModifiedClaimInfoForLocalState = (info?: ClaimDeclarationAdditionalData) => {
    return {
        id: Math.random().toString(),
        type: { value: info?.type ?? 'Property', error: false },
        year: { value: info?.year ?? getRecentYears(1)[0], error: false },
        amount: { value: info?.amount ?? 0, error: false },
        description: { value: info?.description ?? '', error: false }
    }
}

const ClaimDeclaration: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useLocalStorage('clinic_form_data', null);
    const { isLoading, coveragesData, updateDataWithNewQuoteId } = useCoverage(localData?.quoteId);
    const[showProcessingPopup, setShowProcessingPopup] = useState(false);
    const [data, setData] = useState({
        previouslyClaimed: true,
        claimInfoList: [
            ...localData?.claimDeclaration?.addtionalInfo?.map(e => getModifiedClaimInfoForLocalState(e)) ?? [], 
            getModifiedClaimInfoForLocalState()
        ]
    })
    const [submitLoading, setSubmitLoading] = useState(false);
    const isClient = useClient();
    const router = useRouter();

    const { getRootProps: getPreviouslyClaimedRootProps, getRadioProps: getPreviouslyClaimedRadioProps } = useRadioGroup({
        name: 'previously_claimed_radio',
        onChange: (value: 'yes' | 'no') => {
            setData(prev => ({ 
                previouslyClaimed: value == 'yes',
                claimInfoList: prev.claimInfoList.map(e => {
                    e.amount.error = false;
                    e.type.error = false;
                    e.description.error = false;
                    e.year.error = false;
                    return e;
                })
            }))
        },
    });
    const previouslyClaimedRadioGroup = getPreviouslyClaimedRootProps();

    useEffect(() => {
        if(localData == null || localData?.quoteId == null || localData?.quoteId == '') router.replace('/');
    }, [localData, router])

    const onChangeClaimInfoValues = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>, field: 'type' | 'year' | 'amount' | 'desciption', index: number) => {
        const tempData: typeof data['claimInfoList'] = JSON.parse(JSON.stringify(data.claimInfoList));
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
                tempData[index].amount.value = value;
                tempData[index].amount.error = value < 1;
                break;
            }
        }
        setData(prev => ({ ...prev, claimInfoList: tempData }));
    }

    const onClickDeleteClaimRow = (index: number) => {
        setData(prev => ({ ...prev, claimInfoList: prev.claimInfoList.filter((_, i) => i != index) }))
    }

    const onClickAddRecord = () => {
        setData(prev => ({ ...prev, claimInfoList: [...prev.claimInfoList, getModifiedClaimInfoForLocalState()] }))
    }

    const stateToPayloadData = (stateData: typeof data): {
        previouslyClaimed: boolean,
        addtionalInfo: ClaimDeclarationAdditionalData[]
    } => {
        return {
            previouslyClaimed: stateData.previouslyClaimed,
            addtionalInfo: stateData.claimInfoList.map(e => {
                return {
                    type: e.type.value,
                    year: e.year.value,
                    amount: e.amount.value,
                    description: e.description.value
                }
            }),
        }
    }
    
    const validate = () => {
        const tempData: typeof data = JSON.parse(JSON.stringify(data));
        if(tempData.previouslyClaimed) {
            tempData.claimInfoList.forEach(e => {
                e.amount.error = e.amount.value < 1;
                e.type.error = e.type.value == '';
                e.year.error = e.year.value == '';
                e.description.error = e.description.value == '';
            })
        }
        setData(tempData);
        return tempData.claimInfoList.some(e => Object.values(e).some(value => typeof value == 'string' ? false : value.error))
    }

    const onClickNext = async () => {
        if(localData == null || validate()) return ;
        setSubmitLoading(true);
        try {
            const res = await axiosClient.post('/api/clinicshield/insertclaims', {
                QuoteID: localData.quoteId,
                ClaimDeclaration: data.previouslyClaimed ? JSON.stringify(data.claimInfoList.map(e => ({
                    ClaimType: e.type.value,
                    ClaimYear: e.year.value,
                    ClaimAmount: e.amount.value.toString(),
                    Description: e.description.value
                }))) : JSON.stringify([])
            });
            if(res && res.data && res.data[0]) {
                if(res.data?.[0]?.Success == 1) {
                    setLocalData({ ...localData, claimDeclaration: stateToPayloadData(data) })
                    setShowProcessingPopup(true)
                }
            } 
        } catch(e: any) {
            if(e?.response?.status == 401) {
                await updateDataWithNewQuoteId(localData?.quoteId);
                onClickNext()
            }
        }
        setSubmitLoading(false)
    }

    const onCloseProccessingPopup = () => {
        setShowProcessingPopup(false);
        router.replace('/')
    }

    const onClickBack = () => {
        if(localData) setLocalData({ ...localData, claimDeclaration: stateToPayloadData(data) })
        router.push('/summary');
    }

    return (
        <Flex w = '100%' direction={'column'} gap = '10px'  py = '20px'>
            <PaynowPopup 
                isOpen = {showProcessingPopup}
                onClose = {onCloseProccessingPopup}
            />
            {
                isClient && <Flex 
                    w = '100%' 
                    minH = '150px' 
                    bg = {'white'}
                    borderRadius={'10px'}
                    direction={'column'}
                    p = {[
                        '20px 20px',
                        '20px 20px',
                        '40px 30px 40px 40px',
                        '40px 30px 40px 40px',
                        '40px 30px 40px 40px',
                    ]}
                    boxShadow={'0 2px 8px rgba(0, 0, 0, .2)'}
                    color = 'brand.text'
                >

                    {/* Heading - Claim declaration */}
                    <Flex w = '100%' gap = '35px' alignItems={'center'}>
                        <Flex position={'relative'} flexShrink={0} w = {['40px', '40px', '80px', '80px', '80px']} h = {['40px', '40px', '80px', '80px', '80px']}>
                            <Image src={'/icons/icon-claim.svg'} alt={'Coverage Icon'} fill />
                        </Flex>
                        <Heading as = {'h1'} fontSize={'23px'}>Claim Declaration</Heading>
                    </Flex>

                    {/* Divider */}
                    <Flex my = '20px' w = {'calc(100% + 40px)'} ml = '-20px' display={['flex', 'flex', 'none', 'none', 'none']} h ='1px' bg = 'brand.borderColor'></Flex>

                    {/* Main content section */}
                    <Flex mt = {['0px', '0px', '40px', '40px', '40px']} ml = {['0px', '0px', '0px', '120px', '120px']} w = {['100%', '100%', '100%', '90%', '80%']} gap = {'40px'} direction={'column'}>

                        {/* Preiously claimed yes or no radio buttons */}
                        <Flex direction={'column'} gap = '15px'>
                            <Text fontSize={'16px'} color = 'brand.text' fontWeight={'bold'}>Have you suffered any loss or any insurance claim at the insured premises in the past 3 years?</Text>
                            <Flex gap = '15px' {...previouslyClaimedRadioGroup}>
                                <RadioCard {...getPreviouslyClaimedRadioProps({ value: 'yes' })} isChecked = {data.previouslyClaimed == true} width = {'100px'}>
                                    Yes
                                </RadioCard>
                                <RadioCard {...getPreviouslyClaimedRadioProps({ value: 'No' })} isChecked = {data.previouslyClaimed == false} width = {'100px'}>
                                    No
                                </RadioCard>
                            </Flex>
                        </Flex>

                        {/* Addtional information section */}
                        {
                            data.previouslyClaimed &&
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
                                        data.claimInfoList.map((item, index, array) => {
                                            return <ClaimInfoForm
                                                key = {item.id}
                                                isNotDeletable = {index == 0 && array.length == 1}
                                                values = {item}
                                                onChangeValue = {(e, field) => onChangeClaimInfoValues(e, field, index)}
                                                onClickDelete = {() => onClickDeleteClaimRow(index)}
                                            />
                                        })
                                    }
                                    
                                    <Button onClick={onClickAddRecord} mt = '20px' width={['100%', '100%', '100%', '130px', '130px']} variant={'outline'} fontSize={'14px'}>+ Add Record</Button>

                                </Flex>
                            </Flex>
                        }

                    </Flex>
                    
                </Flex>
            }
            {
                isClient &&
                <BottomActions>
                    <Button onClick = {onClickBack} width = {['100%', '100%', '250px', '250px', '250px']} minW = '150px' bg = 'brand.mediumViolet' color = 'white' _hover = {{}} _focus={{}}>BACK</Button>
                    <Button 
                        onClick = {onClickNext} 
                        isLoading = {submitLoading}
                        width = {['100%', '100%', '250px', '250px', '250px']} 
                        minW = '150px' 
                        bg = {'brand.secondary'}
                        color = 'white' _hover = {{}} _focus={{}}
                    >
                        PAY NOW
                    </Button>
                </BottomActions>
            }
        </Flex>
    );
}

export default ClaimDeclaration;

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
        borderRadius = {'8px'}
        borderColor={'brand.borderColor'}
    >
        <input {...input} />
        <Flex {...checkbox} m = 'auto' textAlign={'center'}>
            {restProps.children}
        </Flex>
      </Flex>
    )
}

interface PaynowPopupProps {
    isOpen: boolean,
    onClose: () => void
}
 
const PaynowPopup = ({ isOpen, onClose }: PaynowPopupProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'12px'} maxW = {['90%', '90%', '38rem', '38rem', '38rem']}>
                <ModalBody py ={['40px', '40px', '0px', '0px', '0px']} >
                    <Flex p = {['0px', '0px', '30px', '30px', '30px']} direction={'column'} gap = '30px' alignItems={'center'}>
                        <Flex m = 'auto' position={'relative'} w = '100px' h = '100px'>
                            <Image src='/icons/Doc-processing.svg' fill objectFit="contain" alt={"quate_submit_in_process_image"} />
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