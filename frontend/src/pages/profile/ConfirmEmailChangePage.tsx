import { useEffect, useRef, useState } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import * as usersApi from "@/api/users"
import { resolveErrorMessage } from "@/i18n/errors"
import { ApiError } from "@/api/client"


function ConfirmEmailChangePage() {
    const [searchParams] = useSearchParams()
    const emailChangeToken = searchParams.get("token")
    const [serverError, setServerError] = useState<string | null>(null)
    const navigate = useNavigate()
    const hasRequested = useRef(false)

    useEffect(()=>{
        if (!emailChangeToken) {
            setServerError("Missing verification token")
            return
        }
        if (hasRequested.current)
            return
        hasRequested.current = true
        let cancelled = false

        usersApi.confirmEmailChange(emailChangeToken).then(()=>{
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
    }, [emailChangeToken, navigate])

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