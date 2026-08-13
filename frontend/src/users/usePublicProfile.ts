import { useAuth } from "@/auth/useAuth";
import { useEffect } from "react";

export function usePublicProfile() {
    const {accessToken, logout} = useAuth()

    useEffect(()=>{
        if (!accessToken) return
        const targetProfile = await 

    }, [accessToken])


}