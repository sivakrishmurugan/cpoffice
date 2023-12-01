import { Flex, Text, ListItem, UnorderedList, AccordionItem, AccordionButton, Accordion, AccordionPanel, AccordionIcon } from "@chakra-ui/react";
import { APP_BG_COLOR } from "../app/app_constants";
import { MinusIcon, PlusIcon } from "../icons";

interface ExpandableListProps {
    list: string[],
    title: string
} 

const ExpanableList = ({ list, title }: ExpandableListProps) => {
    return (
        <Accordion allowMultiple w = "100%">
            <AccordionItem bg = {APP_BG_COLOR} border = "0px" borderRadius={"8px"}> 
                {(props) => 
                    <>
                        <AccordionButton p = "10px" px = '15px' border = "0px" borderRadius={"8px"} _focus = {{boxShadow: "none"}} display={"flex"} justifyContent={"space-between"}>
                            <Flex fontWeight={"medium"}>
                                <Text fontWeight={'bold'} fontSize={'16px'}>{title}: </Text>
                            </Flex>
                            <AccordionIcon w = '25px' h = '25px' as = {props.isExpanded ? MinusIcon : PlusIcon} />
                        </AccordionButton>
                        <AccordionPanel borderRadius={"8px"} px = "10px">
                            <UnorderedList ml = '30px' fontSize={'14px'}>
                                {
                                    list.map(includedItem => {
                                        return <ListItem key = {includedItem}>{includedItem}</ListItem>;
                                    })
                                }
                            </UnorderedList>
                        </AccordionPanel>
                    </>
                }
            </AccordionItem>
        </Accordion>
    );
}

export default ExpanableList;