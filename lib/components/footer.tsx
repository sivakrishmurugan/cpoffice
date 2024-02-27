import { Flex, Text, Link, Heading } from "@chakra-ui/react";
import Image from 'next/image';
import NextLink from 'next/link';

const Footer = () => {
    return (
        <Flex w = '100%' direction={'column'}>
            
            <Flex w = '100%' direction={['column', 'column', 'column', 'row', 'row']} gap = {['30px', '30px', '30px', '0px', '0px']} bg = '#d9e7f1' p = {['30px', '30px', '30px', '40px', '40px']} borderRadius={'30px'} minH = '300px'>

                <Flex w = {['100%', '100%', '100%', '50%', '50%']} direction={'column'} gap = '5px' pr = '40px'>
                    <Flex position={'relative'} w = '160px' h = '60px'>
                        <Image src = '/icons/My-logo.svg' alt = 'logo' fill style={{ objectFit: 'contain' }} />
                    </Flex>
                    <Text fontSize={'16px'} color={'brand.text'}>DoctorShield is a collaborative effort of CHUBB and JA. With DoctorShield buying indemnity insurance is as easy as clicking a few buttons. DoctorShield is easy, fast and instant.</Text>
                </Flex>

                <Flex w = {['100%', '100%', '100%', '25%', '25%']} direction={'column'}>
                    <Heading mb = {['20px', '20px', '20px', '38px', '38px']} fontFamily={'kanit'} fontSize={'20px'} color = '#98a2c8' fontWeight={'500'}>Insurance</Heading>
                    <Flex direction={'column'} gap = '10px'>
                        <Link as = {NextLink} href = {'https://thedoctorshield.com'} fontFamily={'kanit'} fontSize={'20px'} color='black' textDecoration={'none'} _hover={{textDecoration: 'none', color: 'blackAlpha.700'}}>Medical Professional Indemnity</Link>
                        <Link as = {NextLink} href = {'/#'} fontFamily={'kanit'} fontSize={'20px'} color='black' textDecoration={'none'} _hover={{textDecoration: 'none', color: 'blackAlpha.700'}}>Clinic Property Insurance</Link>
                        <Link as = {NextLink} href = {'#'} fontFamily={'kanit'} fontSize={'20px'} color='black' textDecoration={'none'} _hover={{textDecoration: 'none', color: 'blackAlpha.700'}}>Clinic Indemnity <Text as = 'span' fontFamily={'kanit'} fontSize={'20px'} color = 'brand.secondary'>(Coming Soon)</Text></Link>
                    </Flex>
                </Flex>

                <Flex w = {['100%', '100%', '100%', '25%', '25%']} direction={'column'} pl = {['0px', '0px', '0px', '10px', '40px']}>
                    <Heading mb = {['20px', '20px', '20px', '38px', '38px']} fontFamily={'kanit'} fontSize={'20px'} color = '#98a2c8' fontWeight={'500'}>Quick Links</Heading>
                    <Flex direction={'column'} gap = '10px'>
                        <Link as = {NextLink} href = {'/#home'} fontFamily={'kanit'} fontSize={'20px'} color='black' textDecoration={'none'} _hover={{textDecoration: 'none', color: 'blackAlpha.700'}}>Home</Link>
                        <Link as = {NextLink} href = {'https://www.thedoctorshield.com/about-us'} fontFamily={'kanit'} fontSize={'20px'} color='black' textDecoration={'none'} _hover={{textDecoration: 'none', color: 'blackAlpha.700'}}>About us</Link>
                        <Link as = {NextLink} href = {'https://www.thedoctorshield.com/contact-us'} fontFamily={'kanit'} fontSize={'20px'} color='black' textDecoration={'none'} _hover={{textDecoration: 'none', color: 'blackAlpha.700'}}>Contact us</Link>
                    </Flex>
                    <Flex position={'relative'} w = {['230px', '230px', '200px', '200px', '230px']} h = '100px'>
                        <Image src = '/icons/Chubb-logo.svg' alt = 'chubb_logo' fill style={{ objectFit: 'contain' }} />
                    </Flex>
                </Flex>

            </Flex>

            <Flex flexWrap={'wrap'} mt = '20px' w = '100%' gap = '20px' px = {['10px', '10px', '20px', '20px', '20px']} justifyContent={['center', 'center', 'flex-start', 'flex-start', 'flex-start']}>
                <Link flexGrow={1} as = {NextLink} href = {'/#'} textAlign={['center', 'center', 'start', 'start', 'start']} fontSize={'18px'} color='black' textDecoration={'none'} _hover={{textDecoration: 'none', color: 'blackAlpha.700'}}>© DoctorShield™ All Rights Reserved 2024</Link>
                <Link as = {NextLink} href = {'/privacy_policy'} fontSize={'18px'} color='black' textDecoration={'none'} _hover={{textDecoration: 'none', color: 'blackAlpha.700'}}>Privacy Policy</Link>
                <Link as = {NextLink} href = {'/terms_of_use'} fontSize={'18px'} color='black' textDecoration={'none'} _hover={{textDecoration: 'none', color: 'blackAlpha.700'}}>Terms of Use</Link>
            </Flex>

        </Flex>
    );
}

export default Footer;