import { useAuth } from "@/auth/useAuth"
import { profileSchema, type ProfileValues } from "@/schemas/users"
import * as usersApi from "../api/users"
import { useCallback, useEffect, useState } from "react"
import { ApiError } from "@/api/client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resolveErrorMessage } from "@/i18n/errors"
import { type UserProfile } from "@/types/user"


function useProfileForm(onSuccess?: ()=>void) {
    const { accessToken, logout } = useAuth()
    const [ serverError, setServerError ] = useState<string | null>(null)
    const [ userInfo, setUserInfo ] = useState<UserProfile | null>(null) 
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: {errors, isSubmitting},
    } = useForm<ProfileValues>({
        resolver: zodResolver(profileSchema),
    })

    const getMyProfile = useCallback(async ()=>{
        try {
            const user = await usersApi.getUserProfile(accessToken!)
            setUserInfo(user)
        } catch (err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code == "USER_NOT_FOUND")
                    logout()
            }    
        }
    }, [accessToken])

    useEffect(()=>{
        void getMyProfile()
    }, [getMyProfile])

    useEffect(()=>{
        if (userInfo) {
            reset({
                gender: userInfo.gender ?? undefined,
                sexual_preference: userInfo.sexual_preference ?? undefined,
                age: userInfo.age ?? undefined,
                bio: userInfo.bio ?? "",
            } as ProfileValues)
        }
    }, [userInfo, reset])

    const onSubmit = async (data: ProfileValues) => {
        try {
            await usersApi.updateUserProfile(accessToken!, data)
            onSuccess?.()
        } catch(err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code == "USER_NOT_FOUND")
                    logout()
            }
        }
    }
    return {
        register,
        errors,
        isSubmitting,
        control,
        serverError,
        onSubmit: handleSubmit(onSubmit),
        userInfo,
        getMyProfile
    }
}

export default useProfileForm