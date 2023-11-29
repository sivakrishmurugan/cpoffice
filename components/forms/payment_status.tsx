"use client"
import { Button, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useClient, useSessionStorage } from "../hooks";
import axiosClient from "../axios";
import { useRouter } from "next/navigation";
import { ClinicData } from "../types";
import useCoverage from "../hooks/use_coverage";
import { calculateSummary } from "../calculation";
import { useState } from "react";

interface PaymentStatusProps {
    invoiceNumber: string 
    status: 'success' | 'failure' | 'pending' | 'rejected' | 'cancelled'
    message: string
}

const statusWithTitle = {
    success: 'Payment Success',
    failure: 'Payment Failed',
    pending: 'Payment Pending',
    rejected: 'Payment Rejected',
    cancelled: 'Payment Cancelled'
}

const PaymentStatus = ({ message, status, invoiceNumber }: PaymentStatusProps) => {
    const [localData, setLocalData] = useSessionStorage<ClinicData | null>('clinic_form_data', null);
    const { isLoading, coveragesData, updateDataWithNewQuoteId } = useCoverage(localData?.quoteId);
    const [remainingRetryCount, setRemainingRetryCount] = useSessionStorage('payment_retry', 3);
    const isClient = useClient();
    const [retryLoading, setRetryLoading] = useState(false);
    const router = useRouter();
    
    const onClickHome = () => {}

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

    return (
        <Flex direction={'column'} w = '100%' gap ='15px' alignItems={'center'}>
            <Image 
                w = '150px'
                h = '150px'
                objectFit={'contain'}
                alt={`payment-${status}-icon`}
                src = 'https://icon-library.com/images/4631f6529c.png' 
            />
            <Heading as = 'h1' textAlign={'center'}>{statusWithTitle[status]}</Heading>
            <Heading as = 'h3' fontSize={'20px'} textAlign={'center'}>{message}</Heading>
            <Text as = 'h3' mb = '30px' fontSize={'16px'} textAlign={'center'}>Invoice: {invoiceNumber}</Text>
            {
                isClient && ['failure', 'rejected', 'cancelled'].includes(status) && remainingRetryCount > 0 &&
                <Button onClick={onClickRetryPayment} isLoading = {retryLoading} mt = '30px' h = '40px' w = '250px' bg = 'brand.secondary' color = 'white' _focus={{}} _hover={{}}>Retry payment</Button>
            }
            <Button onClick={onClickHome} h = '40px' w = '250px' bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>Home</Button>
        </Flex>
    );
}

export default PaymentStatus;