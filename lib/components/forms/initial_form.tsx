"use client"
import { Checkbox, Flex, FormControl,Text,  FormErrorMessage, FormLabel, Icon, Input, InputGroup, InputRightElement, Select, Link, Button, Alert, AlertIcon, UnorderedList, ListItem, Modal, ModalOverlay, ModalContent, ModalBody, Heading, InputLeftElement, Spinner } from "@chakra-ui/react";
import { IcEmail, IcMobile, IcLocationPin, IcClinic, PICNameIcon, PICIDIcon } from "../../icons";
import useSessionStorage from "../../hooks/use_sessionstorage";
import { CONSTRUCTION_TYPES, FLOOR_LEVEL } from "../../app/app_constants";
import useLocalStorage from "../../hooks/use_localstorage";
import { convertClinicQuoteResDataToLocalStateData, getNumberFromString, getRedirectRouteBasedOnQuote, setAuthToken } from "../../utlils/utill_methods";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { coveragesData } from "../../utlils/mocks";
import { DigitInput } from "../inputs";
import NextLink from 'next/link';
import axios from "axios";
import { ClinicData, NecessaryBasicInfo } from "../../types";
import axiosClient from "../../utlils/axios";
import useCoverage from "../../hooks/use_coverage";
import AddressInput from "../inputs/address_input";

interface BasicInfoFormProps {
    quoteFromQuery: null | {
        quote: any,
        coverages: any,
        encryptedQuoteId: string,
        failedMessage: string | null | undefined
    }
}

