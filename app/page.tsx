import axiosClient from '@/lib/utlils/axios';
import InitialForm from '@/lib/components/forms/initial_form'
import { Flex, Heading } from '@chakra-ui/react'
import { Metadata } from 'next';
import Image from 'next/image';

interface PageProps {
    searchParams: {
        quoteid: string
    }
}

const getQuote = async (quoteID: string) => {
    try {
      const res = await axiosClient.post('/api/clinicshield/getquote', { QuoteID: quoteID }, { headers: { secretkey: process.env.NEXT_PUBLIC_API_SECRET_KEY } });
      if(res && res.data && res.data[0] && res.data[0].Success == 1) {
        return { success: true, data: res.data[0] };
      } else if(res.data && res.data[0] && res.data[0].Success == 0 && res.data[0].Result == 'No QuoteID exists'){
        return { success: false, message: res.data[0].Result };
      }
    } catch(e: any) {
        console.log('get quote failed: ', e?.response?.data)
    }
    return { success: false, message: 'Something went wrong!' };
}

const getCoverage = async (quoteID: string, authToken: string) => {
    try {
      const res = await axiosClient.post('/api/clinicshield/getcoverage', { QuoteID: quoteID }, { headers: { 'auth-token': authToken } });
      if(res && res.data && res.data && res.data.success == 1) {
        return res.data.data;
      }
    } catch(e) {}
    return null;
}

export const metadata: Metadata = {
    title: 'DS-Clinic Property',
}  

export default async function Home({ searchParams }: PageProps) {
    let quoteFromQuery = null as null | { quote: any, coverages: any, encryptedQuoteId: string, failedMessage: string | null };
    if(searchParams.quoteid != null) {
        const quote = await getQuote(searchParams.quoteid);
        if(quote.success) {
            const coverages = await getCoverage(searchParams.quoteid, quote.data.authToken);
            quoteFromQuery = { quote, coverages, encryptedQuoteId: searchParams.quoteid, failedMessage: null }
        } else {
            quoteFromQuery = { quote: null, coverages: null, encryptedQuoteId: searchParams.quoteid, failedMessage: quote.message }
        }
    }

    return (
        <Flex w = '100%' direction={'column'} gap = '20px' py = '20px'>
            <Flex w ='100%' gap = '20px' direction={['column', 'column', 'column', 'row', 'row']} >

                <Flex 
                    direction={['row-reverse', 'row-reverse', 'row-reverse', 'column', 'column']}
                    w = {['100%', '100%', '100%', '58.3%', '58.3%']} 
                    borderRadius={'30px'} 
                    h = 'fit-content'
                    p = {['10px', '15px', '20px', '40px', '40px']}
                    bg = {['white', 'white', 'white', 'transparent', 'transparent']}
                    backgroundImage={[
                        'none',
                        'none',
                        'none',
                        'linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 100%)',
                        'linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 100%)'
                    ]}
                >
                    <Flex w = {['60%', '60%', '60%', '100%', '100%']} mt = {['0px', '0px', '0px', '20px', '20px']} direction={'column'}>
                        <Flex direction={'column'} m = 'auto'>
                            <Heading textAlign={['start', 'start', 'start', 'center', 'center']} color = 'brand.secondary' fontSize={['18px', '23px', '28px', '38px', '38px']} as = 'h1'>Insurance Protection</Heading>
                            <Heading textAlign={['start', 'start', 'start', 'center', 'center']} fontSize={['18px', '23px', '28px', '38px', '38px']} as = 'h1'>for Your Clinic Property</Heading>
                        </Flex>
                    </Flex>
                    <Flex position={'relative'} w = {['40%', '40%', '40%', 'initial', 'initial']} minH = {['130px','150px', '200px', '600px', '600px']}>
                        <Image src = '/images/clinic-hero-image.png' alt = 'hero_image' fill objectFit='contain' />
                    </Flex>
                </Flex>

                <Flex w = {['100%', '100%', '100%', '41.6%', '41.6%']} direction={'column'} borderRadius={'10px'} minH = '700px' boxShadow={'0 -2px 8px rgba(99, 101, 102, .06)'}>
                    <Flex w = '100%' minH = '60px' borderTopRadius={'10px'} bg = 'brand.primary' py = '10px'>
                        <Heading as = {'h1'} color = 'white' fontSize={'23px'} m = 'auto' textAlign={'center'}>Calculate your Premium Instantly</Heading>
                    </Flex>
                    <Flex px = {['10px', '40px', '40px', '40px', '40px']} py = '20px' borderBottomRadius={'10px'} bg = 'white'>
                        <InitialForm quoteFromQuery={quoteFromQuery} />
                    </Flex>
                </Flex>

            </Flex>
        </Flex>
    )
}
