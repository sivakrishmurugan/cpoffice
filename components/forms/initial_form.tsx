"use client"
import { Checkbox, Flex, FormControl,Text,  FormErrorMessage, FormLabel, Icon, Input, InputGroup, InputRightElement, Select, Link, Button } from "@chakra-ui/react";
import { IcEmail, IcMobile, IcLocationPin, IcClinic } from "../icons";
import useSessionStorage from "../hooks/use_sessionstorage";
import { CONSTRUCTION_TYPES } from "../app/app_constants";
import useLocalStorage from "../hooks/use_localstorage";
import { getNumberFromString } from "../utill_methods";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { coveragesData } from "../mocks";
import { DigitInput } from "../inputs";
import NextLink from 'next/link';

interface BasicInfoFormProps {}

const BasicInfoForm = ({}: BasicInfoFormProps) => {
    const [coverageSessionData, setCoverageSessionData] = useSessionStorage('coverages', null);
    const [localData, setLocalData] = useLocalStorage('clinic_form_data', null);
    const [agreedWithTermsAndConditions, setAgreedWithTermsAndConditions] = useState(false);
    const [data, setData] = useState({
        name: localData?.basic?.name ?? '',
        number: localData?.basic?.number ?? '',
        address: localData?.basic?.address ?? '',
        floorLevel: localData?.basic?.floorLevel ?? 0,
        constructionType: localData?.basic?.constructionType ?? '',
        email: localData?.basic?.email ?? '',
        mobile: localData?.basic?.mobile ?? 0
    });
    const [errors, setErrors] = useState({
        name: false,
        number: false,
        mobile: false,
        address: false,
        floorLevel: false,
        constructionType: false,
        termsAndConditions: false,
        email: null as string | null,
    })
    const router = useRouter();

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

    const onChangeAddress = (event: ChangeEvent<HTMLInputElement>) => {
        setData(prev => ({ ...prev, address: event.target.value }));

        if(event.target.value == '' && errors.address == false) {
            setErrors(prev => ({ ...prev, address: true }))
        }
        if(event.target.value != '' && errors.address == true) {
            setErrors(prev => ({ ...prev, address: false }))
        }
    }

    const onChangeFloor = (event: ChangeEvent<HTMLInputElement>) => {
        let value: null | number = 0;
        if(event.target.value != '') { value = getNumberFromString(event.target.value) ?? 0 }
        
        setData(prev => ({ ...prev, floorLevel: value as number }));

        if(value < 1 && errors.floorLevel == false) {
            setErrors(prev => ({ ...prev, floorLevel: true }))
        }
        if(value > 0 && errors.floorLevel == true) {
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

    const validate = () => {
        const tempErrors: typeof errors = JSON.parse(JSON.stringify(errors));
        tempErrors.name = data.name.trim() == '';
        tempErrors.number = data.number.trim() == '';
        tempErrors.address = data.address.trim() == '';
        tempErrors.floorLevel = data.floorLevel < 1;
        tempErrors.constructionType = data.constructionType.trim() == '';
        tempErrors.email = data.email.trim() == '' ? 'Email is required!' : validateEmail(data.email) == false ? 'Invalid email format!' : null;
        tempErrors.mobile = data.mobile < 0;
        setErrors(tempErrors);
        return Object.values(tempErrors).some(e => e == true || typeof e == 'string');
    }

    const onClickGetStarted = () => {
        if(validate()) return ;
        setCoverageSessionData(coveragesData);
        setLocalData({
            basic: data,
            selectedCoverages: [],
            selectedOptionalCoverages: [],
            selectedInsType: null,
            promoCode: '',
            insStartDate: '',
            claimDeclaration: {
                previouslyClaimed: false,
                addtionalInfo: []
            }
        })
        router.push('/coverage');
    }

    const isSubmitDisabled = Object.values(errors).some(e => e == true || typeof e == 'string');
    
    return (
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
                <InputGroup>
                    <Input 
                        value = {data.address}
                        onChange = {onChangeAddress}
                        placeholder="ex. 2 Angkasaraya Jln Ampang, Kuala Lumpur" 
                    />
                    <InputRightElement h = '100%'>
                        <Icon as = {IcLocationPin} h = 'auto' w = 'auto' />
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage ml = '10px'>Address is required!</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid = {errors.floorLevel || errors.constructionType}>
                <Flex gap = '10px' alignItems={'flex-end'}>
                    <FormControl maxW = '200px' w = '40%' isInvalid = {errors.floorLevel}>
                        <FormLabel>Floor Level</FormLabel>
                        <DigitInput 
                            currentValue = {data.floorLevel}
                            onChange = {onChangeFloor}
                            forceUpdateOnValueChange
                            emptyOnZero
                            inputProps = {{ placeholder: 'ex. 10' }}
                        />
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

            <FormControl isInvalid = {errors.email != null}>
                <FormLabel>Email id</FormLabel>
                <InputGroup>
                    <Input
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
                    <DigitInput 
                        currentValue = {data.mobile}
                        onChange = {onChangeMobile}
                        forceUpdateOnValueChange
                        emptyOnZero
                        inputProps = {{ placeholder: '+60 1234 56789' }}
                    />
                    <InputRightElement h = '100%'>
                        <Icon as = {IcMobile} h = 'auto' w = 'auto' />
                    </InputRightElement>
                </InputGroup>
                <FormErrorMessage ml = '10px'>Mobile number is required!</FormErrorMessage>
            </FormControl>

            <Flex gap = '10px' alignItems={'flex-start'}>
                <Checkbox isChecked = {agreedWithTermsAndConditions} onChange = {onToggleTermsAndConditionCheckbox} mt = '3px' boxShadow={'none'} borderColor = 'brand.borderColor' id = 'checkbox' colorScheme='blue' size = 'lg' />
                <Text as = {'label'} htmlFor = 'checkbox' cursor={'pointer'}>
                    <span>I understand and agree to the </span>
                    <span>
                        <Link as = {NextLink} href = {'/'} color='#040431' textDecoration={'underline'} fontWeight={'bold'} isExternal>Terms and Conditions</Link>
                    </span>
                    <span>, </span>
                    <span>
                        <Link as = {NextLink} href = {'/'} color='#040431' textDecoration={'underline'} fontWeight={'bold'} isExternal> Privacy Policy</Link>
                    </span>
                    <span> and I meet all local regulation.</span>
                </Text>
            </Flex>

            <Button onClick={onClickGetStarted} isDisabled = {isSubmitDisabled} mt = '10px' bg = {'brand.secondary'} color = 'white' _hover = {{}} _focus={{}}>GET STARTED</Button>
        </Flex>
    );
}

export default BasicInfoForm;