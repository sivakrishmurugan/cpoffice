import { Flex, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import { Metadata, NextPage } from "next";
import Footer from "@/lib/components/footer";

interface PageProps {}

export const metadata: Metadata = {
    title: 'Terms of use'
};

const TermsOfUse: NextPage<PageProps> = async ({}) => {

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
                    <Heading fontFamily={'kanit'} textAlign={'center'} fontSize={['32px', '32px', '42px', '42px', '42px']} color = 'white' fontWeight={'bold'} textTransform={'uppercase'}>Terms of use</Heading>
                </Flex>
            </Flex>
            <Flex 
                mt = '180px'
                gap = '30px'
                direction={'column'} bg= ' white'
                borderRadius={'30px'} paddingY = '60px' px = {['15px', '20px', '20px', '130px', '130px']}
            >
                <TermsOfUseCard 
                    title = "Terms Of Use Website"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{'Please carefully read this agreement (“Agreement”) before accessing or using this Internet Website (“Web Site”). The Website is strictly for the use of Medical Practitioner, Dental Practitioner, Allied Health Practitioner in Malaysia, Nurses, Hospital staff, medical assistant; and Lecturer and Student in a medical institute or related institute located in Malaysia, approved by Malaysian Medical Council, Malaysian Dental Council and Malaysian Allied Health Professions Council respectively. When you access or use this Web Site, you agree to be bound by this Agreement, including the liability disclaimers contained below. If you do not agree to the terms contained herein, do not use this Web Site or download any information from it. Materials on this Web Site may be accessed, downloaded and printed only for personal and non-commercial use. By using this Web Site, you agree that you will not use any materials or information found on this Web Site for any purpose that is unlawful or prohibited by this Agreement, including, but not limited to, the use of this Web Site from locations outside of the Malaysia or if you are under 18 years of age. Your permission to use the Web Site is automatically terminated if you violate any of the terms contained in this Agreement.'}</Text>}
                />
                <TermsOfUseCard 
                    title = "Copyright And Trademark Rights"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{'The contents of this site are owned by JA Assure Sdn. Bhd. and are protected by the laws of the Malaysia, its treaty countries and other jurisdictions. All rights are reserved and no reproduction, distribution, or transmission of the copyrighted materials at this Web Site is permitted without the written permission of JA Assure Sdn. Bhd.. All trademarks, logos and service marks are the property of JA Assure Sdn. Bhd.'}</Text>}
                />
                <TermsOfUseCard 
                    title = "Consent"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{'You hereby understand and agree that by using this Web Site, you automatically and without any further action have established a business relationship between you and JA Assure Sdn. Bhd. As a result, you agree to allow JA Assure Sdn. Bhd. to contact you about its business via telephone, e-mail and /or standard mail using the contact information you have provided.'}</Text>}
                />
                <TermsOfUseCard 
                    title = "Liability Disclaimer"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{'This company strives to make sure that the information on its web site is accurate, but inaccuracies or errors can occur. You use this web site at your own risk JA Assure Sdn. Bhd. Reserves the right to change or modify the content of its web site at any time with or without notice. Your continued use of this web site constitutes your acceptance of such modified terms. This web site and all of the information contained therein are provided “as is.” JA Assure Sdn. Bhd. Disclaims any and all warranties of any kind, whether express or implied, as to anything whatsoever relating to this web site and any information provided herein, including without limitation the implied warranties of merchantability, fitness for a particular purpose, title, and noninfringement. JA Assure Sdn. Bhd. Is not liable for any direct, indirect, special, punitive, incidental or consequential damages caused by the use of this web site and/or the content located thereon, whether resulting in whole or in part, from breach of contract, tortious conduct, negligence, strict liability or any other cause of action. Because some jurisdictions do not allow the exclusion of implied warranties, the above exclusion may not apply to you.'}</Text>}
                />
                <TermsOfUseCard 
                    title = "Indemnification/Legal Relief"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{'You agree to indemnify and hold JA Assure Sdn. Bhd. harmless from and against any and all loss, cost, damage, or expense including, but not limited to, reasonable attorneys’ fees incurred by JA Assure Sdn. Bhd. arising out of any action at law or other proceeding necessary to enforce any of the terms, covenants or conditions of the Agreement or due to your breach of this Agreement.'}</Text>}
                />
                <TermsOfUseCard 
                    title = "Governing Law And Venue"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{'This Agreement shall be governed by the laws of Malaysia. You hereby consent and voluntarily submit to personal jurisdiction in Malaysia, in and by the courts of Malaysia, in any action in which a claim is brought with respect to this Agreement and you agree that it may be served with process in any such action by hand delivery, courier, overnight delivery service, or certified or registered mail, return receipt requested. You irrevocably and unconditionally waive and agree not to plead, to the fullest extent permitted by law, any objection that it may now or hereafter have to the laying of venue or the convenience of the forum of any action or claim with respect to this Agreement brought in the Malaysia.'}</Text>}
                />
                <TermsOfUseCard 
                    title = "No Advice"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{'Our website does not provide you with any personal, financial, investment or any advice of any kind. Our website and the information it contains does not take into account your particular financial or insurance position or requirements and you should always obtain professional advice before acting upon any of the information contained on our website or other links contained on our website.'}</Text>}
                />
                <TermsOfUseCard 
                    title = "Transactions On Our Website"
                    content = {
                        <Flex direction={'column'} gap = '15px'>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`To the extent permitted by law you will receive all of your insurance documents electronically. There may be some insurance documents that we cannot deliver electronically due to legal and technological constraints. These will be posted to you.`}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`On our website, you can make certain transactions online. This may be purchasing a policy. These transactions will not be final until we receive and process your confirmation. Your confirmation means any communication issued or transmitted by you to us via our website or other electronic means and which contains your acceptance in relation to our offer, or your confirmation of payment, whichever applies.`}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`It is your responsibility to inform us of any change to your email address. It is also your responsibility to keep your email account active and capable of receiving new emails. We are not responsible for emails sent to an inactive or out of date email account, unless we are solely negligent.`}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`Your confirmation of payment may not be received by us for reasons including mechanical, software, computer, telecommunications or electronic failure, or the omission or failure of other providers or systems which are outside the control of either of us. You acknowledge that to the extent permitted by law, we are not liable to you in any way for loss or damage, however caused, directly or indirectly, in connection with the transmission or submission of an electronic instruction through our website or any failure to receive an electronic instruction for any reason.`}</Text>
                        </Flex> 
                    }
                />
                <TermsOfUseCard 
                    title = "Quotation"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{'Quotations are valid on the date of issue and on the assumption, the information provided being fully accurate and correct in all circumstances. The quotations are indicative and non-binding. JA Assure Sdn. Bhd. reserves the rights to modify the terms stated in the quotation without notifications, as and when deemed necessary.'}</Text>}
                />
                <TermsOfUseCard 
                    title = "Payments, cancellation and refund"
                    content = {
                        <Flex direction={'column'} gap = '15px'>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`Payment processing is undertaken by our payment Processing Partners. In addition to this and other subset policies that govern the site. You herby agree to respective terms and conditions as stated on our partner’s platforms(s). All payments for any insurance products, renewals, or other services purchased via our payment gateway service providers must be paid in full by the due date specified in the relevant confirmation.`}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`Unless otherwise provided for, all payments are required to be made by you using a type of credit card or other payment method accepted by us at the time of purchase or renewal of the applicable insurance policy or service. You must therefore provide to us through the payment gateway site the details of your current and valid Credit/Debit card, including but not limited to :`}</Text>
                            <UnorderedList>
                                <ListItem>Credit/Debit card type;</ListItem>
                                <ListItem>Name on Credit/Debit card;</ListItem>
                                <ListItem>Address;</ListItem>
                                <ListItem>Credit/Debit card number;</ListItem>
                                <ListItem>Expiry date; and</ListItem>
                                <ListItem>Credit/Debit card Security code (CVV)</ListItem>
                            </UnorderedList>
                            <Text fontSize={'18px'} color = '#4d4d4d'>You should not send us sensitive financial information like your Credit/Debit card number by email.</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{`For any cancellation of insurance policies that may occur, JA Assure Sdn. Bhd. retains the right to impose administrative charges amounting to 20% of the premium collected. Following the receipt of a cancellation request, the company will refund the remaining amount to your bank account only.`}</Text>
                        </Flex>
                    }
                />
                <TermsOfUseCard 
                    title = "JA Friends Program"
                    content = {<Text fontSize={'18px'} color = '#4d4d4d'>{'JA Friend is a reward program designed for the buyer of Doctor Shield. By purchasing this policy, you will automatically be part of JA Friend program. After purchase, a unique promotion code will be received, which you can share with your friends and colleagues to enjoy the rewards mutually. JA Assure Sdn Bhd reserves the rights to amend the reward system and the program’s terms and condition from time to time to reflect the business environment without prior notice.'}</Text>}
                />
                <TermsOfUseCard 
                    title = "Agreements"
                    content = {
                        <Flex direction={'column'} gap = '15px'>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{'This Agreement embodies the entire agreement between the parties and may not be amended, modified, altered or changed in any respect whatsoever except by a writing duly executed by the parties hereto. This Agreement supersedes any and all prior and contemporaneous oral or written agreements or understandings between you and JA Assure Sdn. Bhd. No representation, promise, inducement or statement of intention has been made by you and JA Assure Sdn. Bhd. that is not embodied in this Agreement. You and JA Assure Sdn. Bhd. shall not be bound by, or liable for, any alleged representation, promise, inducement, or statement of intention not contained in this Agreement.'}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{'You will not use this website or any data or services provided through the website for, or to encourage, any unlawful purpose; nor post or transmit on the website inaccurate, incomplete or false information; nor will you post or transmit on the website any libelous, abusive, threatening, harmful, vulgar, obscene or otherwise objectionable material. You confirm that you will not post or transmit on the website any material which contains any virus or other disabling devices which interferes or may interfere with the operation of the website; or which alters or deletes any information which you have no authority to alter or delete; or which overloads the website by spamming or flooding it. You will not use any device, routine or software to crash, delay, or otherwise damage the operation of this website. You will not use the website in a manner that could damage, disable or impair the services or content being provided by JA Assure. You must not attempt to gain unlawful or unauthorized access to the website, other resource material, computer systems or networks connected to any server associated with the website through hacking, password mining or any other improper or illegal means.'}</Text>
                            <Text fontSize={'18px'} color = '#4d4d4d'>{'A printed version of this Agreement shall be admissible in judicial or administrative proceedings based upon or relating to this Agreement to the same extent and subject to the same conditions as other business documents and records originally generated and maintained in printed form. You agree that each provision to this Agreement shall be construed independent of any other provision of this Agreement. The invalidity or unenforceability of any particular provision of this Agreement shall not affect the other provisions hereof. In the event any provision of this Agreement is deemed unenforceable, including, but not limited to, the liability disclaimers above, the unenforceable provision shall be replaced with an enforceable provision that most closely reflects the intent go original provision.'}</Text>
                        </Flex>
                    }
                />
            </Flex>

            <Footer />
        </Flex>
    );
}

export default TermsOfUse;

const TermsOfUseCard = ({ title, content }: { title: string, content: JSX.Element }) => {
    return (
        <Flex direction={'column'} gap = '20px' fontSize={'18px'}>
            <Heading fontFamily={'kanit'} fontWeight={'500'} fontSize={'25px'} textTransform={'uppercase'}>{title}</Heading>
            {content}
        </Flex>
    );
}
