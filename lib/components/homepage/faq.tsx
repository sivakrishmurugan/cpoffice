"use client"
import { FAQ_LIST } from "@/lib/app/app_constants";
import { Text, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex } from "@chakra-ui/react";
import Image from "next/image";

interface FAQListProps {} 

const FAQList = ({}: FAQListProps) => {
    return (
        <Accordion allowToggle display={'flex'} flexDir={'column'} gap = '30px' w = "100%">
            {
                FAQ_LIST.map(faq => {
                    return <AccordionItem key = {faq.question} py = "20px" border = "1px" borderColor={'brand.borderColor'} borderRadius={"10px"} transition={'box-shadow 300ms ease-in-out'} boxShadow={'0 1px 2px rgba(46, 50, 60, .09)'} _hover={{ boxShadow: '0 3px 9px rgba(46, 50, 60, .09)' }}> 
                        {(props) => 
                            <>
                                <AccordionButton px = {['20px', '20px', '20px', '32px', '32px']} gap = {['20px', '20px', '20px', '30px', '30px']} border = "0px" borderRadius={"8px"} _hover={{}} _focus = {{boxShadow: "none"}} display={"flex"} justifyContent={"space-between"} _focusVisible={{ boxShadow: 'var(--chakra-shadows-outline)' }}>
                                    <Flex gap = {['15px', '15px', '15px', '25px', '25px']} alignItems={'center'}>
                                        <Flex flexShrink={0} position={'relative'} w = {['35px', '35px', '35px', '50px', '50px']} h = {['35px', '35px', '35px', '50px', '50px']}>
                                            <Image src = '/icons/discuss-issue.svg' alt = 'logo' fill style={{ objectFit: 'contain' }} />
                                        </Flex>
                                        <Text fontFamily={'kanit'} textAlign={'start'} fontWeight={'500'} fontSize={'18px'} color = 'black'>{faq.question}</Text>
                                    </Flex>
                                    <AccordionIcon w = '35px' h = '35px' />
                                </AccordionButton>
                                <AccordionPanel py = '0px' pr = {['20px', '20px', '50px', '50px', '60px']} pl = {['20px', '20px', '70px', '108px', '108px']} borderRadius={"10px"}>
                                    <Flex display={['flex', 'flex', 'none', 'none', 'none']} my = '15px' w = '100%' borderTop = '1px' borderColor = 'brand.borderColor'></Flex>
                                    {faq.answer}
                                </AccordionPanel>
                            </>
                        }
                    </AccordionItem>
                })
            }
        </Accordion>
    );
}

export default FAQList;