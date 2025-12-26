import { NextRequest, NextResponse } from 'next/server' 
import { defaultLocale } from '@/config/localization'
import { initializePersonalizeSDK } from '@/config/personalization'
 
export async function middleware (request: NextRequest) {
    let sdk: any = null;
    let variantParam: string | null = null;
    
    try {
        sdk = await initializePersonalizeSDK(request as any);
        if (sdk) {
            variantParam = sdk.getVariantParam();
        }
    } catch (error) {
        console.error('Failed to initialize personalization SDK:', error);
        // Continue without personalization if SDK initialization fails
    }

    // Use defaultLocale from process.env.DEFAULT_LOCALE
    const currentLocale = defaultLocale

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-request-locale', currentLocale)

    try {
        const response = NextResponse.next({
            request: {
                headers: requestHeaders
            }
        })

        if (sdk) {
            await sdk.addStateToResponse(response as any);
        }

        return response
    } catch(err) {
        console.error('Error in middleware : ', err)
        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        })
    }
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