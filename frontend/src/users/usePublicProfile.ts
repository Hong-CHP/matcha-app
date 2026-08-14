import { useAuth } from "@/auth/useAuth";
import { useCallback, useEffect, useState } from "react";
import * as usersApi from "@/api/users"
import type { PublicProfile } from "@/types/user";
import { ApiError } from "@/api/client";
import { resolveErrorMessage } from "@/i18n/errors";

export function usePublicProfile(target_id: number) {
    const {accessToken, logout} = useAuth()
    const [publicProfile, setPubilcProfile] = useState<PublicProfile | null>(null)
    const [profileAvatar, setProfileAvatar] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string | null>(null)


    const fetchPublicProfile = useCallback(
        async (target_id: number)=>{
            if (!accessToken) return
            setIsLoading(true)
            try {
                const targetProfile = await usersApi.getPublicProfile(accessToken, target_id)
                setPubilcProfile(targetProfile)
                const avatar = targetProfile.photos.filter(p=> p.is_profile_photo)?.[0]
                setProfileAvatar(avatar.url?? null)
            } catch (err) {
                if (err instanceof ApiError) {
                    setServerError(resolveErrorMessage(err.code, err.message))
                    if (err.code == "USER_NOT_FOUND")
                        logout()
                }
            } finally {
                setIsLoading(false)
            }
    }, [accessToken, logout])

    useEffect(()=>{
        fetchPublicProfile(target_id)
    }, [fetchPublicProfile])

    return {publicProfile, profileAvatar, isLoading, serverError}
}