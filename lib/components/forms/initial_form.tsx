"use client"
import { Checkbox, Flex, FormControl,Text,  FormErrorMessage, FormLabel, Icon, Input, InputGroup, InputRightElement, Select, Link, Button, Alert, AlertIcon, UnorderedList, ListItem, Modal, ModalOverlay, ModalContent, ModalBody, Heading, InputLeftElement, Spinner } from "@chakra-ui/react";
import { IcEmail, IcMobile, IcLocationPin, IcClinic, PICNameIcon, PICIDIcon } from "../../icons";
import useSessionStorage from "../../hooks/use_sessionstorage";
import { CONSTRUCTION_TYPES, FLOOR_LEVEL } from "../../app/app_constants";
import useLocalStorage from "../../hooks/use_localstorage";
import { convertClinicQuoteResDataToLocalStateData, getNumberFromString, getRedirectRouteBasedOnQuote, isContainsAlphabets, isContainsNumericCharacters, isContainsSpecialCharacters, setAuthToken } from "../../utlils/utill_methods";
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

const formFieldErrorMessages = {
    name: {
        required: 'Clinic name is required!',
        format: 'Clinic name should contains only alphabets and less than 200 characters'
    },
    number: {
        required: 'Clinic number is requried!',
        format: 'Clinic number should contains only alphabets, numbers and should be less than 200 characters!'
    },
    address: {
        required: 'Address is required!',
        format: 'Address cannot have more than 200 characters!'
    },
    PICName: {
        required: 'Person Incharge name is required!',
        format: 'Person Incharge name should contains only alphabets and less than 200 characters'
    },
    PICID: {
        required: 'Person Incharge IC is requried!',
        format: 'Person Incharge IC should contains only alphabets, numbers and should be less than 200 characters!'
    },
    email: {
        required: 'Email is required!',
        format: 'Invalid email format!'
    },
    mobile: {
        required: 'Mobile number is required!',
        format: 'Mobile number must contains only numbers and be no longer than 20 digits'
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
        name: null as null | string,
        number: null as null | string,
        mobile: null as null | string,
        address: null as null | string,
        floorLevel: false,
        constructionType: false,
        PICName: null as null | string,
        PICID: null as null | string,
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

    const validateField = (value: string, field: 'name' | 'number' | 'mobile' | 'address' | 'PICName' | 'PICID' | 'email' | 'mobile') => {
        switch(field) {
            case 'name': {
                return {
                    isEmpty: value == '',
                    isContainsFormatError: value.length > 200 || isContainsSpecialCharacters(value).isContain || isContainsNumericCharacters(value).isContain
                }
            }
            case 'number': {
                return {
                    isEmpty: value == '',
                    isContainsFormatError: value.length > 200 || isContainsSpecialCharacters(value).isContain
                }
            }
            case 'address': {
                return {
                    isEmpty: value == '',
                    isContainsFormatError: value.length > 200
                }
            }
            case 'PICName': {
                return {
                    isEmpty: value == '',
                    isContainsFormatError: value.length > 200 || isContainsSpecialCharacters(value).isContain || isContainsNumericCharacters(value).isContain
                }
            }
            case 'PICID': {
                return {
                    isEmpty: value == '',
                    isContainsFormatError: value.length > 200 || isContainsSpecialCharacters(value).isContain
                }
            }
            case 'email': {
                return {
                    isEmpty: value == '',
                    isContainsFormatError: value.length > 200 || validateEmail(value) == false
                }
            }
            case 'mobile': {
                return {
                    isEmpty: Number(value) < 1,
                    isContainsFormatError: value.length > 20 || isContainsSpecialCharacters(value).isContain || isContainsAlphabets(value).isContain
                }
            }
        }
    }

    const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value.trimStart();

        setData(prev => ({ ...prev, name: inputValue }));

        const { isEmpty, isContainsFormatError } = validateField(inputValue, 'name');
        const currentError = errors.name == null ? 'NO_ERROR' :  errors.name == formFieldErrorMessages.name.required ? 'REQUIRED' : 'FORMAT';

        if(isEmpty && currentError != 'REQUIRED') {
            setErrors(prev => ({ ...prev, name: formFieldErrorMessages.name.required }))
            return ;
        }

        if(isContainsFormatError && currentError != 'FORMAT') {
            setErrors(prev => ({ ...prev, name: formFieldErrorMessages.name.format }))
            return ;
        }
        
        if(isEmpty == false && isContainsFormatError == false && currentError != 'NO_ERROR') {
            setErrors(prev => ({ ...prev, name: null }))
        }
    }

    const onChangeNumber = (event: ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value.trimStart();

        setData(prev => ({ ...prev, number: inputValue }));

        const { isEmpty, isContainsFormatError } = validateField(inputValue, 'number');
        const currentError = errors.number == null ? 'NO_ERROR' :  errors.number == formFieldErrorMessages.number.required ? 'REQUIRED' : 'FORMAT';

        if(isEmpty && currentError != 'REQUIRED') {
            setErrors(prev => ({ ...prev, number: formFieldErrorMessages.number.required }))
            return ;
        }

        if(isContainsFormatError && currentError != 'FORMAT') {
            setErrors(prev => ({ ...prev, number: formFieldErrorMessages.number.format }))
            return ;
        }
        
        if(isEmpty == false && isContainsFormatError == false && currentError != 'NO_ERROR') {
            setErrors(prev => ({ ...prev, number: null }))
        }
    }

    const onChangeAddress = (value: string) => {
        let inputValue = value.trimStart();

        setData(prev => ({ ...prev, address: inputValue }));

        const { isEmpty, isContainsFormatError } = validateField(inputValue, 'address');
        const currentError = errors.address == null ? 'NO_ERROR' :  errors.address == formFieldErrorMessages.address.required ? 'REQUIRED' : 'FORMAT';

        if(isEmpty && currentError != 'REQUIRED') {
            setErrors(prev => ({ ...prev, address: formFieldErrorMessages.address.required }))
            return ;
        }

        if(isContainsFormatError && currentError != 'FORMAT') {
            setErrors(prev => ({ ...prev, address: formFieldErrorMessages.address.format }))
            return ;
        }
        
        if(isEmpty == false && isContainsFormatError == false && currentError != 'NO_ERROR') {
            setErrors(prev => ({ ...prev, address: null }))
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
        let inputValue = event.target.value.trimStart();

        setData(prev => ({ ...prev, PICName: inputValue }));

        const { isEmpty, isContainsFormatError } = validateField(inputValue, 'PICName');
        const currentError = errors.PICName == null ? 'NO_ERROR' :  errors.PICName == formFieldErrorMessages.PICName.required ? 'REQUIRED' : 'FORMAT';

        if(isEmpty && currentError != 'REQUIRED') {
            setErrors(prev => ({ ...prev, PICName: formFieldErrorMessages.PICName.required }))
            return ;
        }

        if(isContainsFormatError && currentError != 'FORMAT') {
            setErrors(prev => ({ ...prev, PICName: formFieldErrorMessages.PICName.format }))
            return ;
        }
        
        if(isEmpty == false && isContainsFormatError == false && currentError != 'NO_ERROR') {
            setErrors(prev => ({ ...prev, PICName: null }))
        }
    }

    const onChangePICID = (event: ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value.trimStart();

        setData(prev => ({ ...prev, PICID: inputValue }));

        const { isEmpty, isContainsFormatError } = validateField(inputValue, 'PICID');
        const currentError = errors.PICID == null ? 'NO_ERROR' :  errors.PICID == formFieldErrorMessages.PICID.required ? 'REQUIRED' : 'FORMAT';

        if(isEmpty && currentError != 'REQUIRED') {
            setErrors(prev => ({ ...prev, PICID: formFieldErrorMessages.PICID.required }))
            return ;
        }

        if(isContainsFormatError && currentError != 'FORMAT') {
            setErrors(prev => ({ ...prev, PICID: formFieldErrorMessages.PICID.format }))
            return ;
        }
        
        if(isEmpty == false && isContainsFormatError == false && currentError != 'NO_ERROR') {
            setErrors(prev => ({ ...prev, PICID: null }))
        }
    }

    const onChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        let inputValue = event.target.value.trimStart();

        setData(prev => ({ ...prev, email: inputValue }));

        const { isEmpty, isContainsFormatError } = validateField(inputValue, 'email');
        const currentError = errors.email == null ? 'NO_ERROR' :  errors.email == formFieldErrorMessages.email.required ? 'REQUIRED' : 'FORMAT';

        if(isEmpty && currentError != 'REQUIRED') {
            setErrors(prev => ({ ...prev, email: formFieldErrorMessages.email.required }))
            return ;
        }

        if(isContainsFormatError && currentError != 'FORMAT') {
            setErrors(prev => ({ ...prev, email: formFieldErrorMessages.email.format }))
            return ;
        }
        
        if(isEmpty == false && isContainsFormatError == false && currentError != 'NO_ERROR') {
            setErrors(prev => ({ ...prev, email: null }))
        }
    }

    const onChangeMobile = (event: ChangeEvent<HTMLInputElement>) => {
        let inputValue: null | number = 0;
        if(event.target.value != '') { inputValue = getNumberFromString(event.target.value) ?? 0 }
        inputValue = Math.trunc(inputValue);

        setData(prev => ({ ...prev, mobile: inputValue as number }));

        const { isEmpty, isContainsFormatError } = validateField(inputValue.toString(), 'mobile');
        const currentError = errors.mobile == null ? 'NO_ERROR' :  errors.mobile == formFieldErrorMessages.mobile.required ? 'REQUIRED' : 'FORMAT';

        if(isEmpty && currentError != 'REQUIRED') {
            setErrors(prev => ({ ...prev, mobile: formFieldErrorMessages.mobile.required }))
            return ;
        }

        if(isContainsFormatError && currentError != 'FORMAT') {
            setErrors(prev => ({ ...prev, mobile: formFieldErrorMessages.mobile.format }))
            return ;
        }
        
        if(isEmpty == false && isContainsFormatError == false && currentError != 'NO_ERROR') {
            setErrors(prev => ({ ...prev, mobile: null }))
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

        const validatedNameResult = validateField(data.name.trim(), 'name');
        tempErrors.name = validatedNameResult.isEmpty ? formFieldErrorMessages.name.required : validatedNameResult.isContainsFormatError ? formFieldErrorMessages.name.format : null;

        const validatedNumberResult = validateField(data.number.trim(), 'number');
        tempErrors.number = validatedNumberResult.isEmpty ? formFieldErrorMessages.number.required : validatedNumberResult.isContainsFormatError ? formFieldErrorMessages.number.format : null;

        const validatedAddressResult = validateField(data.address.trim(), 'address');
        tempErrors.address = validatedAddressResult.isEmpty ? formFieldErrorMessages.address.required : validatedAddressResult.isContainsFormatError ? formFieldErrorMessages.address.format : null;
        
        tempErrors.floorLevel = data.floorLevel.trim() == '';
        tempErrors.constructionType = data.constructionType.trim() == '';

        const validatedPICNameResult = validateField(data.PICName.trim(), 'PICName');
        tempErrors.PICName = validatedPICNameResult.isEmpty ? formFieldErrorMessages.PICName.required : validatedPICNameResult.isContainsFormatError ? formFieldErrorMessages.PICName.format : null;

        const validatedPICIDResult = validateField(data.PICID.trim(), 'PICID');
        tempErrors.PICID = validatedPICIDResult.isEmpty ? formFieldErrorMessages.PICID.required : validatedPICIDResult.isContainsFormatError ? formFieldErrorMessages.PICID.format : null;

        const validatedEmailResult = validateField(data.email.trim(), 'email');
        tempErrors.email = validatedEmailResult.isEmpty ? formFieldErrorMessages.email.required : validatedEmailResult.isContainsFormatError ? formFieldErrorMessages.email.format : null;

        const validatedMobileResult = validateField(data.mobile.toString().trim(), 'mobile');
        tempErrors.mobile = validatedMobileResult.isEmpty ? formFieldErrorMessages.mobile.required : validatedMobileResult.isContainsFormatError ? formFieldErrorMessages.mobile.format : null;
        
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
                
                    <FormControl isInvalid = {errors.name != null}>
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
                        <FormErrorMessage ml = '10px'>{errors.name}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.number != null}>
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
                        <FormErrorMessage ml = '10px'>{errors.number}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.address != null}>
                        <FormLabel>Clinic Address</FormLabel>
                        <AddressInput 
                            currentValue = {data.address}
                            onChange={onChangeAddress}
                        />
                        <FormErrorMessage ml = '10px'>{errors.address}</FormErrorMessage>
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

                    <FormControl isInvalid = {errors.PICName != null}>
                        <FormLabel>Person Incharge Name</FormLabel>
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
                        <FormErrorMessage ml = '10px'>{errors.PICName}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.PICID != null}>
                        <FormLabel>Person Incharge IC</FormLabel>
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
                        <FormErrorMessage ml = '10px'>{errors.PICID}</FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid = {errors.email != null}>
                        <FormLabel>Email ID</FormLabel>
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

                    <FormControl isInvalid = {errors.mobile != null}>
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
                        <FormErrorMessage ml = '10px'>{errors.mobile}</FormErrorMessage>
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