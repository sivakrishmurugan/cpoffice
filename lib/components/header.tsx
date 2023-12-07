"use client"
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex, Icon, IconButton, Link, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import { NavMenuIcon } from "../icons";
import { APP_MAX_WIDTH } from "../app/app_constants";
import NextLink from 'next/link';
import { usePathname } from "next/navigation";

const Header = () => {
    const pathname = usePathname();
    const hideNavLinks = pathname != '/'
    return (
        <Flex position={'sticky'} top = '0px' zIndex={3000} borderBottom={'1px'} borderColor={'brand.borderColor'} w = '100%' h = '60px' bg = 'white' justifyContent={'center'}>
            <Flex w = {APP_MAX_WIDTH.map((e, i) => i < 4 ? e : (Number(e.replace('px', '')) + 100).toString() + 'px')} alignItems={'center'} justifyContent={'space-between'} px = {['20px', '35px', '40px', '20px', '20px']} gap = '20px'>
                <Flex h = '100%'>
                    <Flex position={'relative'} w = {hideNavLinks ? '300px' : '150px'} h = '100%'>
                        <Image src = {hideNavLinks ? '/icons/My-Ds-logo.svg' : '/icons/My-logo.svg'} priority = {true} alt="logo" fill style = {{ objectFit: 'contain' }} />
                    </Flex>
                </Flex>
                <Flex w = '100%' h = '100%' justifyContent={'flex-end'} alignItems={'center'} gap  ='40px'>
                    <Nav hideNavLinks = {hideNavLinks} />
                    <Flex display={['none',  'none', 'none', 'flex', 'flex']} position={'relative'} w = '150px' h = '100%'>
                        <Image src = '/icons/Chubb-logo.svg' alt="logo" fill style = {{ objectFit: 'contain' }} />
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default Header;

const Nav = ({ hideNavLinks }: { hideNavLinks: boolean }) => {
    const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
    const onNavClicked = () => onClose();
    return (
        <>
            {
                hideNavLinks == false &&
                <>
                    <Flex display={['none',  'none', 'none', 'flex', 'flex']} gap = {['0px', '0px', '30px', '40px', '50px']}>
                        <NavLinks onNavClicked = {onNavClicked} />
                    </Flex>
                    <Drawer isOpen = {isOpen} onClose={onClose} placement = "top" blockScrollOnMount = {false}>
                        <DrawerOverlay display={'none'} />
                        <DrawerContent mt = '60px' borderTop={'2px'} borderColor={'brand.secondary'}>
                            <DrawerBody py = '20px' px = '20px'>
                                <Flex direction={'column'} gap = '10px'>
                                    <NavLinks withHoverBg onNavClicked = {onNavClicked} />
                                    <Flex ml = '20px' position={'relative'} w = '150px' h = '60px'>
                                        <Image src = '/icons/Chubb-logo.svg' alt="logo" fill style = {{ objectFit: 'contain' }} />
                                    </Flex>
                                </Flex>
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                    <Flex display={['flex',  'flex', 'flex', 'none', 'none']} position={'relative'}>
                        <IconButton 
                            onClick={onToggle}
                            aria-label="nav-menu-button"
                            borderRadius={'0px'}
                            bg = 'white'
                            h = 'fit-content'
                            p = '5px'
                            icon={<Icon w = '25px' h = '25px' as = {NavMenuIcon} />}
                        />
                    </Flex>
                </>
            }
        </>
    );
}

const NavLinks = ({ withHoverBg, onNavClicked }: { withHoverBg?: boolean, onNavClicked: () => void }) => {
    return (
        <>
            <Link 
                onClick={onNavClicked}
                //as = {NextLink} 
                href = {'#home'} 
                py = {withHoverBg ? '10px' : '0px'} borderRadius={'10px'} _hover={{textDecoration: 'none', bg: withHoverBg ? 'gray.200' : 'white' }} pl = {withHoverBg ? '20px' : '0px'}
                fontSize={'14px'} color='#040431' textDecoration={'none'} fontWeight={'bold'}
            >Home</Link>
            <Link 
                onClick={onNavClicked}
                as = {NextLink} href = {'#coverages'} 
                py = {withHoverBg ? '10px' : '0px'} borderRadius={'10px'} _hover={{textDecoration: 'none', bg: withHoverBg ? 'gray.200' : 'white' }} pl = {withHoverBg ? '20px' : '0px'}
                fontSize={'14px'} color='#040431' textDecoration={'none'} fontWeight={'bold'}
            >Coverages</Link>
            <Link 
                onClick={onNavClicked}
                as = {NextLink} href = {'#advantages'} 
                py = {withHoverBg ? '10px' : '0px'} borderRadius={'10px'} _hover={{textDecoration: 'none', bg: withHoverBg ? 'gray.200' : 'white' }} pl = {withHoverBg ? '20px' : '0px'}
                fontSize={'14px'} color='#040431' textDecoration={'none'} fontWeight={'bold'}
            >Advantages</Link>
            <Link 
                onClick={onNavClicked}
                as = {NextLink} href = {'#faq'} 
                py = {withHoverBg ? '10px' : '0px'} borderRadius={'10px'} _hover={{textDecoration: 'none', bg: withHoverBg ? 'gray.200' : 'white' }} pl = {withHoverBg ? '20px' : '0px'}
                fontSize={'14px'} color='#040431' textDecoration={'none'} fontWeight={'bold'}
            >FAQ</Link>
            <Link 
                onClick={onNavClicked}
                as = {NextLink} href = {'https://www.thedoctorshield.com/contact-us'} 
                py = {withHoverBg ? '10px' : '0px'} borderRadius={'10px'} _hover={{textDecoration: 'none', bg: withHoverBg ? 'gray.200' : 'white' }} pl = {withHoverBg ? '20px' : '0px'}
                fontSize={'14px'} color='#040431' textDecoration={'none'} fontWeight={'bold'}
            >Contact us</Link>
        </>
    );
}