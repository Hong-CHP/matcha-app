import type { SuggestProfile } from "@/types/discovery";
import { apiGet } from "./client";
import { _ZodString } from "zod";
import type { SuggestQueryParamsValues } from "@/schemas/discovery";

function toQueryString(params: {}): string | null {
    const entires = Object.entries(params).filter(([_, v]) => v !== undefined)
    if (entires.length == 0) return null
    return "?" + new URLSearchParams(entires.map(([k, v])=>[k, String(v)])).toString()
}

export async function getSuggestedProfiles(
    token: string,
    params: SuggestQueryParamsValues
): Promise<SuggestProfile[]> {
    return apiGet<SuggestProfile[]>(`/discovery/suggest${toQueryString(params)}`, {token})
}