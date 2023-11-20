"use client"
import { Flex, Icon, IconButton } from "@chakra-ui/react";
import Image from "next/image";
import { NavMenuIcon } from "./icons";

const Header = () => {
    return (
        <Flex position={'sticky'} top = '0px' zIndex={1000} borderBottom={'1px'} borderColor={'brand.borderColor'} w = '100%' h = '60px' bg = 'white' px = '20px' alignItems={'center'} justifyContent={'space-between'}>
            <Flex position={'relative'} w = '150px' h = '100%'>
                <Image src = '/icons/My-logo.svg' alt="logo" fill objectFit="contain" />
            </Flex>
            <Flex display={['none',  'none', 'flex', 'flex', 'flex']} position={'relative'} w = '150px' h = '100%'>
                <Image src = '/icons/Chubb-logo.svg' alt="logo" fill objectFit="contain" />
            </Flex>
            <Flex display={['flex',  'flex', 'none', 'none', 'none']} position={'relative'}>
                <IconButton 
                    aria-label="nav-menu-button"
                    borderRadius={'0px'}
                    variant={'outline'}
                    h = 'fit-content'
                    p = '5px'
                    icon={<Icon w = '25px' h = '25px' as = {NavMenuIcon} />}
                />
            </Flex>
        </Flex>
    );
}

export default Header;