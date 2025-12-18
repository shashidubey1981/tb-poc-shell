'use client'
import { useEffect, useState, use } from 'react'
import {isNull}  from 'lodash'
import Personalize from '@contentstack/personalize-edge-sdk'
import { RenderComponents } from '@/components'
import { Page } from '@/types'
import { isDataInLiveEdit } from '@/utils'
import { NotFoundComponent, PageWrapper } from '@/components'
import { onEntryChange } from '@/config'
import useRouterHook from '@/hooks/useRouterHook'
import { setDataForChromeExtension } from '@/utils'
import {
    dynamicComponentReferenceIncludes,
    heroReferenceIncludes,
    imageCardsReferenceIncludes,
    teaserReferenceIncludes,
    textAndImageReferenceIncludes,
    textJSONRtePaths
} from '@/services/helper'
import { getEntryByUrl } from '@/services'
import { usePersonalization } from '@/context'
import { App } from '@/types'

/**
 * @component Category Landing Page - Slug Based
 * 
 * @route '/{locale}/c/{slug}'
 * @description Component that renders the category landing page based on the slug
 * 
 * @returns {JSX.Element}
 */
export default function LandingPage ({ params }: { params: Promise<any> }) {
    
    const unwrappedParams = use(params)
    const pathInfoEntries = unwrappedParams;
    
    // const { parentCategory, subCategory } = searchParamsEntries;
    // Access any param by key: searchParams[key]
    const [data, setData] = useState<Page.LandingPage['entry'] | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const {path, locale} = useRouterHook()
    const [isABTestEnabled, setIsABTestEnabled] = useState<boolean>(false)
    const { personalizationSDK } = usePersonalization()

    /**
     * useEffect to conditionally trigger and impression for a configured AB testing 
     * */ 
    useEffect(() => {
        const variants = personalizationSDK?.getVariants() ?? {}
        if (path === process.env.CONTENTSTACK_AB_LANDING_PAGE_PATH 
            && Personalize.getInitializationStatus() 
            && Personalize.getInitializationStatus() === 'success'
            && variants[process.env.CONTENTSTACK_AB_EXPERIENCE_ID??'1']) {
            setIsABTestEnabled(true)
            personalizationSDK?.triggerImpression(process.env.CONTENTSTACK_AB_EXPERIENCE_ID??'1' as string)
        }
    }, [Personalize.getInitializationStatus()])

    /**
     * useEffect that fetches data to be rendered on the page
     * */ 
    useEffect(() => {
        const fetchData = async () => {
            try {
                const refUids = [
                    ...dynamicComponentReferenceIncludes,
                    ...heroReferenceIncludes,
                    ...textAndImageReferenceIncludes,
                    ...teaserReferenceIncludes,
                    ...imageCardsReferenceIncludes
                ]
                const jsonRtePaths = [
                    ...textJSONRtePaths
                ]
                const contentType = 'category_landing_page'
                const path = '/c'
                const res = await getEntryByUrl<Page.LandingPage['entry']>(contentType,locale, path, refUids, jsonRtePaths, personalizationSDK) as Page.LandingPage['entry']
                setData(res)
                setDataForChromeExtension({ entryUid: res?.uid || '', contenttype: contentType, locale: locale })
                if (!res && !isNull(res)) {
                    throw '404'
                }
            }
            catch (err) {
                console.error('Error while fetching Landing page : ', err)
                setLoading(false)
            }
        }
        onEntryChange(fetchData)
    }, [path])


    return (<>
        {data
            ? <PageWrapper {...data}>
                {data?.components
                    ? <RenderComponents $={data?.$}
                        hero={data?.hero && Array.isArray(data.hero) ? data.hero[0] : data.hero}
                        components={data?.components}
                        isABEnabled={isABTestEnabled}
                        searchParams={pathInfoEntries}
                    /> : ''}
            </PageWrapper>
            : <>
                {!loading && !isDataInLiveEdit() && <NotFoundComponent />}
            </>}
    </>
    )
}
