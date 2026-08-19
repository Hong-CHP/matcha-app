import { useAuth } from "@/auth/useAuth";
import * as socialApi from "@/api/social"
import { useState } from "react";
import { type LikeStateResponse } from "@/types/social";
import { ApiError } from "@/api/client";
import { resolveErrorMessage } from "@/i18n/errors";

export function useLikes() {
    const { accessToken, logout } = useAuth()
    const [ likeState, setLikeState ] = useState< Record<number, LikeStateResponse> | null>(null)
    const [ serverError, setServerError ] = useState<string | null>(null)

    const like = async (targetId: number) => {
        if (!accessToken) return
        try {
            const likeState = await socialApi.postLike(accessToken, targetId)
            if (!likeState) return
            setLikeState(prev=>({...prev, [targetId]: likeState}))
        } catch (err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code == "USER_NOT_FOUND")
                    logout()
            }
        }
    }
    
    const unlike = async (targetId: number) => {
        if (!accessToken) return
        try {
            const likeState = await socialApi.postUnLike(accessToken, targetId)
            if (!likeState) return
            setLikeState(prev=>({...prev, [targetId]: likeState}))
        } catch (err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code == "USER_NOT_FOUND")
                    logout()
            }
        }
    }

    return {like, unlike, likeState, serverError}
}