import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiError } from '../../api/client'
import * as authApi from '../../api/auth'
import {
  resendVerificationSchema,
  type ResendVerificationValues,
} from '../../schemas/auth'
import { resolveErrorMessage } from '../../i18n/errors'
import { ResendVerificationForm } from '../../components/resend-verification-form'

export function ResendVerificationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendVerificationValues>({
    resolver: zodResolver(resendVerificationSchema),
  })
  const [message, setMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (values: ResendVerificationValues) => {
    setServerError(null)
    setMessage(null)
    try {
      const response = await authApi.resendVerification(values.email)
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
    <ResendVerificationForm
      register={register}
      errors={errors}
      isSubmitting={isSubmitting}
      serverError={serverError}
      successMessage={message}
      onSubmit={handleSubmit(onSubmit)}
    />
  )
}
