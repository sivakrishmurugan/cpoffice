"use client"
import { Drawer, DrawerBody, DrawerContent, DrawerOverlay, Flex, Icon, IconButton, Link, useDisclosure } from "@chakra-ui/react";
import Image from "next/image";
import { NavMenuIcon } from "../icons";
import { APP_BORDER_COLOR, APP_MAX_WIDTH, APP_SECONDARY_COLOR } from "../app/app_constants";
import NextLink from 'next/link';
import { useRouter, usePathname } from "next/navigation";

const Header = () => {
    const { isOpen, onClose, onOpen, onToggle } = useDisclosure()
    const pathname = usePathname();
    const router = useRouter();
    const navSuportedRoutes = ['/', '/privacy_policy', '/terms_of_use']
    const hideNavLinks = navSuportedRoutes.includes(pathname) == false;

    const onClickLogo = () => {
        router.push('/');
    }

    return (
        <>
            <MobileNavDrawer isOpen = {isOpen} onClose = {onClose} />
            <Flex position={'sticky'} top = '0px' zIndex={1400} transition = 'box-shadow 500ms ease-in-out' boxShadow={isOpen ? `0px 2px 0px ${APP_SECONDARY_COLOR}` : `0px 1px 1px ${APP_BORDER_COLOR}`} w = '100%' h = '60px' bg = 'white' justifyContent={'center'}>
                <Flex w = {APP_MAX_WIDTH.map((e, i) => i < 4 ? e : (Number(e.replace('px', '')) + 100).toString() + 'px')} alignItems={'center'} justifyContent={'space-between'} px = {['20px', '35px', '40px', '20px', '20px']} gap = '20px'>
                    <Flex h = '100%' onClick={onClickLogo} as = 'button' _focusVisible={{ boxShadow: 'var(--chakra-shadows-outline)', outline: 'none' }}>
                        <Flex position={'relative'} w = {hideNavLinks ? '300px' : '150px'} h = '100%'>
                            <Image src = {hideNavLinks ? '/icons/My-Ds-logo.svg' : '/icons/My-logo.svg'} priority = {true} alt="logo" fill style = {{ objectFit: 'contain' }} />
                        </Flex>
                    </Flex>
                    <Flex w = '100%' h = '100%' justifyContent={'flex-end'} alignItems={'center'} gap  ='40px'>
                        <Nav hideNavLinks = {hideNavLinks} onClose={onClose} onToggle={onToggle} isOpen={isOpen} />
                        <Flex display={['none',  'none', 'none', 'flex', 'flex']} position={'relative'} w = '150px' h = '100%'>
                            <Image src = '/icons/Chubb-logo.svg' alt="logo" fill style = {{ objectFit: 'contain' }} />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </>
    );
}

export default Header;

const Nav = ({ hideNavLinks, isOpen, onClose, onToggle }: { hideNavLinks: boolean, isOpen: boolean, onClose: () => void, onToggle: () => void }) => {
    const onNavClicked = () => onClose();
    return (
        <>
            {
                hideNavLinks == false &&
                <>
                    <Flex display={['none',  'none', 'none', 'flex', 'flex']} gap = {['0px', '0px', '30px', '40px', '50px']}>
                        <NavLinks onNavClicked = {onNavClicked} />
                    </Flex>
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

const MobileNavDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const onNavClicked = () => onClose();

    return (
        <Flex w = '100vw' mt = {!isOpen ? '-400px' : '60px'} boxShadow={'var(--chakra-shadows-lg)'} zIndex={1400} position={'fixed'} transition={'margin 500ms ease-in-out'} right = '0' top = '0' bg = 'white'>
            <Flex w = '100%' py = '20px' px = '40px' direction={'column'} gap = '10px'>
                <NavLinks withHoverBg onNavClicked = {onNavClicked} />
                <Flex ml = '20px' position={'relative'} w = '150px' h = '60px'>
                    <Image src = '/icons/Chubb-logo.svg' alt="logo" fill style = {{ objectFit: 'contain' }} />
                </Flex>
            </Flex>
        </Flex>
    );

    return (
        <Drawer isOpen = {isOpen} onClose={onClose} placement = "top" blockScrollOnMount = {false}>
            <DrawerOverlay display={'none'} />
            <DrawerContent mt = '60px' containerProps = {{ zIndex: 1300 }}>
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
    );
}

const NavLinks = ({ withHoverBg, onNavClicked }: { withHoverBg?: boolean, onNavClicked: () => void }) => {
    return (
        <>
            <Link 
                onClick={onNavClicked}
                //as = {NextLink} 
                href = {'/#home'} 
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