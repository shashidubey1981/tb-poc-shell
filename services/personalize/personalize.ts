import { NextRequest } from "next/server";
import Personalize from "@contentstack/personalize-edge-sdk";
import type { Sdk } from "@contentstack/personalize-edge-sdk/dist/sdk";


export type MiddlewarePersonalizeResult = {
    sdk: Sdk;
    variantParam: string;
    variants: Record<string, string | null>;
};


export async function initPersonalizeInMiddleware(req: NextRequest): Promise<MiddlewarePersonalizeResult> {
    const projectUid = process.env.CONTENTSTACK_PERSONALIZE_PROJECT_UID;
    
    if (!projectUid) {
        throw new Error("CONTENTSTACK_PERSONALIZE_PROJECT_UID not found (server env var)");
    }

    // Optional: region-specific edge URL (EU/Azure/etc)
    const edgeUrl = process.env.CONTENTSTACK_PERSONALIZE_EDGE_API_URL;
    if (edgeUrl) {
        Personalize.setEdgeApiUrl(edgeUrl);
    }
    const pathname = req.nextUrl.pathname
    const pathSegments = pathname.split('/')
    const mensSuitsRegex = /mens-suits/i
    const hasMensSuits = pathSegments.some(segment => mensSuitsRegex.test(segment))
    let pagePath = ''
    if(hasMensSuits) {
        pagePath = 'test';
    }
    
    
    // ✅ Critical for AB targeting on first request:
    // liveAttributes are evaluated immediately when fetching the manifest
    const sdk = await Personalize.init(projectUid, {
        request: req,
        liveAttributes: {
            page_path: pagePath,
        },
    });

    return {
        sdk,
        variantParam: sdk.getVariantParam(),
        variants: sdk.getVariants(),
    };
}