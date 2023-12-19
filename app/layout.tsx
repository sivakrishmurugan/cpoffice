import AppLayout from '@/lib/app/app_layout';
import { Providers } from "./providers";
import { LenisScroller } from '@/lib/app/lenis_scroller';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <link rel='icon' href = "/icons/favicon.svg" />
            <script 
              async defer 
              src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAdZfT5YqMgVu_92CgR3PxJUdVLbXtv0vI&libraries=places&language=en&callback=Function.prototype"
            ></script>
          </head>
          <body>
            <Providers>
              <main>
                <AppLayout>
                  {children}
                </AppLayout>
              </main>
            </Providers>
            {/* <LenisScroller /> */}
          </body>
      </html>
    );
}
