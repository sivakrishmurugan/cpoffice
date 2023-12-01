import { Button, Flex, Heading, Modal, ModalBody, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import Image from "next/image";
import { convertToPriceFormat } from "../utlils/utill_methods";

interface MaxLimitExceededPopupProps {
    isOpen: boolean,
    currentValue: number,
    onClose: () => void
}
 
const MaxLimitExceededPopup = ({ isOpen, currentValue, onClose }: MaxLimitExceededPopupProps) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent borderRadius={'12px'} maxW = {['90%', '90%', '38rem', '38rem', '38rem']}>
                <ModalBody py ={['40px', '40px', '0px', '0px', '0px']} >
                    <Flex p = {['0px', '0px', '30px', '30px', '30px']} direction={'column'} gap = {['20px', '20px', '30px', '30px', '30px']} alignItems={'center'}>
                        <Flex m = 'auto' position={'relative'} w = '80px' h = '80px'>
                            <Image src='/icons/error_icon.svg' fill style = {{ objectFit: 'contain' }} alt={"quate_submit_in_process_image"} />
                        </Flex>
                        <Heading textAlign={'center'} color = 'brand.primary' fontSize={'16px'}>Total coverage value (coverages & optional coverages) cannot be more than RM 10,000,000</Heading>
                        <Text textAlign={'center'} color = 'brand.primary' fontSize={'14px'}>
                            Your current total coverage value is
                            <Text as = 'span' fontWeight={'bold'} fontSize={'16px'} ml = '5px'>RM {convertToPriceFormat(currentValue, true, true)}</Text>
                        </Text>
                        <Button onClick = {onClose} h = '40px' w = '250px' bg = 'brand.mediumViolet' color = 'white' _focus={{}} _hover={{}}>Close</Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}

export default MaxLimitExceededPopup;