const BasicInfoForm = ({ quoteFromQuery }: BasicInfoFormProps) => {
    const { isLoading, coveragesData, updateDataWithNewQuoteId, updateDataWithNewQuoteAndCoverages } = useCoverage();
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const [agreedWithTermsAndConditions, setAgreedWithTermsAndConditions] = useState(false);
    const [paymentRetryCount, setPaymentRetryCount] = useSessionStorage('payment_retry', 3);
    const [data, setData] = useState<NecessaryBasicInfo>({
        name: localData?.basic?.name ?? '',
        number: localData?.basic?.number ?? '',
        address: localData?.basic?.address ?? '',
        floorLevel: localData?.basic?.floorLevel ?? '',
        constructionType: localData?.basic?.constructionType ?? '',
        PICName: localData?.basic?.PICName ?? '',
        PICID: localData?.basic?.PICID ?? '',
        email: localData?.basic?.email ?? '',
        mobile: Number(((localData?.basic?.mobile ?? '000').toString()).slice(2))
    });
    const [errors, setErrors] = useState({
        name: false,
        number: false,
        mobile: false,
        address: false,
        floorLevel: false,
        constructionType: false,
        PICName: false,
        PICID: false,
        termsAndConditions: false,
        email: null as string | null,
    })
    const [submitErrors, setSubmitErrors] = useState<string[]>([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [redirectLoading, setRedirectLoading] = useState(quoteFromQuery?.encryptedQuoteId != null && quoteFromQuery?.encryptedQuoteId != '');
    const [popupDetails, setPopupDetails] = useState({
        popupFor: null as null |'QUOTE_EXIST' | 'FAILED' | 'ALREADY_PAID',
        content: '',
        quoteId: ''
    });
    const router = useRouter();
    
    useEffect(() => {
        setPaymentRetryCount(3);
        if(quoteFromQuery != null && quoteFromQuery.failedMessage == null && quoteFromQuery.quote != null && quoteFromQuery.encryptedQuoteId != null) {
            checkQuoteDataAndRedirect(quoteFromQuery.quote, quoteFromQuery.coverages, quoteFromQuery.encryptedQuoteId)
        } else {
            if(quoteFromQuery?.failedMessage != null && quoteFromQuery.failedMessage != '') {
                setPopupDetails({ popupFor: 'FAILED', content: quoteFromQuery.failedMessage, quoteId: quoteFromQuery?.encryptedQuoteId })
            }
            setRedirectLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quoteFromQuery])

    const checkQuoteDataAndRedirect = (quote: any, coverages: any, encryptedQuoteId: string) => {
        const { convertedQuoteData } = updateDataWithNewQuoteAndCoverages(quote, coverages, encryptedQuoteId)
        const redirctTo = getRedirectRouteBasedOnQuote(convertedQuoteData);
        if(redirctTo == '/') {
            if(convertedQuoteData?.isPaid == true) {
                updateLocalDataToState(convertedQuoteData)
                setPopupDetails({ popupFor: 'ALREADY_PAID', content: 'Quote has been already paid!', quoteId: '' })
            }
            setRedirectLoading(false)
            return ;
        }
        router.push(redirctTo);
    }

    const updateLocalDataToState = (localData: ClinicData | null) => {
        setData({
            name: localData?.basic?.name ?? '',
            number: localData?.basic?.number ?? '',
            address: localData?.basic?.address ?? '',
            floorLevel: localData?.basic?.floorLevel ?? '',
            constructionType: localData?.basic?.constructionType ?? '',
            PICName: localData?.basic?.PICName ?? '',
            PICID: localData?.basic?.PICID ?? '',
            email: localData?.basic?.email ?? '',
            mobile: Number(((localData?.basic?.mobile ?? '000').toString()).slice(2))
        })
    }

    const validateEmail = (email: string) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        ) != null;
    };

    const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, name: event.target.value }));

        if(event.target.value == '' && errors.name == false) {
            setErrors(prev => ({ ...prev, name: true }))
        }
        if(event.target.value != '' && errors.name == true) {
            setErrors(prev => ({ ...prev, name: false }))
        }
    }

    const onChangeNumber = (event: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, number: event.target.value }));

        if(event.target.value == '' && errors.number == false) {
            setErrors(prev => ({ ...prev, number: true }))
        }
        if(event.target.value != '' && errors.number == true) {
            setErrors(prev => ({ ...prev, number: false }))
        }
    }

    const onChangeAddress = (value: string) => {
        setData(prev => ({ ...prev, address: value }));

        if(value == '' && errors.address == false) {
            setErrors(prev => ({ ...prev, address: true }))
        }
        if(value != '' && errors.address == true) {
            setErrors(prev => ({ ...prev, address: false }))
        }
    }

    const onChangeFloor = (event: ChangeEvent<HTMLSelectElement>) => {
        setData(prev => ({ ...prev, floorLevel: event.target.value }));

        if(event.target.value == '' && errors.floorLevel == false) {
            setErrors(prev => ({ ...prev, floorLevel: true }))
        }
        if(event.target.value != '' && errors.floorLevel == true) {
            setErrors(prev => ({ ...prev, floorLevel: false }))
        }
    }

    const onChangeConstructionType = (event: ChangeEvent<HTMLSelectElement>) => {
        setData(prev => ({ ...prev, constructionType: event.target.value }));

        if(event.target.value == '' && errors.constructionType == false) {
            setErrors(prev => ({ ...prev, constructionType: true }))
        }
        if(event.target.value != '' && errors.constructionType == true) {
            setErrors(prev => ({ ...prev, constructionType: false }))
        }
    }

    const onChangePICName = (event: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, PICName: event.target.value }));

        if(event.target.value == '' && errors.PICName == false) {
            setErrors(prev => ({ ...prev, PICName: true }))
        }
        if(event.target.value != '' && errors.PICName == true) {
            setErrors(prev => ({ ...prev, PICName: false }))
        }
    }

    const onChangePICID = (event: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, PICID: event.target.value }));

        if(event.target.value == '' && errors.PICID == false) {
            setErrors(prev => ({ ...prev, PICID: true }))
        }
        if(event.target.value != '' && errors.PICID == true) {
            setErrors(prev => ({ ...prev, PICID: false }))
        }
    }

    const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        const email = event.target.value;
        const isValid = validateEmail(email);
        setData(prev => ({ ...prev, email: email }));

        if((email == '' || isValid == false) && errors.email == null) {
            setErrors(prev => ({ ...prev, email: email == '' ? 'Email is requried!' : isValid == false ? 'Invalid email format!' : null}))
        }
        if(email != '' && isValid && errors.email != null) {
            setErrors(prev => ({ ...prev, email: null }))
        }
    }

    const onChangeMobile = (event: ChangeEvent<HTMLInputElement>) => {
        let value: null | number = 0;
        if(event.target.value != '') { value = getNumberFromString(event.target.value) ?? 0 }
        value = Math.trunc(value);
        
        setData(prev => ({ ...prev, mobile: value as number }));

        if(value < 1 && errors.mobile == false) {
            setErrors(prev => ({ ...prev, mobile: true }))
        }
        if(value > 0 && errors.mobile == true) {
            setErrors(prev => ({ ...prev, mobile: false }))
        }
    }

    const onToggleTermsAndConditionCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setAgreedWithTermsAndConditions(isChecked);

        if(isChecked == false && errors.termsAndConditions == false) {
            setErrors(prev => ({ ...prev, termsAndConditions: true }))
        }
        if(isChecked && errors.termsAndConditions == true) {
            setErrors(prev => ({ ...prev, termsAndConditions: false }))
        }
    }

    const updateLocalData = (info: NecessaryBasicInfo, quoteId: string) => {
        setLocalData({
            quoteId,
            basic: info,
            selectedCoverages: [],
            selectedOptionalCoverages: [],
            selectedInsType: null,
            promoCode: '',
            promoCodePercentage: null,
            insStartDate: '',
            claimDeclaration: {
                previouslyClaimed: false,
                addtionalInfo: []
            },
            isPaid: false,
            paymentApproved: false
        })
    }

    const validate = () => {
        const tempErrors: typeof errors = JSON.parse(JSON.stringify(errors));
        const tempSubmitErrors: string[] = [];
        tempErrors.name = data.name.trim() == '';
        tempErrors.number = data.number.trim() == '';
        tempErrors.address = data.address.trim() == '';
        tempErrors.floorLevel = data.floorLevel.trim() == '';
        tempErrors.constructionType = data.constructionType.trim() == '';
        tempErrors.email = data.email.trim() == '' ? 'Email is required!' : validateEmail(data.email) == false ? 'Invalid email format!' : null;
        tempErrors.mobile = data.mobile < 0;
        tempErrors.termsAndConditions = agreedWithTermsAndConditions != true;

        if(tempErrors.termsAndConditions) {
            tempSubmitErrors.push('You should agree with the terms and conditions and privacy policy');
        }

        setErrors(tempErrors);
        setSubmitErrors(tempSubmitErrors);
        return Object.values(tempErrors).some(e => e == true || typeof e == 'string') || tempSubmitErrors.length > 0;
    }

    const onClickGetStarted = async (event:  React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(validate()) return ;
        setSubmitLoading(true);
        try {
            const res = await axiosClient.post('/api/clinicshield/clinicinfo', {
                ClinicNumber: data.number,
                ClinicName: data.name,
                Email: data.email,
                Phone: "60" + data.mobile.toString(),
                Floor: data.floorLevel.toString(),
                CType: data.constructionType,
                PICName: data.PICName,
                PICID: data.PICID,
                ClinicAddress: data.address,
                QuoteID: localData?.quoteId && localData?.quoteId != '' ? localData?.quoteId : null,
            }, { headers: { secretkey: process.env.NEXT_PUBLIC_API_SECRET_KEY } });
            if(res && res.data && res.data[0]) {
                if(res.data?.[0]?.Success == 1) {
                    setAuthToken(res.data?.[0]?.authToken);
                    updateLocalData(data, res.data?.[0]?.QuoteID);
                    const { convertedQuoteData } = await updateDataWithNewQuoteId(res.data?.[0]?.QuoteID)
                    const redirctTo = getRedirectRouteBasedOnQuote(convertedQuoteData);
                    if(redirctTo == '/' && convertedQuoteData?.isPaid == true) {
                        setPopupDetails({ popupFor: 'ALREADY_PAID', content: 'Quote has been already paid!', quoteId: '' })
                    } else {
                        router.push('/coverage');
                    }
                } else if(res.data?.[0].Success == 0 && res.data?.[0]?.EQuoteID != null && res.data?.[0]?.EQuoteID != '') {
                    setPopupDetails({ popupFor: 'QUOTE_EXIST', content: res.data[0]?.Result, quoteId: res?.data[0]?.EQuoteID })
                } else if(res.data?.[0]?.Success == 0) {
                    setSubmitErrors([
                        res.data?.[0]?.Result
                    ]);
                }
            }
        } catch(e) {}
        setSubmitLoading(false);
    }

    const onClickClosePopup = () => {
        if(popupDetails.popupFor == 'ALREADY_PAID') {
            // clear sesssion data
            setLocalData(null);
        }
        setPopupDetails({ popupFor: null, content: '', quoteId: '' })
    }

    const onClickOkQuoteExistPopup = async () => {
        updateLocalData(data, popupDetails.quoteId)
        const { convertedQuoteData } = await updateDataWithNewQuoteId(popupDetails.quoteId)
        const redirctTo = getRedirectRouteBasedOnQuote(convertedQuoteData);
        if(redirctTo == '/' && convertedQuoteData?.isPaid == true) {
            setPopupDetails({ popupFor: 'ALREADY_PAID', content: 'Quote has been already paid!', quoteId: '' })
        } else {
            router.push('/coverage');
            setPopupDetails({ popupFor: null, content: '', quoteId: '' })
        }  
    }

    const isSubmitDisabled = Object.values(errors).some(e => e == true || typeof e == 'string');
    
    return (
        <Flex w = '100%' direction={'column'} gap = '20px'>
            <Flex display={redirectLoading ? 'flex' : 'none'} position={'fixed'} left = {0} top = {0} w = '100vw' h = '100vh' bg = 'rgba(255, 255, 255, 0.7)' zIndex={9999} justifyContent={'center'} alignItems={'center'}>
                <Spinner thickness="3px" size={'xl'} color = 'brand.secondary' />
            </Flex>

            <QuoteExistPopup 
                isOpen = {popupDetails.popupFor == 'QUOTE_EXIST'}
                onClose = {onClickClosePopup}
                onClickOk = {onClickOkQuoteExistPopup}
                content = {popupDetails.content}
            />

            <QuotePaidPopup 
                isOpen = {popupDetails.popupFor == 'ALREADY_PAID'}
                onClose = {onClickClosePopup}
                content = {popupDetails.content}
            />

            <QuoteFailedPopup
                isOpen = {popupDetails.popupFor == 'FAILED'}
                onClose = {onClickClosePopup}
                content = {popupDetails.content} 
            />
            <form onSubmit={onClickGetStarted}>
                <Flex w = '100%' direction={'column'} gap = '20px'>
                
                    <FormControl isInvalid = {errors.name}>
                        <FormLabel>Registered Clinic Name</FormLabel>
                        <InputGroup>
                            <Input 
                                value = {data.name}
                                onChange = {onChangeName}
                                placeholder="ex. International Clinic" 
                            />
                            <InputRightElement h = '100%'>
                                <Icon as = {IcClinic} w = 'auto' h = 'auto' />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage ml = '10px'>Clinic name is required!</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.number}>
                        <FormLabel>Registered Clinic Number</FormLabel>
                        <InputGroup>
                            <Input 
                                name = 'clinic_number'
                                value = {data.number}
                                onChange = {onChangeNumber}
                                placeholder="ex. MY12367" 
                            />
                            <InputRightElement h = '100%'>
                                <Icon as = {IcClinic} h = 'auto' w = 'auto' />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage ml = '10px'>Clinic number is requried!</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.address}>
                        <FormLabel>Clinic Address</FormLabel>
                        <AddressInput 
                            currentValue = {data.address}
                            onChange={onChangeAddress}
                        />
                        <FormErrorMessage ml = '10px'>Address is required!</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.floorLevel || errors.constructionType}>
                        <Flex gap = '10px' alignItems={'flex-end'}>
                            <FormControl maxW = '200px' w = '40%' isInvalid = {errors.floorLevel}>
                                <FormLabel>Floor Level</FormLabel>
                                <Select 
                                    value = {data.floorLevel}
                                    onChange = {onChangeFloor}
                                    placeholder="Select one..."
                                >
                                    {
                                        FLOOR_LEVEL.map(e => {
                                            return <option key = {e.id} value = {e.id}>{e.value}</option>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl isInvalid = {errors.constructionType}>
                                <FormLabel>Construction Type</FormLabel>
                                <Select 
                                    value = {data.constructionType}
                                    onChange = {onChangeConstructionType}
                                    placeholder="Select one..."
                                >
                                    {
                                        CONSTRUCTION_TYPES.map(e => {
                                            return <option key = {e.id} value = {e.id}>{e.value}</option>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Flex>
                        <FormErrorMessage ml = '10px'>Both floor level and construction type is requried!</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.PICName}>
                        <FormLabel>Person In charge Name</FormLabel>
                        <InputGroup>
                            <Input
                                name = 'person_in_charge_name'
                                value = {data.PICName}
                                onChange = {onChangePICName}
                                placeholder="ex. John Smith" 
                            />
                            <InputRightElement h = '100%'>
                                <Icon as = {PICNameIcon} h = 'auto' w = 'auto' />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage ml = '10px'>Person In charge Name is requried!</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.PICID}>
                        <FormLabel>Person In charge IC</FormLabel>
                        <InputGroup>
                            <Input
                                name = 'person_in_charge_ic'
                                value = {data.PICID}
                                onChange = {onChangePICID}
                                placeholder="ex. MY12367" 
                            />
                            <InputRightElement h = '100%'>
                                <Icon as = {PICIDIcon} h = 'auto' w = 'auto' />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage ml = '10px'>Person In charge IC</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.email != null}>
                        <FormLabel>Email id</FormLabel>
                        <InputGroup>
                            <Input
                                name = 'email'
                                value = {data.email}
                                onChange = {onChangeEmail}
                                placeholder="johnsmith@gmail.com" 
                            />
                            <InputRightElement h = '100%'>
                                <Icon as = {IcEmail} h = 'auto' w = 'auto' />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage ml = '10px'>{errors.email}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.mobile}>
                        <FormLabel>Mobile Number</FormLabel>
                        <InputGroup>
                            <InputLeftElement h = '100%' ml = '5px'>+60</InputLeftElement>
                            <DigitInput 
                                currentValue = {data.mobile}
                                onChange = {onChangeMobile}
                                forceUpdateOnValueChange
                                emptyOnZero
                                inputProps = {{ placeholder: '1234 56789', pl: '42px' }}
                            />
                            <InputRightElement h = '100%'>
                                <Icon as = {IcMobile} h = 'auto' w = 'auto' />
                            </InputRightElement>
                        </InputGroup>
                        <FormErrorMessage ml = '10px'>Mobile number is required!</FormErrorMessage>
                    </FormControl>

                    <Flex gap = '10px' alignItems={'flex-start'}>
                        <Checkbox isInvalid = {errors.termsAndConditions} isChecked = {agreedWithTermsAndConditions} onChange = {onToggleTermsAndConditionCheckbox} mt = '3px' boxShadow={'none'} borderColor = 'brand.borderColor' id = 'checkbox' colorScheme='blue' size = 'lg' />
                        <Text as = {'label'} htmlFor = 'checkbox' cursor={'pointer'}>
                            <span>I understand and agree to the </span>
                            <span>
                                <Link as = {NextLink} href = {'/terms_of_use'} color='#040431' textDecoration={'underline'} fontWeight={'bold'} isExternal>Terms and Conditions</Link>
                            </span>
                            <span>, </span>
                            <span>
                                <Link as = {NextLink} href = {'/privacy_policy'} color='#040431' textDecoration={'underline'} fontWeight={'bold'} isExternal> Privacy Policy</Link>
                            </span>
                            <span> and I meet all local regulation.</span>
                        </Text>
                    </Flex>

                    {
                        submitErrors && submitErrors.length > 0 &&
                        <Alert mt = '20px' status='error' borderRadius={'8px'}>
                            <Flex direction={'column'} gap = '10px'>
                                <Flex fontWeight={'bold'}>
                                    <AlertIcon />
                                    Error
                                </Flex>
                                <UnorderedList ml = '50px'>
                                    {
                                        submitErrors.map(e => {
                                            return <ListItem key = {e}>{e}</ListItem>
                                        })
                                    }
                                </UnorderedList>
                            </Flex>
                        </Alert>
                    }

                    <Button isLoading = {submitLoading} isDisabled = {isSubmitDisabled} type = 'submit' mt = '10px' bg = {'brand.secondary'} color = 'white' _hover = {{}} _focus={{}}>GET STARTED</Button>
                </Flex>
            </form>
        </Flex>
    );
}

