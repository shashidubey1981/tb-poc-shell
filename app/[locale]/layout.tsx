import { MainLayout } from '@/MainLayout'
import { PersonalizationProvider } from '@/context'
import { getPersonalizationConfigFromCMS} from '@/services'

export default async function RootLayout ({
    children,
    params
}: Readonly<{
    children: React.ReactNode
    params: Promise<{ locale: string }>
}>) {
    
    // Fetch personalization config on the server
    const personalizeConfig = await getPersonalizationConfigFromCMS()

    return (
        <PersonalizationProvider personalizeConfig={personalizeConfig || undefined}>
            <MainLayout>
                {children}
            </MainLayout>
        </PersonalizationProvider>
    )
}
