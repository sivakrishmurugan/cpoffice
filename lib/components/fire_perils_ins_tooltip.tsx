import { Flex, Heading, ListItem, OrderedList } from "@chakra-ui/react"
import ResponsiveTooltip from "./tooltip"
import { TOOLTIP_INFO } from "../app/app_constants"

interface FirePerilsInsTooltipProps {
    children: React.ReactNode
}

const FirePerilsInsTooltip = ({ children }: FirePerilsInsTooltipProps) => {
    return <ResponsiveTooltip 
        wrapperDivProps = {{ verticalAlign: 'middle', ml: '10px',  mt: '2px' }}
        label = {
            <Flex maxW = {['320px', '350px', '380px', '380px', '380px']} direction={'column'}>
                <Heading as = 'h3' fontSize={'18px'}>{TOOLTIP_INFO.fireAndPerilsIns.title}</Heading>
                <OrderedList ml = '30px'>
                    {
                        TOOLTIP_INFO.fireAndPerilsIns.contents.map(e => {
                            return <ListItem key = {e}>{e}</ListItem>
                        })
                    }
                </OrderedList>
            </Flex>
        }
    >
        {children}
    </ResponsiveTooltip>
}

export default FirePerilsInsTooltip;