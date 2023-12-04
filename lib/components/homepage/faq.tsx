"use client"
import { Text, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Flex } from "@chakra-ui/react";
import Image from "next/image";

interface FAQProps {
    title: string,
    content: string
} 

const FAQ = ({ content, title }: FAQProps) => {
    return (
        <Accordion allowMultiple w = "100%">
            <AccordionItem py = "20px" border = "1px" borderColor={'brand.borderColor'} borderRadius={"10px"} transition={'box-shadow 300ms ease-in-out'} boxShadow={'0 1px 2px rgba(46, 50, 60, .09)'} _hover={{ boxShadow: '0 3px 9px rgba(46, 50, 60, .09)' }}> 
                {(props) => 
                    <>
                        <AccordionButton px = {['20px', '20px', '20px', '32px', '32px']} gap = {['20px', '20px', '20px', '30px', '30px']} border = "0px" borderRadius={"8px"} _hover={{}} _focus = {{boxShadow: "none"}} display={"flex"} justifyContent={"space-between"}>
                            <Flex gap = {['15px', '15px', '15px', '25px', '25px']} alignItems={'center'}>
                                <Flex flexShrink={0} position={'relative'} w = {['35px', '35px', '35px', '50px', '50px']} h = {['35px', '35px', '35px', '50px', '50px']}>
                                    <Image src = '/icons/discuss-issue.svg' alt = 'logo' fill style={{ objectFit: 'contain' }} />
                                </Flex>
                                <Text textAlign={'start'} fontWeight={'bold'} fontSize={'18px'} color = 'black'>{title}</Text>
                            </Flex>
                            <AccordionIcon w = '35px' h = '35px' />
                        </AccordionButton>
                        <AccordionPanel py = '0px' pr = '20px' pl = {['70px', '70px', '70px', '108px', '108px']} borderRadius={"10px"}>
                            {content}
                        </AccordionPanel>
                    </>
                }
            </AccordionItem>
        </Accordion>
    );
}

export default FAQ;