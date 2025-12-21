import Personalize from "@contentstack/personalize-edge-sdk";




export function variantAliasesFromSearchParams(
    personalizeVariants: string | string[] | undefined
): string[] {
    const raw = Array.isArray(personalizeVariants) ? personalizeVariants[0] : personalizeVariants;
    if (!raw) return [];
    return Personalize.variantParamToVariantAliases(raw);
}

