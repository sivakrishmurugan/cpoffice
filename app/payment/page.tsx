import { Alert, AlertIcon, Button, Flex, Heading, Modal, ModalBody, ModalContent, ModalOverlay, Text, UseRadioProps, useRadio, useRadioGroup } from "@chakra-ui/react";
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
import PaymentStatus from "@/components/payment_status";

interface PageProps {
    searchParams: {
        id: string
    }
}

const getPaymentStatus = async (InvoiceNo: string) => {
    try {
      const res = await axiosClient.post('/api/clinicshield/paymentstatus', { InvoiceNo: InvoiceNo });
      if(res && res.data && res.data) {
        return res.data.data;
      }
    } catch(e) {}
    return null;
}

const PaymentStatusPage: NextPage<PageProps> = async ({ searchParams }) => {
    const paymentStatusRes = await getPaymentStatus(searchParams.id);
    
    return (
        <Flex w = '100%' direction={'column'} alignItems={'center'} gap = '10px'  py = '20px' maxH = '700px'>
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
                    message = "Thank you for choosing clinic property"
                    status = "success"
                    invoiceNumber = "Y2J123456"
                /> 
            </Flex>
        </Flex>
    );
}

export default PaymentStatusPage;
