import type { DiscoveryProfile } from "@/types/discovery";
import { apiGet } from "./client";
import { _ZodString } from "zod";
import type { SearchQueryParamsValues, SuggestQueryParamsValues } from "@/schemas/discovery";

export function toQueryString(params: Record<string, unknown>): string | null {
    const search = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        if (Array.isArray(value))
            value.forEach(item=>search.append(key, String(item)))
        else
            search.append(key, String(value))
    })
    const qs = search.toString()
    return qs.length > 0 ? `?${qs}` : null
}

export async function getSuggestedProfiles(
    token: string,
    params: SuggestQueryParamsValues
): Promise<DiscoveryProfile[]> {
    return apiGet<DiscoveryProfile[]>(`/discovery/suggest${toQueryString(params)}`, {token})
}

export async function getSearchProfiles(
    token: string,
    params: SearchQueryParamsValues
): Promise<DiscoveryProfile[]> {
    return apiGet<DiscoveryProfile[]>(`/discovery/search${toQueryString(params)}`, {token})
}