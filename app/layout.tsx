import AppLayout from '@/components/app/app_layout';
import { Inter } from 'next/font/google';
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
          <body className={inter.className}>
            <Providers>
              <main>
                <AppLayout>
                  {children}
                </AppLayout>
              </main>
            </Providers>
          </body>
      </html>
    );
}
