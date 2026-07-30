import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { CircleAlertIcon, LinkIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ResetPasswordValues } from '@/schemas/auth'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthStatusCard } from '@/components/auth-status-card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type ResetPasswordFormProps = {
  register: UseFormRegister<ResetPasswordValues>
  errors: FieldErrors<ResetPasswordValues>
  isSubmitting: boolean
  serverError: string | null
  onSubmit: React.FormEventHandler<HTMLFormElement>
} & Omit<React.ComponentProps<'div'>, 'onSubmit'>

export function ResetPasswordForm({
  className,
  register,
  errors,
  isSubmitting,
  serverError,
  onSubmit,
  ...props
}: ResetPasswordFormProps) {
  return (
    <div
      className={cn('mx-auto flex w-full max-w-sm flex-col gap-6', className)}
      {...props}
    >
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Choose a new password</CardTitle>
          <CardDescription>
            You&apos;ll be signed in automatically once it&apos;s updated.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit}>
            <FieldGroup>
              {serverError && (
                <Alert variant="destructive">
                  <CircleAlertIcon />
                  <AlertTitle>Reset failed</AlertTitle>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">New password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                {errors.password ? (
                  <FieldError errors={[errors.password]} />
                ) : (
                  <FieldDescription>
                    At least 8 characters, with an uppercase letter, a lowercase
                    letter and a number.
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update password'}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function MissingResetToken() {
  return (
    <AuthStatusCard
      icon={<LinkIcon />}
      title="This reset link is incomplete"
      description="The link is missing its token. It may have been truncated by your email client, or already used."
      action={
        <Button
          nativeButton={false}
          render={<Link to="/auth/forgot-password" />}
        >
          Request a new link
        </Button>
      }
    />
  )
}
