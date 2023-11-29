import { Flex, FlexProps, Tooltip, TooltipProps, useOutsideClick } from "@chakra-ui/react";
import React, { PropsWithChildren, useState, useRef } from "react";
import { APP_BORDER_COLOR } from "./app/app_constants";

interface ResponsiveTooltipProps extends PropsWithChildren<any>, TooltipProps {
    wrapperDivProps?: FlexProps,
    toolTipWidth?: string | string[], 
}

const ResponsiveTooltip = ({ children, isDisabled, toolTipWidth = 'auto', wrapperDivProps, ...restTooltipProps }: ResponsiveTooltipProps) => {
    const [isOpen, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    useOutsideClick({ ref: ref, handler: () => setOpen(false) })
    const onClose = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        setOpen(false)
    }
    const onOpen = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setOpen(true)
    }
    const onToggle = (e: React.TouchEvent<HTMLDivElement>) => {
        e.stopPropagation()
        setOpen(!isOpen)
    }
    
    return (
        <Tooltip 
            isOpen = {isOpen}
            p = '10px' borderRadius = '5px' hasArrow bg = 'white' color = 'brand.text'
            border = '1px'  maxW = '600px'
            mx = '10px'
            w = {toolTipWidth}
            borderColor={'brand.borderColor'}
            sx={{"--popper-arrow-shadow-color": APP_BORDER_COLOR}}
            {...restTooltipProps}
            eventListeners = {{ scroll: false }}
        >
            <Flex 
                display = 'inline-block'
                ref={ref}
                onTouchEnd = {isDisabled ? undefined : onToggle} 
                onMouseEnter = {isDisabled ? undefined : onOpen} 
                onMouseLeave = {isDisabled ? undefined : onClose} 
                {...wrapperDivProps}
            >
                {children}
            </Flex>
        </Tooltip>
    );
}

export default ResponsiveTooltip;