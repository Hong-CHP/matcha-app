import { useEffect, useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import * as usersApi from "@/api/users"
import { resolveErrorMessage } from "@/i18n/errors"
import { ApiError } from "@/api/client"


function ConfirmEmailChangePage() {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const [serverError, setServerError] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(()=>{
        if (!token) {
            setServerError("Missing verification token")
            return
        }
        let cancelled = false

        usersApi.confirmEmailChange(token).then(()=>{
            if (cancelled) return
            navigate("/profile")        
        }).catch((err)=> {
            if (cancelled) return
            if (err instanceof ApiError) {
              setServerError(resolveErrorMessage(err.code, err.message))
            } else {
              setServerError('Request failed')
            }
        })
        return () => { cancelled = true }
    }, [token, navigate])

    if (serverError) {
        return (
            <div>
                <h1>Email change confirmation</h1>
                <p>{serverError}</p>
                <Link to="/profile">Back to profile</Link>
            </div>    
        )
    }
    return (
        <div>
            <h1>Email change confirmation</h1>
            <p>Confirming your new email...</p>
        </div>
    )
}

export default ConfirmEmailChangePage