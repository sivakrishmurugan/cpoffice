"use client"
import { PROTECTION_AND_LIABILITY_COVERAGE as coverageContent } from '@/components/app/app_constants';
import { useClient, useLocalStorage, useSessionStorage } from "@/components/hooks";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BottomActions from "@/components/bottom_actions";
import { useRouter } from "next/navigation";
import { NextPage } from "next";
import Image from 'next/image';
import { SelectedCoverage } from '@/components/types';
import axiosClient from '@/components/axios';
import useCoverage from '@/components/hooks/use_coverage';


const PRotectionAndLiabilityCoverage: NextPage<{}> = ({}) => {
    const [localData, setLocalData] = useLocalStorage('clinic_form_data', null);
    const { isLoading, coveragesData, updateDataWithNewQuoteId } = useCoverage(localData?.quoteId);
    const [isAdded, setAdded] = useState((localData?.selectedOptionalCoverages?.findIndex(e => e.id == coverageContent.id) ?? -1) > -1)
    type ErrorType = { noCoverage: boolean, fieldErrors: { id: string, field_1: boolean, field_2?: boolean }[] }
    const [errors, setErrors] = useState<ErrorType>({ noCoverage: false, fieldErrors: [] });
    const [submitLoading, setSubmitLoading] = useState(false);
    const isClient = useClient();
    const router = useRouter();

    useEffect(() => {
        if(localData == null || localData?.quoteId == null || localData?.quoteId == '') router.replace('/');
    }, [localData, router])

    const onClickAddOrRemove = () => {
        setAdded(prev => !prev)
    }

    const onClickNext = async () => {
        if(localData) {
            setSubmitLoading(true)
            let localOptionalCoverages = localData.selectedOptionalCoverages ?? [];
            const isAlreadyAdded = localOptionalCoverages.findIndex(e => e.id == coverageContent.id) > -1;
            if(isAdded && isAlreadyAdded == false) {
                localOptionalCoverages.push({ id: coverageContent.id })
            } else if(isAdded != true && isAlreadyAdded) {
                localOptionalCoverages= localOptionalCoverages.filter(e => e.id != coverageContent.id)
            }
            try {
                const res = await axiosClient.post('/api/clinicshield/setoptcoverage', {
                    QuoteID: localData.quoteId,
                    OptCoverage: JSON.stringify(localOptionalCoverages)
                });
                if(res && res.data && res.data[0]) {
                    if(res.data?.[0]?.Success == 1) {
                        setLocalData({ ...localData, selectedOptionalCoverages: localOptionalCoverages })
                        router.push('/summary');
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
    }

    const onClickBack = () => {
        router.push('/optional_coverage');
    }

    return (
        <Flex w = '100%' direction={'column'} gap = '10px'  py = '20px'>
            <Heading as = 'h1' ml = '20px' my = '20px' fontSize={'23px'}>Optional Coverage</Heading>
            {
                isClient && <Flex 
                    w = '100%' 
                    minH = '150px' 
                    bg = {'white'}
                    gap = '30px'
                    borderRadius={'10px'}
                    direction={['column', 'column', 'column', 'row', 'row']}
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
                    <Flex w = {['100%', '100%', '100%', '80%', '80%']} direction={'column'}>
        
                        <Flex w = '100%' gap = '35px' alignItems={'center'}>
                            <Flex position={'relative'} flexShrink={0} w = {['40px', '40px', '80px', '80px', '80px']} h = {['40px', '40px', '80px', '80px', '80px']}>
                                <Image src={coverageContent.icon} alt={'Coverage Icon'} fill />
                            </Flex>
                            <Heading as = {'h1'} fontSize={'23px'}>{coverageContent.name}</Heading>
                        </Flex>
                        
                        <Flex my = '20px' w = {'calc(100% + 40px)'} ml = '-20px' display={['flex', 'flex', 'none', 'none', 'none']} h ='1px' bg = 'brand.borderColor'></Flex>
        
                        <Flex mt = {['0px', '0px', '60px', '60px', '60px']} minH = '200px' w = {['100%', '100%', '100%', '90%', '80%']} gap = {'20px'} direction={['column', 'column', 'column', 'row', 'row']}>
        
                            <Flex w = {'100%'} direction={'column'} gap = {['20px', '20px', '30px', '30px', '30px']}>
                                <Flex gap = '15px' direction={'column'}>
                                    {
                                        coverageContent.contents.map(item => {
                                            return <Flex key = {item.title} direction={'column'} gap = '10px'>
                                                <Heading as = 'h3' fontSize={'16px'} color = 'brand.text'>{item.title}</Heading>
                                                {
                                                    item.contents.map(content => {
                                                        const shouldWrappedContents = content.split('\n');
                                                        if(shouldWrappedContents.length > 1) {
                                                            return <Flex key = {content} direction={'column'}>
                                                                {
                                                                    shouldWrappedContents.map(e => {
                                                                        return <Text key = {e} fontSize={'14px'} color = 'brand.text'>{e}</Text>
                                                                    })
                                                                }
                                                            </Flex>
                                                        }
                                                        return <Text mb = {'10px'} key = {content} fontSize={'14px'} color = 'brand.text'>{content}</Text>;
                                                    })
                                                }
                                            </Flex>
                                        })
                                    }
                                </Flex>
                            </Flex>

                        </Flex>
                    </Flex>
        
                    <Flex minW = '260px' w = {['100%', '100%', '100%', '20%', '20%']} gap = '30px' direction={'column'}>
                        <Flex 
                            position={'sticky'} top = {'100px'} 
                            minH = {['0px', '0px', '250px', '250px', '250px']}
                            direction = {'column'}
                            borderRadius={'8px'} 
                            border = '1px solid #e1e1e1' 
                            boxShadow={'0 2px 5px rgba(0, 0, 0, .07)'} 
                            p = '20px 20px 15px'
                            gap = '20px'
                            backgroundImage = {'/icons/pre-Circle.svg'}
                            backgroundPosition = {'100% 0'}
                            backgroundSize = {'auto'}
                            backgroundRepeat = {'no-repeat'}
                            justifyContent={'space-between'}
                        >
                            <Text color = '#4a4a4a' fontSize = {'16px'} fontWeight={'bold'}>PREMIUM</Text>
                            <Flex w = '100%' gap = '10px' direction={'column'}>
                                <Text fontSize={'14px'} color = 'brand.text'>{coverageContent.premiumLabel}</Text>
                                <Heading textAlign={'end'} as = 'h1' fontSize={'24px'}>RM {coverageContent.premuimAmount}</Heading>
                            </Flex>
                        </Flex>
                        <Button 
                            onClick={onClickAddOrRemove} 
                            w = '100%'
                            bg={isAdded ? 'brand.gray' : "brand.primary"} color = 'white' 
                            _hover = {{}} _focus={{}}
                            position={'sticky'} top = {'380px'} 
                        >
                            {isAdded ? 'REMOVE' : 'ADD'}
                        </Button>
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
                        bg = {isAdded ? 'brand.secondary' : 'brand.green'}
                        color = 'white' _hover = {{}} _focus={{}}
                    >
                        {isAdded ? 'NEXT' : 'SKIP'}
                    </Button>
                </BottomActions>
            }
        </Flex>
    );
}

export default PRotectionAndLiabilityCoverage;