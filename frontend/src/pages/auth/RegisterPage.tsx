import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ApiError } from '../../api/client'
import * as authApi from '../../api/auth'
import { registerSchema, type RegisterValues } from '../../schemas/auth'
import { isRegisterField, resolveErrorMessage } from '../../i18n/errors'
import { RegisterForm } from '../../components/register-form'

export function RegisterPage() {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  })
  const [message, setMessage] = useState<string | null>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  const onSubmit = async (values: RegisterValues) => {
    setServerError(null)
    setMessage(null)
    try {
      const response = await authApi.register(values)
      setMessage(response.message)
    } catch (err) {
      if (err instanceof ApiError) {
        const msg = resolveErrorMessage(err.code, err.message)
        if (err.field && isRegisterField(err.field)) {
          setError(err.field, { message: msg })
        } else {
          setServerError(msg)
        }
      } else {
        setServerError('Registration failed')
      }
    }
  }

  return (
    <RegisterForm
      register={registerField}
      errors={errors}
      isSubmitting={isSubmitting}
      serverError={serverError}
      successMessage={message}
      onSubmit={handleSubmit(onSubmit)}
    />
  )
}
