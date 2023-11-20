import { APP_BG_COLOR, APP_WIDTH, APP_MAX_WIDTH } from "./app_constants";
import { Flex } from "@chakra-ui/react";
import Header from "../header";
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Flex id = 'app_layout' w = '100%' direction={'column'} alignItems={'center'} bg = {APP_BG_COLOR}>
            <Header />
            <Flex 
                maxW = {APP_MAX_WIDTH} 
                w = {APP_WIDTH} 
                minH = {'calc(100vh - 60px)'} 
                px = {['10px', '10px', '20px', '20px', '20px']}
            >
                {children}
            </Flex>
        </Flex>
    );
}

export default AppLayout;