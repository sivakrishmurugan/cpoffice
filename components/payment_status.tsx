"use client"
import { Button, Flex, Heading, Text, Image } from "@chakra-ui/react";

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

    const onClickHome = () => {}

    const onClickRetryPayment = () => {}

    return (
        <Flex direction={'column'} w = '100%' gap ='15px' alignItems={'center'}>
            <Image 
                w = '150px'
                h = '150px'
                objectFit={'contain'}
                src = 'https://icon-library.com/images/4631f6529c.png' 
            />
            <Heading as = 'h1' textAlign={'center'}>{statusWithTitle[status]}</Heading>
            <Heading as = 'h3' fontSize={'20px'} textAlign={'center'}>{message}</Heading>
            <Text as = 'h3' mb = '30px' fontSize={'16px'} textAlign={'center'}>Invoice: {invoiceNumber}</Text>
            {
                ['failure', 'rejected', 'cancelled'].includes(status) &&
                <Button onClick={onClickRetryPayment} mt = '30px' h = '40px' w = '250px' bg = 'brand.secondary' color = 'white' _focus={{}} _hover={{}}>Retry payment</Button>
            }
            <Button onClick={onClickHome} h = '40px' w = '250px' bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>Home</Button>
        </Flex>
    );
}

export default PaymentStatus;