export default BasicInfoForm;

interface QuoteExistPopupProps {
    content: string | JSX.Element,
    isOpen: boolean,
    onClose: () => void,
    onClickOk: () => void
}
 
const QuoteExistPopup = ({ content, isOpen, onClose, onClickOk }: QuoteExistPopupProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'12px'} maxW = {['90%', '90%', '38rem', '38rem', '38rem']}>
                <ModalBody py ={['40px', '40px', '0px', '0px', '0px']} >
                    <Flex p = {['0px', '0px', '30px', '30px', '30px']} direction={'column'} gap = {['20px', '20px', '30px', '30px', '30px']} alignItems={'center'}>
                        <Heading textAlign={'center'} color = 'brand.primary' fontSize={'16px'}>{content}</Heading>
                        <Text textAlign={'center'} color = 'brand.primary' fontSize={'14px'}>
                           Quote ID already exist. Are you sure you want to continue with existing quote?
                        </Text>
                        <Flex gap = '20px'>
                            <Button onClick = {onClose} h = '40px' w = {['100px', '150px', '250px', '250px', '250px']} bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>Close</Button>
                            <Button onClick = {onClickOk} h = '40px' w = {['100px', '150px', '250px', '250px', '250px']} bg = 'brand.secondary' color = 'white' _focus={{}} _hover={{}}>Continue</Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

