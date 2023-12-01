import AppLayout from '@/lib/app/app_layout';
import { Inter } from 'next/font/google';
import { Providers } from "./providers";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
          <head>
            <link rel='icon' href = "/icons/favicon.svg" />
            <script 
              async defer 
              src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdZfT5YqMgVu_92CgR3PxJUdVLbXtv0vI&libraries=places&language=en"
            ></script>
          </head>
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
