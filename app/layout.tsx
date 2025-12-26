import type { Metadata } from 'next'
import { Inter, Roboto_Condensed } from 'next/font/google'

import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import './globals.css'
import '/node_modules/flag-icons/css/flag-icons.min.css'
import { defaultLocale } from '@/config'
import { MainLayout } from '@/MainLayout'
import { PersonalizationProvider } from '@/context'
import { getPersonalizationConfigFromCMS} from '@/services'

const inter = Inter({ subsets: ['latin'] })

const robotoCondensed = Roboto_Condensed({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700'],
    style: ['normal', 'italic']
})

export const metadata: Metadata = {
    title: 'Compass starter',
    description: 'Provided by Contentstack'
}

export default async function RootLayout ({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    // Fetch personalization config on the server
    const personalizeConfig = await getPersonalizationConfigFromCMS()

    return (
        <html lang={defaultLocale}>
            <head>
                <link rel='preconnect' href={process.env.CONTENTSTACK_HOST} />
                <link rel='preconnect' href={process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL} />
                <link rel='preconnect' href={process.env.CONTENTSTACK_HOST?.replace(/cdn\./, 'images.')} />
                <link rel='dns-fetch' href={process.env.CONTENTSTACK_API_HOST} />
                <link rel='dns-fetch' href='https://contentstack.com' />
                <link rel='dns-fetch' href='https://contentstack.io' />

                {/* eslint-disable @next/next/google-font-preconnect */}
                <link
                    rel='preload'
                    href='https://fonts.gstatic.com/s/inter/v18/UcCo3FwrK3iLTcviYwYZ8UA3.woff2'
                    as='font'
                    type='font/woff2'
                    crossOrigin=''
                />
            </head>
            <body
                className={`${robotoCondensed.className} ${inter.className}`}
            >
                <PersonalizationProvider personalizeConfig={personalizeConfig || undefined}>
                    <MainLayout>
                        {children}
                    </MainLayout>
                </PersonalizationProvider>
            </body>
        </html>
    )
}