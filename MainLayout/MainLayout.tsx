'use client'

import React, { useEffect, useState } from 'react'
import { ConsentForm, Footer, Header, UserFormModal } from '@/components'
import { App } from '@/types'

import useRouterHook from '@/hooks/useRouterHook'
import { LocaleContext, usePersonalization, WebConfigContext } from '@/context'
import { footerJsonRtePathIncludes, footerReferenceIncludes, getEntries, getWebConfigEntries, navigationReferenceIncludes, userFormJsonRtePathIncludes, userFormReferenceIncludes } from '@/services'
import { onEntryChange } from '@/config'

const MainLayout: React.FC<App.MainLayout> = (
    props: React.PropsWithChildren<App.MainLayout>
) => {  
    
    const [webConfig, setWebConfig] = useState<App.WebConfig>()
    const { locale } = useRouterHook()
    const {personalizationSDK} = usePersonalization()

    const fetchAppConfig = async () => {
        try {
            
            const webConfigRes = await getWebConfigEntries('web_configuration', locale) as App.WebConfig

            if (webConfigRes) {

                setWebConfig(webConfigRes)

            } else {

                throw 'Unable to fetch Web Config | 404'

            }

        } catch (err) {
            console.error('Main Layout failed to load,\n', err)
        }
    }
    
    useEffect(() => {
        onEntryChange(fetchAppConfig)
    }, [])

    return (
        <>
            {locale && <LocaleContext.Provider
                value={{
                    currentLocale: locale
                }}
            >
            <WebConfigContext.Provider
                value={{
                    webConfig: webConfig
                }}
            >
                {
                    webConfig?.main_navigation?.[0] && webConfig?.logo
                    && <Header
                        {...webConfig.main_navigation[0]}
                        logo={webConfig.logo}
                    />
                }
                <div className='main-layout mx-auto h-screen min-h-screen justify-center relative'>
                    {props.children}
                </div>
            </WebConfigContext.Provider>
            </LocaleContext.Provider>}
        </>
    )
}

export { MainLayout }