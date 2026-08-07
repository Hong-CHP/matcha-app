import type { LikeReceivedOut, LikeStateResponse } from "@/types/social";
import { apiDelete, apiGet, apiPost } from "./client";
import { toQueryString } from "./discovery";
import type { BasicQueryParamsValues } from "@/schemas/discovery";

export async function postLike(
    token: string,
    target_user_id: number
): Promise<LikeStateResponse> {
    return apiPost<LikeStateResponse>(`/social/likes/${target_user_id}`, undefined, {token})
}

export async function postUnLike(
    token: string,
    target_user_id: number
): Promise<LikeStateResponse> {
    return apiDelete<LikeStateResponse>(`/social/likes/${target_user_id}`, {token})
}

export async function getLikesReceivedList(
    token: string,
    params: BasicQueryParamsValues
): Promise<LikeReceivedOut[]> {
    return apiGet<LikeReceivedOut[]>(`/social/likes/received/${toQueryString(params)}`, {token})
}