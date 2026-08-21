import { useAuth } from "@/auth/useAuth";
import { useState } from "react";
import * as socialApi from "@/api/social"
import { type BlockStateResponse } from "@/types/social";
import { ApiError } from "@/api/client";
import { resolveErrorMessage } from "@/i18n/errors";

export function useBlock() {
    const { accessToken, logout } = useAuth()
    const [ serverError, setServerError ] = useState<string | null>(null)
    const [ blockState, setBlockState ] = useState<BlockStateResponse | null>(null)

    const block = async (targetId: number) => {
        if (!accessToken) return
        setServerError(null)
        try {
            const blocked = await socialApi.postBlock(accessToken, targetId)
            setBlockState(blocked)
        } catch (err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code == "USER_NOT_FOUND")
                    logout()
            }
        }
    }

    const unblock = async (targetId: number) => {
        if (!accessToken) return
        setServerError(null)
        try {
            const blocked = await socialApi.deleteBlock(accessToken, targetId)
            setBlockState(blocked)
        } catch (err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code == "USER_NOT_FOUND")
                    logout()
            }
        }
    }

    return {block, unblock, blockState, serverError}
}