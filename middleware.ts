import { NextRequest, NextResponse } from 'next/server' 
import { defaultLocale, localeCookieName } from '@/config/localization'
import { createManagmentHeaders } from '@/config/contentstack/managementSDK'
import { isLocale } from '@/utils/localization'
import { Locale } from './types/common'
import { initPersonalizeInMiddleware } from "@/services/personalize/personalize";
import { getEntries } from '@/services'
import { Common } from '@/types'
import { getPersonalizeAttribute, removeSpecialChar } from '@/utils'

const fetchLocales = async () => {
    const requestOptions = createManagmentHeaders('GET')
    const res = await fetch(`https://${process.env.CONTENTSTACK_API_HOST}/v3/locales`, requestOptions)
    const {locales} = await res.json()
    
    return locales?.length > 0 ? locales?.map((locale: Locale) => ({
        code: locale.code,
        name: locale.name,
        fallback_locale: locale.fallback_locale
    })) : []
}

export async function middleware (request: NextRequest) {
    const pathname = request.nextUrl.pathname
    const languagesCookie = request.cookies.get(localeCookieName)
    
    const locales =  languagesCookie?.value ? JSON.parse(languagesCookie.value) : await fetchLocales()
    let currentLocale = defaultLocale
    const pathnameHasLocale = pathname.split('/')?.some((p) => {
        return isLocale(p)
    })

    const pathSegments = pathname.split('/')

    if (pathSegments.length > 1 && isLocale(pathSegments[1])) {
        currentLocale = pathSegments[1]
    }
        const { sdk, variantParam } = await initPersonalizeInMiddleware(request);
        console.log('variantParam', sdk.getVariantAliases());
        console.log('variants', JSON.stringify(variantParam));
    
    
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-request-locale', currentLocale)
    request.nextUrl.searchParams.set(sdk.VARIANT_QUERY_PARAM, variantParam);
    console.log('request.nextUrl.searchParams', request.nextUrl.searchParams);
    if (pathnameHasLocale) {
        console.log('pathnameHasLocale', pathnameHasLocale);
        try {
            const response = NextResponse.rewrite(request.nextUrl, {
                request: {
                    headers: requestHeaders
                }
            })
            await sdk.addStateToResponse(response);
            if (!languagesCookie)  {
           
                // set "languages" cookie in res.cookie - if cookie not exist 
                // cookie will expire in 5 days
                response.cookies.set(localeCookieName, JSON.stringify(locales), { 
                    expires: new Date(Date.now() + ( 5 * 24 * 60 * 60 * 1000)),
                    sameSite: 'none',
                    secure: true
                })
                return response

            } // if request.cookie exist then return
            return response
        
        } catch(err) {
            console.error('Error while parsing locale : ', err)
            return NextResponse.next({
                request: {
                    headers: requestHeaders // Still pass the determined locale
                }
            })
        }
    }

    // Redirect to default locale if there is no locale in url
    request.nextUrl.pathname = `/${defaultLocale}${pathname}`
    return NextResponse.rewrite(request.nextUrl)
}
 
export const config = {
    matcher: [
        /*
        * Match all request paths except for the ones starting with:
        * - api (API routes)
        * - _next/static (static files)
        * - _next/image (image optimization files)
        * - favicon.ico (favicon file)
        * - robots.txt (robots file)
        */
        '/((?!api|_next/static|_next/image|favicon.ico|robots.txt).*)',
        
        // allow / routes
        '/' 
    ]
}