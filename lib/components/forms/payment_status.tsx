"use client"
import { Button, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useClient, useSessionStorage } from "../../hooks";
import axiosClient from "../../utlils/axios";
import { useRouter } from "next/navigation";
import { ClinicData } from "../../types";
import useCoverage from "../../hooks/use_coverage";
import { calculateSummary } from "../../utlils/calculation";
import { useEffect, useState } from "react";

export type PaymentStatusType = 'success' | 'failed' | 'pending' | 'rejected' | 'cancelled';

interface PaymentStatusProps {
    invoice: string,
    transationRef: string,
    status: 'success' | 'failed' | 'pending' | 'rejected' | 'cancelled'
    message: string
}

const statusWithTitle = {
    success: 'Payment Success',
    failed: 'Payment Failed',
    pending: 'Payment Pending',
    rejected: 'Payment Rejected',
    cancelled: 'Payment Cancelled'
}

const icons = {
    success: 'https://icon-library.com/images/4631f6529c.png',
    failed: '/icons/error_icon.svg',
    pending: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6nOI0usYypR7m6rWTeQuhZ39rtmiS5aTsDw&usqp=CAU',
    rejected: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/OOjs_UI_icon_cancel-destructive.svg/2048px-OOjs_UI_icon_cancel-destructive.svg.png',
    cancelled: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/FailureIcon.png'
}

const PaymentStatus = ({ message, status, invoice, transationRef }: PaymentStatusProps) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData, updateDataWithNewQuoteId } = useCoverage(localData?.quoteId);
    const [remainingRetryCount, setRemainingRetryCount] = useSessionStorage('payment_retry', 3);
    const isClient = useClient();
    const [retryLoading, setRetryLoading] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        if(['success', 'pending'].includes(status)) {
            setLocalData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status])

    const onClickHome = () => {
        router.replace('/');
    }

    const onClickRetryPayment = async () => {
        if(localData == null) return ;
        setRetryLoading(true);
        const { finalPremium } = calculateSummary(
            localData?.selectedCoverages ?? [],
            localData?.selectedOptionalCoverages ?? [], 
            localData?.selectedInsType ?? 'FIRE', 
            localData?.promoCodePercentage ?? 0, 
            coveragesData ?? { coverages: [], optionalCoverages: [] }
        )
        await redirectToPayment(localData.quoteId, finalPremium);
        setRetryLoading(false)
    }

    const redirectToPayment = async (encryptedQuoteId: string, amount: number) => {
        try {
            const res = await axiosClient.post('/api/clinicshield/dopayment', {
                QuoteID: encryptedQuoteId,
                Payment: amount.toString()
            })
            if(res.data && res.data.Success == 1 && res.data.Data.respCode && res.data.Data.respCode == '0000') {
                setRemainingRetryCount(remainingRetryCount - 1);
                router.push(res.data.Data.webPaymentUrl);
            }
        } catch(e) {
            console.log('do payment api failed: ', e)
        }
    }

    const iconSrc = icons[status];

    return (
        <Flex direction={'column'} w = '100%' gap ='15px' alignItems={'center'}>
            <Image 
                w = {status != 'success' ? '100px' : '150px'}
                h = {status != 'success' ? '100px' : '150px'}
                style = {{ objectFit: 'contain' }}
                alt={`payment-${status}-icon`}
                src = {iconSrc}
            />
            <Heading as = 'h1' textAlign={'center'}>{statusWithTitle[status]}</Heading>
            <Heading as = 'h3' px = {['0px', '0px', '30px', '30px', '30px']} fontSize={'20px'} textAlign={'center'}>{message}</Heading>
            {invoice != null && invoice != '' && <Text as = 'h3' mt = '10px' fontSize={'16px'} textAlign={'center'}>Invoice: {invoice}</Text>}
            {transationRef != null && transationRef != '' && <Text as = 'h3' mb = '20px' fontSize={'16px'} textAlign={'center'}>Transaction ref: {transationRef}</Text>}
            {
                isClient && ['failed', 'cancelled', 'rejected'].includes(status) && remainingRetryCount > 0 &&
                <Button onClick={onClickRetryPayment} isLoading = {retryLoading} mt = '10px' h = '40px' w = '250px' bg = 'brand.secondary' color = 'white' _focus={{}} _hover={{}}>Retry payment</Button>
            }
            <Button onClick={onClickHome} h = '40px' w = '250px' bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>Home</Button>
        </Flex>
    );
}

export default PaymentStatus;