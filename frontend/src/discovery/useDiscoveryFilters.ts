import { ApiError } from "@/api/client"
import { useAuth } from "@/auth/useAuth"
import { resolveErrorMessage } from "@/i18n/errors"
import type { DiscoveryProfile } from "@/types/discovery"
import { useCallback, useEffect, useRef, useState } from "react"

interface useDiscoveryFiltersOptions<TFilters extends {limit: number}> {
    filters: TFilters,
    enabled?: boolean
    fetchPage: (accessToken: string, params: TFilters & {offset: number}) => Promise<DiscoveryProfile[]>
}

export function useDiscoveryFilters<TFilters extends {limit: number}>({
    filters,
    enabled = true,
    fetchPage,
}: useDiscoveryFiltersOptions<TFilters>) {
    const { accessToken, logout } = useAuth()
    const [ serverError, setServerError ] = useState<string | null>(null)
    const [ profiles, setProfiles ] = useState<DiscoveryProfile[]>([])
    const [ isLoading, setIsLoading ] = useState(false)
    const [ hasMore, setHasMore ] = useState(true)
    const offsetRef = useRef(0)

    const getProfiles = useCallback(
        async (offset: number, replace: boolean)=>{
            if (!accessToken || !enabled) return 
            setServerError(null)
            setIsLoading(true)
            try {
                const page = await fetchPage(accessToken, { ...filters, offset})
                setProfiles((prev) => (replace? page: [...prev, ...page]))
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
        }, [accessToken, logout, enabled, filters, fetchPage])

        useEffect(()=> {
            if (!enabled) return
            offsetRef.current = 0
            getProfiles(0, true)
        }, [accessToken, filters, enabled])

        const loadMore = useCallback(()=>{
            if (!enabled) return 
            if (isLoading || !hasMore) return
            getProfiles(offsetRef.current + filters.limit, false)
        }, [getProfiles, isLoading, hasMore, filters.limit, enabled])

        return {profiles, serverError, isLoading, hasMore, loadMore}
}