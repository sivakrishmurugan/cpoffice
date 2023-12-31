import { Flex } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { Metadata, NextPage } from "next";
import axiosClient from "@/lib/utlils/axios";
import PaymentStatus, { PaymentStatusType } from "@/lib/components/forms/payment_status";
import { JWTService } from "@/lib/utlils/jwt";

interface PageProps {
    searchParams: {
        token: string
    }
}

export const metadata: Metadata = {
    title: 'Payment status'
};

const getPaymentStatus = async (paymentResToken: string): Promise<null | {
    TransactionResponse: string,
    message: string,
    TransactionRef: string,
    OrderID: string
}> => {
    if(paymentResToken == null || paymentResToken == '') return null;
    try {
        let paymentResponse: { invoiceNo: string } = new JWTService().decodeToken(paymentResToken);
        paymentResponse = JSON.parse(paymentResponse.toString())
        const res = await axiosClient.post('/api/clinicshield/payresponse', { OrderID: paymentResponse?.invoiceNo });
        if(res && res.data && res.data[0]) {
            return res.data[0];
        }
        console.log(res.data)
    } catch(e) {
        console.log('payment status api or jwt decode failed: ', e)
    }
    return null;
}

const apiResStatusToStatus: Record<string, PaymentStatusType> = {
    approved: 'success',
    failed: 'failed',
    pending: 'pending',
    rejected: 'rejected',
    cancelled: 'cancelled'
}

const PaymentStatusPage: NextPage<PageProps> = async ({ searchParams }) => {
    if(searchParams?.token == null) redirect('/');
    const paymentStatusRes = await getPaymentStatus(searchParams?.token);
    let paymentStatus: PaymentStatusType = 'failed';
    if(paymentStatusRes && paymentStatusRes.TransactionResponse && paymentStatusRes.TransactionResponse != '') {
        paymentStatus = apiResStatusToStatus[paymentStatusRes.TransactionResponse.toLowerCase()];
    }

    return (
        <Flex w = '100%' direction={'column'} alignItems={'center'} gap = '10px'  py = '20px' maxH = {['100%', '100%', '700px', '700px', '700px']}>
            <Flex 
                w = {['100%', '100%', '80%', '60%', '60%']} 
                minH = '100%' 
                bg = {'white'}
                borderRadius={'10px'}
                direction={'column'}
                p = {[
                    '40px 20px',
                    '40px 20px',
                    '40px 30px 40px 40px',
                    '40px 30px 40px 40px',
                    '40px 30px 40px 40px',
                ]}
                boxShadow={'0 2px 8px rgba(0, 0, 0, .2)'}
                color = 'brand.text'
                justifyContent={'center'}
            >
                <PaymentStatus 
                    message = {paymentStatusRes?.message ?? ''}
                    status = {paymentStatus}
                    invoice = {paymentStatusRes?.OrderID ?? ''}
                    transationRef = {paymentStatusRes?.TransactionRef ?? ''}
                /> 
            </Flex>
        </Flex>
    );
}

export default PaymentStatusPage;
