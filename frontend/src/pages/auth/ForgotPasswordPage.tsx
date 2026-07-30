import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiError } from '../../api/client'
import * as authApi from '../../api/auth'
import {
  forgotPasswordSchema,
  type ForgotPasswordValues,
} from '../../schemas/auth'
import { resolveErrorMessage } from '../../i18n/errors'
import { ForgotPasswordForm } from '../../components/forgot-password-form'

export function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })
  const [message, setMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (values: ForgotPasswordValues) => {
    setServerError(null)
    setMessage(null)
    try {
      const response = await authApi.forgotPassword(values)
      setMessage(response.message)
    } catch (err) {
      if (err instanceof ApiError) {
        setServerError(resolveErrorMessage(err.code, err.message))
      } else {
        setServerError('Request failed')
      }
    }
  }

  return (
    <ForgotPasswordForm
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      serverError={serverError}
      successMessage={message}
      onSubmit={handleSubmit(onSubmit)}
    />
  )
}
