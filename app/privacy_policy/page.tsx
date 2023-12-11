import { Alert, AlertIcon, Button, Flex, Heading, ListItem, Modal, ModalBody, ModalContent, ModalOverlay, Text, UnorderedList, UseRadioProps, useRadio, useRadioGroup } from "@chakra-ui/react";
import { useClient, useLocalStorage, useSessionStorage } from "@/lib/hooks";
import { getNumberFromString, getRecentYears } from "@/lib/utlils/utill_methods";
import { ClaimDeclarationAdditionalData } from "@/lib/types";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import ClaimInfoRowForm from "@/lib/components/forms/claim_info_row_form";
import BottomActions from "@/lib/components/bottom_actions";
import { redirect, useRouter } from "next/navigation";
import { Metadata, NextPage } from "next";
import Image from 'next/image';
import axiosClient from "@/lib/utlils/axios";
import useCoverage from "@/lib/hooks/use_coverage";
import PaymentStatus, { PaymentStatusType } from "@/lib/components/forms/payment_status";
import { JWTService } from "@/lib/utlils/jwt";
import { APP_MAX_WIDTH, APP_WIDTH } from "@/lib/app/app_constants";
import Footer from "@/lib/components/footer";

interface PageProps {}

export const metadata: Metadata = {
    title: 'Privacy plicy'
};