interface QuotePaidPopupProps {
    content: string | JSX.Element,
    isOpen: boolean,
    onClose: () => void
}
 
const QuotePaidPopup = ({ content, isOpen, onClose }: QuotePaidPopupProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'12px'} maxW = {['90%', '90%', '38rem', '38rem', '38rem']}>
                <ModalBody py ={['40px', '40px', '0px', '0px', '0px']} >
                    <Flex p = {['0px', '0px', '30px', '30px', '30px']} direction={'column'} gap = {['20px', '20px', '30px', '30px', '30px']} alignItems={'center'}>
                        <Heading textAlign={'center'} color = 'brand.primary' fontSize={'16px'}>{'Quote Already Paid!'}</Heading>
                        <Text textAlign={'center'} color = 'brand.primary' fontSize={'14px'}>
                           {content}
                        </Text>
                        <Flex gap = '20px'>
                            <Button onClick = {onClose} h = '40px' w = {['100px', '150px', '250px', '250px', '250px']} bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>Close</Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

interface QuoteFailedPopupProps {
    content: string | JSX.Element,
    isOpen: boolean,
    onClose: () => void
}
 
const QuoteFailedPopup = ({ content, isOpen, onClose }: QuoteFailedPopupProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'12px'} maxW = {['90%', '90%', '38rem', '38rem', '38rem']}>
                <ModalBody py ={['40px', '40px', '0px', '0px', '0px']} >
                    <Flex p = {['0px', '0px', '30px', '30px', '30px']} direction={'column'} gap = {['20px', '20px', '30px', '30px', '30px']} alignItems={'center'}>
                        <Heading textAlign={'center'} color = 'brand.primary' fontSize={'16px'}>{content}</Heading>
                        <Flex gap = '20px'>
                            <Button onClick = {onClose} h = '40px' w = {['100px', '150px', '250px', '250px', '250px']} bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>Close</Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}