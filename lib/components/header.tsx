"use client"
import { Flex, Icon, IconButton, Link } from "@chakra-ui/react";
import Image from "next/image";
import { NavMenuIcon } from "../icons";
import { APP_MAX_WIDTH } from "../app/app_constants";
import NextLink from 'next/link';
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();
    const hideNavLinks = pathname != '/'
    return (
        <Flex position={'sticky'} top = '0px' zIndex={1000} borderBottom={'1px'} borderColor={'brand.borderColor'} w = '100%' h = '60px' bg = 'white' justifyContent={'center'}>
            <Flex w = {APP_MAX_WIDTH.map((e, i) => i < 4 ? e : (Number(e.replace('px', '')) + 100).toString() + 'px')} alignItems={'center'} justifyContent={'space-between'} px = '20px' gap = '20px'>
                <Flex h = '100%'>
                    <Flex position={'relative'} w = {hideNavLinks ? '300px' : '150px'} h = '100%'>
                        <Image src = {hideNavLinks ? '/icons/My-Ds-logo.svg' : '/icons/My-logo.svg'} alt="logo" fill objectFit="contain" />
                    </Flex>
                </Flex>
                <Flex w = '100%' h = '100%' justifyContent={'flex-end'} alignItems={'center'} gap  ='40px'>
                    {
                        hideNavLinks == false &&
                        <>
                            <Flex display={['none',  'none', 'none', 'flex', 'flex']} gap = {['0px', '0px', '30px', '40px', '50px']}>
                                <Link as = {NextLink} href = {'#'} fontSize={'14px'} color='#040431' textDecoration={'none'} _hover={{textDecoration: 'none'}} fontWeight={'bold'}>Home</Link>
                                <Link as = {NextLink} href = {'#Coverages'} fontSize={'14px'} color='#040431' textDecoration={'none'} _hover={{textDecoration: 'none'}}  fontWeight={'bold'}>Coverages</Link>
                                <Link as = {NextLink} href = {'#Advantages'} fontSize={'14px'} color='#040431' textDecoration={'none'} _hover={{textDecoration: 'none'}}  fontWeight={'bold'}>Advantages</Link>
                                <Link as = {NextLink} href = {'#FAQ'} fontSize={'14px'} color='#040431' textDecoration={'none'} _hover={{textDecoration: 'none'}}  fontWeight={'bold'}>FAQ</Link>
                                <Link as = {NextLink} href = {'#'} fontSize={'14px'} color='#040431' textDecoration={'none'} _hover={{textDecoration: 'none'}}  fontWeight={'bold'}>Contact Us</Link>
                            </Flex>
                            <Flex display={['flex',  'flex', 'flex', 'none', 'none']} position={'relative'}>
                                <IconButton 
                                    aria-label="nav-menu-button"
                                    borderRadius={'0px'}
                                    variant={'outline'}
                                    h = 'fit-content'
                                    p = '5px'
                                    icon={<Icon w = '25px' h = '25px' as = {NavMenuIcon} />}
                                />
                            </Flex>
                        </>
                    }
                    <Flex display={['none',  'none', 'none', 'flex', 'flex']} position={'relative'} w = '150px' h = '100%'>
                        <Image src = '/icons/Chubb-logo.svg' alt="logo" fill objectFit="contain" />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Header;