import type { LikeStateResponse } from "@/types/social";
import { apiDelete, apiPost } from "./client";

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