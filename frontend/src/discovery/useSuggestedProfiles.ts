import { useAuth } from "@/auth/useAuth"
import { useCallback, useEffect, useRef, useState } from "react"
import * as discoveryApi from "../api/discovery"
import type { SuggestQueryParamsValues } from "@/schemas/discovery"
import { type SuggestProfile } from "@/types/discovery"
import { ApiError } from "@/api/client"
import { resolveErrorMessage } from "@/i18n/errors"

type FilterParams = Omit<SuggestQueryParamsValues, "offset">

function useSuggestedProfiles (filters: FilterParams) {
    const { accessToken, logout } = useAuth()
    const [ serverError, setServerError ] = useState<string | null>(null)
    const [ suggestedProfiles, setSuggestedProfiles ] = useState<SuggestProfile[]>([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ hasMore, setHasMore ] = useState(true)
    const offsetRef = useRef(0)

    const getSuggestedProfiles = useCallback(
        async (offset: number, replace: boolean)=>{
            if (!accessToken) return
            setIsLoading(true)
            setServerError(null)
            try {
                const page = await discoveryApi.getSuggestedProfiles(accessToken, {
                    ...filters,
                    offset,
                })
                setSuggestedProfiles(prev => (replace ? page : [...prev, ...page]))
                setHasMore(page.length === filters.limit)
                offsetRef.current = offset
            } catch (err) {
                if (err instanceof ApiError) {
                    setServerError(resolveErrorMessage(err.code, err.message))
                    if (err.code == "USER_NOT_FOUND")
                        logout()
                }
            } finally {
                setIsLoading(false)
            }
    }, [accessToken, logout, filters])

    useEffect(()=>{
        offsetRef.current = 0
        getSuggestedProfiles(0, true)        
    }, [accessToken, filters])

    const loadMore = useCallback(()=> {
        if (!isLoading || !hasMore) return
        getSuggestedProfiles(offsetRef.current + filters.limit, false)
    }, [getSuggestedProfiles, isLoading, hasMore, filters.limit])

    return {suggestedProfiles, serverError, isLoading, hasMore, loadMore}
}

export default useSuggestedProfiles