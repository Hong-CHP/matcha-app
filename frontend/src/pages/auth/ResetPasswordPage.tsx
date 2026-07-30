import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ApiError } from '../../api/client'
import * as authApi from '../../api/auth'
import { useAuth } from '../../auth/useAuth'
import { resetPasswordSchema, type ResetPasswordValues } from '../../schemas/auth'
import { resolveErrorMessage } from '../../i18n/errors'
import {
  MissingResetToken,
  ResetPasswordForm,
} from '../../components/reset-password-form'

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { loginWithToken } = useAuth()
  const token = searchParams.get('token') ?? ''
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
  })
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (values: ResetPasswordValues) => {
    setServerError(null)
    try {
      const response = await authApi.resetPassword({ token, ...values })
      await loginWithToken(response.access_token)
      navigate('/')
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(resolveErrorMessage(err.code, err.message))
      } else {
        setServerError('Reset failed')
      }
    }
  }

  if (!token) {
    return <MissingResetToken />
  }

  return (
    <ResetPasswordForm
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      serverError={serverError}
      onSubmit={handleSubmit(onSubmit)}
    />
  )
}
