'use client'
import { CacheProvider } from '@chakra-ui/next-js'
import { theme } from '@/lib/app/chakra_theme'
import { ChakraProvider } from '@chakra-ui/react'

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
}