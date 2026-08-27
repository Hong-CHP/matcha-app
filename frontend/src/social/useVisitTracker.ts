import { useAuth } from "@/auth/useAuth"
import { useCallback, useEffect, useRef, useState } from "react"
import * as socialApi from "@/api/social"
import { ApiError } from "@/api/client"
import { resolveErrorMessage } from "@/i18n/errors"

export function useVisiteTracker(targetId: number | null) {
    const { accessToken, logout}  = useAuth()
    const [visitError, setVisitError] = useState<string | null>(null)
    const visitedRef = useRef<number | null>(null)

    const postSingleVisit = useCallback(async(id: number)=>{
        if (!accessToken) return
        try {
            const res = await socialApi.postVisit(accessToken, id)
            if (!res.ok)
                throw Error("Post visit failed")
        } catch (err) {
            if (err instanceof ApiError) {
                setVisitError(resolveErrorMessage(err.code, err.message))
                if (err.code == "USER_NOT_FOUND")
                    logout()
            }
        }
    }, [accessToken, logout])
    
    useEffect(()=>{
        if (!targetId) return
        if (visitedRef.current === Number(targetId)) return
        visitedRef.current = Number(targetId)
        postSingleVisit(targetId)
    }, [targetId, postSingleVisit])

    return {visitError}
}