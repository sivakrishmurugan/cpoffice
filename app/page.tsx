import axiosClient from '@/lib/utlils/axios';
import InitialForm from '@/lib/components/forms/initial_form'
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex, Heading, Link, ResponsiveValue } from '@chakra-ui/react'
import { Metadata } from 'next';
import Image from 'next/image';
import { Image as ChakraImage, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import FAQ from '@/lib/components/homepage/faq';
import { FAQ_LIST } from '@/lib/app/app_constants';
import BenifitCard from '@/lib/components/homepage/benifit_card';
import BadgeText from '@/lib/components/homepage/badge_text';
import Footer from '@/lib/components/footer';

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
        return { success: true, data: res.data.data }
      }
    } catch(e: any) {
        console.log('get coverage failed: ', e?.response?.data)
    }
    return { success: false, message: 'Something went wrong!' };
}

export const metadata: Metadata = {
    title: 'DS-Clinic Property',
}  

export default async function Home({ searchParams }: PageProps) {
    let quoteFromQuery = null as null | { quote: any, coverages: any, encryptedQuoteId: string, failedMessage: string | null | undefined };
    if(searchParams.quoteid != null) {
        const quote = await getQuote(searchParams.quoteid);
        if(quote.success) {
            const coverages = await getCoverage(searchParams.quoteid, quote.data.authToken);
            if(coverages.success) {
                quoteFromQuery = { quote: quote.data, coverages: coverages.data, encryptedQuoteId: searchParams.quoteid, failedMessage: null }
            } else {
                quoteFromQuery = { quote: quote.data, coverages: null, encryptedQuoteId: searchParams.quoteid, failedMessage: coverages.message }
            }
        } else {
            quoteFromQuery = { quote: null, coverages: null, encryptedQuoteId: searchParams.quoteid, failedMessage: quote.message }
        }
    }

    const textAlign: ResponsiveValue<any> = ['start', 'start', 'start', 'center', 'center'];

    return (
        <Flex w = '100%' direction={'column'} py = '20px'>

            <Flex id = 'home' w ='100%' gap = '20px' direction={['column', 'column', 'column', 'row', 'row']} >

                <Flex 
                    direction={['row-reverse', 'row-reverse', 'row-reverse', 'column', 'column']}
                    w = {['100%', '100%', '100%', '58.3%', '58.3%']} 
                    borderRadius={'30px'} 
                    h = 'fit-content'
                    p = {['10px', '15px', '20px', '40px', '40px']}
                    bg = {'white'}
                    // backgroundImage={[
                    //     'none',
                    //     'none',
                    //     'none',
                    //     'linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 100%)',
                    //     'linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 100%)'
                    // ]}
                >
                    <Flex w = {['60%', '60%', '60%', '100%', '100%']} mt = {['0px', '0px', '0px', '20px', '20px']} direction={'column'}>
                        <Flex direction={'column'} m = 'auto'>
                            <Heading fontFamily={'kanit'} fontWeight={'500'} textAlign={['start', 'start', 'start', 'center', 'center']} color = 'brand.secondary' fontSize={['18px', '23px', '45px', '45px', '45px']} as = 'h1'>Insurance</Heading>
                            <Heading fontFamily={'kanit'} fontWeight={'500'} textAlign={['start', 'start', 'start', 'center', 'center']} fontSize={['18px', '23px', '45px', '45px', '45px']} as = 'h1'>for Your Clinic Property</Heading>
                        </Flex>
                    </Flex>
                    <Flex position={'relative'} w = {['40%', '40%', '40%', 'initial', 'initial']} minH = {['130px','150px', '200px', '600px', '650px']}>
                        <Image src = '/images/hero-banner.png' alt = 'hero_image' fill style = {{ objectFit: 'contain' }} sizes='(max-width: 991px) 100vw, 49vw' loading='lazy' />
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

            <Flex mt = '35px' w = '100%' gap = '40px' direction={'column'} bg = 'white' minH = '700px' borderRadius={'30px'} paddingY = '60px' px = {['15px', '20px', '20px', '130px', '130px']}>

                <Heading id = 'coverages' fontFamily={'kanit'} fontWeight={'500'} fontSize={'45px'} textAlign={textAlign}>Your Clinic Deserves the Finest Protection</Heading>

                <Flex w = '100%' direction={['column', 'column', 'column', 'row', 'row']} gap = '20px'>

                    <Flex w = '100%' h = '100%' direction={'column'} gap = '10px' alignItems={textAlign} border = '1px' borderColor={'brand.borderColor'} px = {['20px', '20px', '30px', '30px', '30px']} py = {['20px', '20px', '40px', '40px', '40px']} borderRadius={'10px'}>
                        <Flex position={'relative'} w = '80px' h = '120px'>
                            <Image src = '/images/fire_1fire.png' alt = 'fire_insurance' sizes="(max-width: 768px) 100vw, 33vw" fill style={{ objectFit: 'contain' }} />
                        </Flex>
                        <Heading fontFamily={'kanit'} fontWeight={'500'} textAlign={textAlign} fontSize={'35px'}>Fire Insurance</Heading>
                        <Text fontSize = '16px' color={'brand.text'} textAlign={textAlign}>Comprehensive coverage against loss or damage to your clinic property caused by fire or lightning. With DoctorShield, you can rebuild your clinic with confidence, knowing your assets are protected.</Text>
                    </Flex>

                    <Flex w = '100%' h = '100%' direction={'column'} gap = '10px' alignItems={textAlign} border = '1px' borderColor={'brand.borderColor'} px = {['20px', '20px', '30px', '30px', '30px']} py = {['20px', '20px', '40px', '40px', '40px']} borderRadius={'10px'}>
                        <Flex position={'relative'} w = '150px' h = '120px'>
                            <Image src = '/images/perils.png' alt = 'perils_insurance' sizes="(max-width: 768px) 100vw, 33vw" fill style={{ objectFit: 'contain' }} />
                        </Flex>
                        <Heading fontFamily={'kanit'} fontWeight={'500'} textAlign={textAlign} fontSize={'35px'}>Fire & Perils Insurance</Heading>
                        <Text fontSize = '16px' color={'brand.text'} textAlign={textAlign}>Go beyond basic coverage and safeguard your clinic against a broader range of risks. Our Fire & Perils Insurance provides enhanced protection, giving you peace of mind in the face of unforeseen events.</Text>
                    </Flex>

                </Flex>

                <Flex w = '100%' direction={'column'} alignItems={textAlign} border = '1px' borderColor={'brand.borderColor'} px = {['20px', '20px', '30px', '30px', '60px']} py = {['20px', '20px', '40px', '40px', '40px']} borderRadius={'10px'}>

                    <Heading fontFamily={'kanit'} fontWeight={'500'} mt = '10px' fontSize={'35px'} textAlign={textAlign}>Also Buy Additional Coverages</Heading>

                    <Text mb = {['20px', '20px', '40px', '40px', '40px']} mt = {'20px'} textAlign={textAlign} fontSize={'16px'} color = 'brand.text'>{`We recognize that your clinic's needs are unique, and we offer a range of additional coverages to tailor your insurance package for comprehensive protection. Beyond our core offerings, consider enhancing your coverage with these additional safeguards:`}</Text>

                    <Flex w = '100%' gap = {['10px', '15px', '15px', '30px', '30px']} flexWrap={['wrap', 'wrap', 'wrap', 'initial', 'initial']} direction={['column', 'column', 'column', 'row', 'row']} justifyContent={'center'}>
                        <BadgeText textAlign = {textAlign} text = {'Removal of Debris'} />
                        <BadgeText textAlign = {textAlign} text = {'Loss of Revenue Protection'} />
                        <BadgeText textAlign = {textAlign} text = {'Mobile Device Protection'} />
                    </Flex>

                    <Text mt = {['20px', '20px', '40px', '40px', '40px']} mb = '20px' textAlign={textAlign} fontSize={'18px'} fontWeight={'bold'}>Protection and Liability Coverage</Text>

                    <Flex w = '100%' gap = {['10px', '15px', '15px', '30px', '30px']} flexWrap={['wrap', 'wrap', 'wrap', 'initial', 'initial']} direction={['column', 'column', 'column', 'row', 'row']} justifyContent={'center'}>
                        <BadgeText textAlign = {textAlign} text = {'Auditor fees'} />
                        <BadgeText textAlign = {textAlign} text = {'Burglary'} />
                        <BadgeText textAlign = {textAlign} text = {'Money Inside premises'} />
                        <BadgeText textAlign = {textAlign} text = {'Plate glass'} />
                    </Flex>

                    <Flex mt = '20px' w = '100%' gap = {['10px', '15px', '15px', '40px', '40px']} flexWrap={['wrap', 'wrap', 'wrap', 'initial', 'initial']} direction={['column', 'column', 'column', 'row', 'row']} justifyContent={'center'}>
                        <BadgeText textAlign = {textAlign} text = {'Fidelity guarantee'} />
                        <BadgeText textAlign = {textAlign} text = {'Public liability'} />
                        <BadgeText textAlign = {textAlign} text = {'Employer liability'} />
                    </Flex>

                </Flex>

                <Flex w = '100%' direction={['column', 'column', 'column', 'row', 'row']} gap = '20px'>

                    <Flex w = '100%' h = '150px' bg = '#dfebf2' justifyContent={textAlign} alignItems={textAlign} px = {['20px', '20px', '30px', '30px', '30px']} py = {['20px', '20px', '40px', '40px', '40px']} borderRadius={'10px'}>
                        Ad space
                    </Flex>

                    <Flex w = '100%' h = '150px' bg = '#dfebf2' justifyContent={textAlign}  alignItems={textAlign} px = {['20px', '20px', '30px', '30px', '30px']} py = {['20px', '20px', '40px', '40px', '40px']} borderRadius={'10px'}>
                        Ad space
                    </Flex>

                </Flex>

                <Heading fontFamily={'kanit'} fontWeight={'500'} fontSize={'45px'} textAlign={textAlign}>{`What Makes Us Malaysia's Favorite Place to Buy Insurance?`}</Heading>

                <Flex w = '100%' direction={['column', 'column', 'column', 'row', 'row']} gap = '20px'>

                    <Flex w = '100%' h = '100%' direction={'column'} gap = '10px' alignItems={textAlign} border = '1px' borderColor={'brand.borderColor'} px = {['20px', '20px', '30px', '30px', '30px']} py = {['20px', '20px', '40px', '40px', '40px']} borderRadius={'10px'}>
                        <Flex position={'relative'} w = '100px' h = '100px'>
                            <Image src = '/icons/Convenient.svg' alt = 'fire_insurance' fill style={{ objectFit: 'contain' }} />
                        </Flex>
                        <Heading fontFamily={'kanit'} fontWeight={'500'} textAlign={textAlign} fontSize={'35px'}>Convenient</Heading>
                        <Text fontSize = '16px' color={'brand.text'} textAlign={textAlign}>No paperwork or documents required</Text>
                    </Flex>

                    <Flex w = '100%' h = '100%' direction={'column'} gap = '10px' alignItems={textAlign} border = '1px' borderColor={'brand.borderColor'} px = {['20px', '20px', '30px', '30px', '30px']} py = {['20px', '20px', '40px', '40px', '40px']} borderRadius={'10px'}>
                        <Flex position={'relative'} w = '100px' h = '100px'>
                            <Image src = '/icons/Customizable.svg' alt = 'perils_insurance' fill style={{ objectFit: 'contain' }} />
                        </Flex>
                        <Heading fontFamily={'kanit'} fontWeight={'500'} textAlign={textAlign} fontSize={'35px'}>Customizable</Heading>
                        <Text fontSize = '16px' color={'brand.text'} textAlign={textAlign}>To your unique needs and practice</Text>
                    </Flex>

                    <Flex w = '100%' h = '100%' direction={'column'} gap = '10px' alignItems={textAlign} border = '1px' borderColor={'brand.borderColor'} px = {['20px', '20px', '30px', '30px', '30px']} py = {['20px', '20px', '40px', '40px', '40px']} borderRadius={'10px'}>
                        <Flex position={'relative'} w = '100px' h = '100px'>
                            <Image src = '/icons/Competitive.svg' alt = 'perils_insurance' fill style={{ objectFit: 'contain' }} />
                        </Flex>
                        <Heading fontFamily={'kanit'} fontWeight={'500'} textAlign={textAlign} fontSize={'35px'}>Competitive</Heading>
                        <Text fontSize = '16px' color={'brand.text'} textAlign={textAlign}>Premiums with flexible pricing options</Text>
                    </Flex>

                </Flex>

                <Heading id = 'advantages' fontFamily={'kanit'} fontWeight={'500'} fontSize={'45px'} textAlign={textAlign}>Unique Benefits to Protect you</Heading>

                <Flex w = '100%' direction={['column', 'column', 'column', 'row', 'row']} gap = '20px'>

                    <BenifitCard 
                        textAlign = {textAlign}
                        title = 'Comprehensive Clinic-Focused Coverage'
                        icon = '/icons/clinic-1.svg'
                    />
                    <BenifitCard 
                        textAlign = {textAlign}
                        title = 'Consequential Loss Coverage'
                        icon = '/icons/Loss.svg'
                    />
                    <BenifitCard 
                        textAlign = {textAlign}
                        title = 'Fidelity Guarantee'
                        icon = '/icons/Reliable.svg'
                    />

                </Flex>

                <Flex w = '100%' direction={['column', 'column', 'column', 'row', 'row']} gap = '20px'>

                    <BenifitCard 
                        textAlign = {textAlign}
                        title = 'All Risks Coverage for Equipment and Machinery'
                        icon = '/icons/Equipment.svg'
                    />
                    <BenifitCard 
                        textAlign = {textAlign}
                        title = 'Group Personal Accident Coverage'
                        icon = '/icons/Group.svg'
                    />
                    <BenifitCard 
                        textAlign = {textAlign}
                        title = 'Specialized Coverages like Plate Glass and Burglary'
                        icon = '/icons/Burglary.svg'
                    />

                </Flex>

                <Flex w = '100%' direction={['column-reverse', 'column-reverse', 'column-reverse', 'row', 'row']} gap = '20px' alignItems={'center'}>

                    <Flex h = 'fit-content' w = {['100%', '100%', '100%', '66.6%', '66.6%']} direction={'column'}>
                        <Heading fontFamily={'kanit'} fontWeight={'500'} fontSize={'45px'}>{`Have a Question? We're Here to Help!`}</Heading>
                        <Text my = '20px' fontSize={'16px'} color = 'brand.text'>Your concerns and queries matter to us. If you have any questions or need assistance, our dedicated support team is ready to provide the information you seek.</Text>
                        <Heading fontFamily={'kanit'} fontWeight={'500'} fontSize={'32px'}>Feel free to reach out</Heading>
                        <Heading fontFamily={'kanit'} fontWeight={'500'} fontSize={'32px'}>+60 11-1077 1700</Heading>
                    </Flex>

                    <Flex w = {['100%', '100%', '100%', '33.3%', '33.3%']}>
                        <Flex position={'relative'} w = '100%' h = '100%' minH = '350px'>
                            <Image src = '/images/help-image.png' alt = 'help_image' fill style={{ objectFit: 'contain' }} />
                        </Flex>
                    </Flex>

                </Flex>

                <Flex w = '100%' direction={'column'} alignItems={textAlign} border = '1px' borderColor={'brand.borderColor'} px = {['20px', '20px', '30px', '30px', '60px']} py = {['20px', '20px', '40px', '40px', '40px']} borderRadius={'10px'}>

                    <Heading mt = '20px' fontFamily={'kanit'} fontWeight={'500'} fontSize={'35px'} textAlign={textAlign}>DoctorShield Partner Association</Heading>

                    <Text mb = {['20px', '20px', '40px', '40px', '40px']} mt = {'20px'} textAlign={textAlign} fontSize={'16px'} color = 'brand.text'>{`We recognize that your clinic's needs are unique, and we offer a range of additional coverages to tailor your insurance package for comprehensive protection. Beyond our core offerings, consider enhancing your coverage with these additional safeguards:`}</Text>

                    <Flex position={'relative'} w = '100%' h = {['150px', '200px', '300px', '300px', '300px']}>
                        <Image src = '/images/asso-logo.png' alt = 'asso-logo' fill style = {{ objectFit: 'contain' }} />
                    </Flex>

                </Flex>

                <Heading id = 'faq' mt = '30px' fontFamily={'kanit'} fontWeight={'500'} fontSize={'32px'} textAlign={textAlign}>Frequently Asked Questions</Heading>

                <Flex w = '100%' direction={'column'} gap = '30px' px = {['0px', '0px', '0px', '100px', '100px']}>
                    <FAQ />
                </Flex>

                <Flex w = '100%' direction={'column'} alignItems={'center'} gap = '20px' px = {['10px', '50px', '50px', '100px', '250px']}>
                    <Text textAlign={'center'} fontSize={'16px'} color={'brand.text'}>{`For any other questions or inquiries, feel free to contact us. We're here to assist you in every way possible.`}</Text>
                    <BadgeText textAlign={'center'} text = '+60 11-1077 1700' />
                </Flex>

            </Flex>
            
            <Flex mt = '30px'>
                <Footer />
            </Flex>

        </Flex>
    )
}
