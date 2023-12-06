import { Flex, Text } from "@chakra-ui/react";

interface BadgeTextProps {
    textAlign: string | string[] | any
    text: string
}

const BadgeText = ({ text, textAlign }: BadgeTextProps) => {
    return (
        <Flex w = {['100%', '100%', 'fit-content', 'fit-content', 'fit-content']} px = '40px' py = '10px' alignItems={'center'} bg = 'brand.primary' borderRadius={'50px'}>
            <Text w = '100%' textAlign={textAlign} fontSize={'18px'} color={'white'}>{text}</Text>
        </Flex>
    );
}

export default BadgeText;