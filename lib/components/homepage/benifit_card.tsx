import { Flex, Heading } from "@chakra-ui/react";
import Image from 'next/image';

interface BenifitCardProps {
    textAlign?: string | string[] | any,
    icon: string,
    title: string
}

const BenifitCard = ({ textAlign, icon, title }: BenifitCardProps) => {
    return (
        <Flex w = '100%' h = '100%' direction={'column'} gap = '20px' alignItems={textAlign} border = '1px' borderColor={'brand.borderColor'} px = {['20px', '20px', '30px', '30px', '30px']} py = {['20px', '20px', '80px', '80px', '80px']} borderRadius={'10px'}>
            <Flex position={'relative'} w = '80px' h = '80px'>
                <Image src = {icon} alt = 'fire_insurance' fill style={{ objectFit: 'contain' }} />
            </Flex>
            <Heading fontFamily={'kanit'} fontWeight={'500'} textAlign={textAlign} fontSize={'25px'}>{title}</Heading>
        </Flex>
    );
}

export default BenifitCard;