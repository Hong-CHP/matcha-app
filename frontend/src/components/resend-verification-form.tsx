import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { CircleAlertIcon, MailCheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResendVerificationValues } from '@/schemas/auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type ResendVerificationFormProps = {
  register: UseFormRegister<ResendVerificationValues>
  errors: FieldErrors<ResendVerificationValues>
  isSubmitting: boolean
  serverError: string | null
  successMessage: string | null
  onSubmit: React.FormEventHandler<HTMLFormElement>
} & Omit<React.ComponentProps<'div'>, 'onSubmit'>

export function ResendVerificationForm({
  className,
  register,
  errors,
  isSubmitting,
  serverError,
  successMessage,
  onSubmit,
  ...props
}: ResendVerificationFormProps) {
  return (
    <div
      className={cn('mx-auto flex w-full max-w-sm flex-col gap-6', className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Resend verification email</CardTitle>
          <CardDescription
          className="text-center text-xs text-muted-foreground"
          >
            Didn&apos;t get the link? Enter your email and we&apos;ll send a new
            one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              {successMessage && (
                <Alert>
                  <MailCheckIcon />
                  <AlertTitle>Check your inbox</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              {serverError && (
                <Alert variant="destructive">
                  <CircleAlertIcon />
                  <AlertTitle>Request failed</AlertTitle>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Resend email'}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                <Link to="/auth/login">Back to login</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