const PrivacyPolicy: NextPage<PageProps> = async ({}) => {

    return (
        <Flex w = '100%' direction={'column'} alignItems={'center'} gap = '30px' pb = '20px'>
            <Flex direction={'column'} maxW = '100vw' w = '100%' position={'absolute'} left={0} alignItems={'center'} justifyContent={'center'}>
                <Flex 
                    w = '100%'
                    minH = '150px'
                    py = '20px'
                    backgroundColor={'brand.primary'}
                    justifyContent={'center'}
                    alignItems={'center'}
                >
                    <Heading textAlign={'center'} fontFamily={'kanit'} fontSize={['32px', '32px', '42px', '42px', '42px']} color = 'white' fontWeight={'extrabold'}>PRIVACY POLICY</Heading>
                </Flex>
            </Flex>
            <Flex 
                mt = '180px'
                maxW = {APP_MAX_WIDTH}
                w = {APP_WIDTH}
                gap = '30px'
                direction={'column'} bg= ' white'
                borderRadius={'30px'} paddingY = '60px' px = {['15px', '20px', '20px', '130px', '130px']}
            >
                <PolicyCard 
                    title = "Privacy And Cookie Policy"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>This Privacy Policy governs the manner in which JA Assure Sdn. Bhd. collects, uses, maintains and discloses information collected from users (each, a “User”) of the Thedoctorshield.com website (“Site”). This privacy policy applies to the Site and all products and services offered by JA Assure Sdn. Bhd.</Text>}
                />
                    <PolicyCard 
                    title = "Personal Identification Information"
                    content = {
                        <Flex direction={'column'} gap = '15px'>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`We may collect User’s personal information from Users, third parties, or publicly available resources in a variety of ways, including (but not limited to):`}</Text>
                            <UnorderedList>
                                <ListItem>your name;</ListItem>
                                <ListItem>contact details (including mobile phone, telephone, address and email);</ListItem>
                                <ListItem>age;</ListItem>
                                <ListItem>gender;</ListItem>
                                <ListItem>marital status;</ListItem>
                                <ListItem>occupational information;</ListItem>
                                <ListItem>health and other medical information;</ListItem>
                                <ListItem>lifestyle information that relates to insurance;</ListItem>
                                <ListItem>previous or current insurance; or</ListItem>
                                <ListItem>driving history</ListItem>
                            </UnorderedList>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`and such other information which is relevant and necessary to providing products and services to you or to comply with the law.`}</Text>
                        </Flex>
                    }
                />
                <PolicyCard 
                    title = "Why We Collect Personal Information"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{`We will inform you of the main reasons for collecting your personal information at the time we request it. The purposes for which we will generally collect and use your information include considering any application you make to us, providing products and services to you, performing administrative functions, communicating with you, verifying your identity, preventing and detecting fraud or loss, enhancing our products and services and telling you about our other products and services which may include those of our business partners, which we believe may interest you. You may tell us at any time that you do not want us to advise you about other products and services`}</Text>}
                />
                <PolicyCard 
                    title = "Non-Personal Identification Information"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{`We may collect non-personal information about Users whenever they interact with our Site. Non-personal information may include the browser name, the type of computer, Address, Location, technical information about the User’s means of connection to our Site (such as the operating system, the Internet service providers utilized) and other similar information.`}</Text>}
                />
                <PolicyCard 
                    title = "Web Browser Cookies"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{`Our Site may use “cookies” to enhance User experience. Most sites, like ours, use cookies for record-keeping purposes and at times to track information about the User. The User may choose to set their web browser to refuse cookies, or to alert you when cookies are being sent. However, do note that as a result, some User activity or Site functionalities may be limited and there might be slight delays in the Site’s operations.`}</Text>}
                />
                <PolicyCard 
                    title = "How we use collected information "
                    content = {
                        <Flex direction={'column'} gap = '15px'>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`JA Assure Sdn. Bhd. collects and uses Users personal information for the following purposes:`}</Text>
                            <UnorderedList>
                                <ListItem>{`To improve customer service – Your information helps us to more effectively respond to your customer service requests and support needs.`}</ListItem>
                                <ListItem>{`To personalize user experience – We may use information in the aggregate to understand how our Users as a group use the services and resources provided on our Site.`}</ListItem>
                                <ListItem>{`To improve our Site – We continually strive to improve our website offerings based on the information and feedback we receive from you.`}</ListItem>
                                <ListItem>{`To process transactions – We may use the information Users provide about themselves when placing an order only to provide service to that order. We do not share this information with outside parties except to the extent necessary to provide the service.`}</ListItem>
                                <ListItem>{`To deliver media content, promotions, surveys or other Site features – To send Users information they agreed to receive about topics we think will be of interest to them.`}</ListItem>
                                <ListItem>{`For legal purposes, or matters relating to disputes, billing or fraud`}</ListItem>
                            </UnorderedList>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`The email address Users provide for order processing, will only be used to send them information and updates pertaining to their order. It may also be used to respond to their inquiries, and/or other requests or questions. If User decides to opt-in to our mailing list, they will receive emails that may include company news, updates, related product or service information, etc. User may choose to unsubscribe from receiving future emails using the unsubscribe link at the bottom of each email.`}</Text>
                        </Flex>
                    }
                />
                <PolicyCard 
                    title = "How We Protect Your Information"
                    content = {
                    <Flex direction={'column'} gap = '15px'>
                        <Text fontSize={'18px'} color = '#4d4d4d'>{`We adopt appropriate data collection, storage and processing practices and security measures to protect against unauthorized access, alteration, disclosure or destruction of your personal information, username, password, transaction information and data stored on our Site. User’s personal information may be disclosed to JA Assure Sdn. Bhd. employees or third parties like partnering companies, professional advisors, and relevant law enforcement or authoritative bodies for the purposes mentioned in the section above.`}</Text>
                        <Text fontSize={'18px'} color = '#4d4d4d'>{`Sensitive and private data exchange between the Site and its Users happens over a SSL secured communication channel and is encrypted and protected with digital signatures.`}</Text>
                    </Flex>
                    }
                />
                <PolicyCard 
                    title = "Sharing Your Personal Information"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{`We do not sell, trade, or rent Users personal identification information to others. We may share generic aggregated demographic information not linked to any personal identification information regarding visitors and users with our business partners, trusted affiliates and advertisers for the purposes outlined above. We may use third party service providers to help us operate our business and the Site or administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.`}</Text>}
                />
                <PolicyCard 
                    title = "Third Party Websites"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{`Users may find advertising or other content on our Site that is linked to the sites and services of our partners, suppliers, advertisers, sponsors, licensors or other third parties. We do not control the content or links that appear on these sites and are not responsible for the practices employed by websites linked to or from our Site. In addition, these sites or services, including their content and links, may be constantly changing. These sites and services have their own privacy policies and customer service policies. As such, browsing and interaction on any other website, including websites which have a link to our Site, is subject to that website’s own terms and policies.`}</Text>}
                />
                <PolicyCard 
                    title = "Changes To This Privacy Policy"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{`JA Assure Sdn. Bhd. has the discretion to update this privacy policy at any time. If and when we do, Users can revise the updated date at the bottom of this page. We encourage Users to check this page for any changes to our policies in order to stay informed about how we protect the personal information we collect. It is the User’s responsibility to review this privacy policy periodically and become aware of modifications if and when they happen.`}</Text>}
                />
                <PolicyCard 
                    title = "Your Acceptance Of These Terms"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{`By using this Site, you are hereby agreeing to the above mentioned policies. If you do not agree to this policy, we advise that you do not use our Site. Your continued use of the Site following any changes to the above policies will be regarded as your acceptance of those changes.`}</Text>}
                />
                <PolicyCard 
                    title = "Contacting Us"
                    content = {
                        <Flex direction={'column'}>
                            <Text mb = '15px' fontSize={'18px'} color = '#4d4d4d'>{`If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:`}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`JA ASSURE SDN. BHD`}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`Unit 19A-25-2, Wisma UOA`}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`No. 19 Jalan Pinang,`}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`50450 Kuala Lumpur, Malaysia.`}</Text>
                        </Flex> 
                    }
                />
            </Flex>
            <Footer />
        </Flex>
    );
}

export default PrivacyPolicy;

const PolicyCard = ({ title, content }: { title: string, content: JSX.Element }) => {
    return (
        <Flex direction={'column'} gap = '20px' fontSize={'18px'}>
            <Heading fontFamily={'kanit'} fontWeight={'500'} fontSize={'25px'} textTransform={'uppercase'}>{title}</Heading>
            {content}
        </Flex>
    );
}
