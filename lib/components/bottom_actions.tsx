
"use client"
import { APP_MAX_WIDTH, APP_WIDTH } from "../app/app_constants";
import { Flex } from "@chakra-ui/react";

interface BottomActionsProps {
    children: React.ReactNode[]
}

const BottomActions = ({ children }: BottomActionsProps) => {
    return (
        <Flex mt = '100px'>
            <Flex maxW = '100vw' w = '100%' position={'absolute'} bottom={0} left={0} bg = 'white' borderTop={'1px solid #e3e7ee'} alignItems={'center'} justifyContent={'center'}>
                <Flex 
                    maxW = {APP_MAX_WIDTH}
                    w = {APP_WIDTH}
                    minH = {['80px', '95px', '95px', '95px', '95px']} 
                    alignItems={'center'}
                    justifyContent={['center', 'center', 'center', 'flex-end', 'flex-end']}
                    gap = '20px'
                    pr = {['0px', '0px', '40px', '40px', '40px']}
                >
                    {...children}
                </Flex>
            </Flex>
        </Flex>
    );
}

export default BottomActions;