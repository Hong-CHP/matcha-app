import { useAuth } from "@/auth/useAuth"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { accountSchema, passwordchangeSchema, type AccountValues, type PasswordChangeValues } from "@/schemas/users"
import type { UserProfile } from "@/types/user"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import edit from "../../assets/edit.png"
import {
    resendVerificationSchema,
    type ResendVerificationValues,
} from "@/schemas/auth"
import * as usersApi from "../api/users"
import { ApiError } from "@/api/client"
import { resolveErrorMessage } from "@/i18n/errors"

function AccountTab({profile, onSaved} : {profile : UserProfile, onSaved: ()=>void}) {
    const { accessToken, logout } = useAuth()
    const [editing, setEditing] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string | null>(null)
    const [emailChangeSent, setEmailChangeSent] = useState<string | null>(null)
    const [passwordChangeCfm, setPasswordChangeCfm] = useState<string | null>(null)

    const {
        register,
        reset,
        handleSubmit,
        formState : { errors },
    } = useForm<AccountValues>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            username: profile.username,
            first_name: profile.first_name,
            last_name: profile.last_name
        }
    })

    const emailForm = useForm<ResendVerificationValues>({
        resolver: zodResolver(resendVerificationSchema),
        defaultValues: {
            email: ""
        }
    })

    const passwordForm = useForm<PasswordChangeValues>({
        resolver: zodResolver(passwordchangeSchema),
        defaultValues: {
            current_password: "",
            new_password: "",
            confirm_password: ""
        }
    })

    const onSubmitAccountChange = async (data: AccountValues) => {
        setServerError(null)
        try {
            setEditing(false)
            await usersApi.editUserAccount(accessToken!, data)
            onSaved()
        } catch (err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code === "USER_NOT_FOUND")
                    logout()
            }
        }
    }
    
    const onSubmitEmailChange = async (newEmail: ResendVerificationValues) => {
        setServerError(null)
        try {
            setEditing(false)
            const response = await usersApi.requestEmailChange(accessToken!, newEmail)
            setEmailChangeSent(response.message)
        } catch (err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code === "USER_NOT_FOUND")
                    logout()
            }
        }
    }

    const onSubmitPasswordChange = async (passwords: PasswordChangeValues) => {
        setServerError(null)
        try {
            setEditing(false)
            const response = await usersApi.changePassword(accessToken!, passwords)
            setPasswordChangeCfm(response.message)
        } catch (err) {
            if (err instanceof ApiError) {
                setServerError(resolveErrorMessage(err.code, err.message))
                if (err.code === "USER_NOT_FOUND")
                    logout()
            } else {
                setServerError("Request failed")
            }
        }
    }
    
    const handleCancel = () => {
        setServerError(null)
        reset()
        setEditing(false)
    }

    return (
        <Card>
            <CardHeader>
                <div>
                    <CardTitle>account</CardTitle>
                    <CardDescription>
                      These are your personal secret informations.
                    </CardDescription>
                </div>

            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
                {serverError && (<FieldError>{serverError}</FieldError>)}
                <form>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="usernamer">Username</FieldLabel>
                            <Input id="username" type="text" disabled={!editing} aria-invalid={!!errors.username}
                                {...register("username")}
                            />
                            <FieldError errors={[errors.username]}/>
                            <Button onClick={()=>setEditing(true)}>{edit}</Button> 
                            {editing && (
                                <div>
                                    <Button onClick={handleSubmit(onSubmitAccountChange)}>Save</Button>
                                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                </div>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="first_name">First name</FieldLabel>
                            <Input id="first_name" type="text" disabled={!editing} aria-invalid={!!errors.first_name}
                                {...register("first_name")}
                            />
                            <FieldError errors={[errors.first_name]}/>                        
                            <Button onClick={()=>setEditing(true)}>{edit}</Button> 
                            {editing && (
                                <div>
                                    <Button onClick={handleSubmit(onSubmitAccountChange)}>Save</Button>
                                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                </div>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="last_name">Last name</FieldLabel>
                            <Input id="last_name" type="text" disabled={!editing} aria-invalid={!!errors.last_name}
                                {...register("last_name")}
                            />                     
                            <FieldError errors={[errors.last_name]}/>   
                            <Button onClick={()=>setEditing(true)}>{edit}</Button> 
                            {editing && (
                                <div>
                                    <Button onClick={handleSubmit(onSubmitAccountChange)}>Save</Button>
                                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                </div>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="current-email">Current mail</FieldLabel>
                            <p>{profile.email}</p>
                            <Button onClick={()=>setEditing(true)}>{edit}</Button> 
                        </Field>
                        {editing && (
                            <Field>
                                <FieldLabel htmlFor="new-email">Change email address</FieldLabel>
                                <Input id="user-email" type="email" disabled={!editing}
                                    aria-invalid={!!emailForm.formState.errors.email}
                                    {...emailForm.register("email")}
                                    />
                                <FieldError errors={[emailForm.formState.errors.email]}/>
                                <div>
                                    <Button onClick={emailForm.handleSubmit(onSubmitEmailChange)}>Send verification</Button>
                                    <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                    {emailChangeSent && (<p>{emailChangeSent}</p>)}
                                </div>
                            </Field>
                        )}
                        <Field>
                            <FieldLabel>Reset your password</FieldLabel>
                            <button onClick={()=>setEditing(true)}>{edit}</button>
                        </Field>
                        {editing && (
                            <Field>
                                <div>
                                    <div>
                                        <FieldLabel htmlFor="current-pwd">Current password</FieldLabel>
                                        <Input id="current-pwd" type="password" disabled={!editing}
                                            aria-invalid={!!passwordForm.formState.errors.current_password}
                                            {...passwordForm.register("current_password")}
                                        />
                                        <FieldError errors={[passwordForm.formState.errors.current_password]}/>
                                    </div>
                                    <div>
                                        <FieldLabel htmlFor="reset-pwd">New password</FieldLabel>
                                        <Input id="reset-pwd" type="password" disabled={!editing}
                                            aria-invalid={!!passwordForm.formState.errors.new_password}
                                            {...passwordForm.register("new_password")}
                                        />
                                        <FieldError errors={[passwordForm.formState.errors.new_password]}/>
                                    </div>
                                    <div>
                                        <FieldLabel htmlFor="reset-pwd">Confirm new password</FieldLabel>
                                        <Input id="reset-pwd" type="password" disabled={!editing}
                                            aria-invalid={!!passwordForm.formState.errors.confirm_password}
                                            {...passwordForm.register("confirm_password")}
                                        />
                                        <FieldError errors={[passwordForm.formState.errors.confirm_password]}/>
                                    </div>
                                    <div>
                                        <button onClick={passwordForm.handleSubmit(onSubmitPasswordChange)}>Reset</button>
                                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                        {passwordChangeCfm && (<p>{passwordChangeCfm}</p>)}
                                    </div>
                                </div>
                            </Field>
                        )}
                    </FieldGroup>
                </form>
              </CardContent>
            </Card>
    )
}

export default AccountTab