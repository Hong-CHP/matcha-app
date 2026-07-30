import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { CircleAlertIcon, MailCheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RegisterValues } from '@/schemas/auth'
import heroImage from '@/assets/hero.png'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type RegisterFormProps = {
  register: UseFormRegister<RegisterValues>
  errors: FieldErrors<RegisterValues>
  isSubmitting: boolean
  serverError: string | null
  successMessage: string | null
  onSubmit: React.FormEventHandler<HTMLFormElement>
} & Omit<React.ComponentProps<'div'>, 'onSubmit'>

export function RegisterForm({
  className,
  register,
  errors,
  isSubmitting,
  serverError,
  successMessage,
  onSubmit,
  ...props
}: RegisterFormProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={onSubmit} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-balance text-muted-foreground">
                  Join Matcha and start matching
                </p>
              </div>

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
                  <AlertTitle>Registration failed</AlertTitle>
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

              <Field data-invalid={!!errors.username}>
                <FieldLabel htmlFor="username">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="your_username"
                  aria-invalid={!!errors.username}
                  {...register('username')}
                />
                <FieldError errors={[errors.username]} />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field data-invalid={!!errors.first_name}>
                  <FieldLabel htmlFor="first_name">First name</FieldLabel>
                  <Input
                    id="first_name"
                    type="text"
                    autoComplete="given-name"
                    aria-invalid={!!errors.first_name}
                    {...register('first_name')}
                  />
                  <FieldError errors={[errors.first_name]} />
                </Field>

                <Field data-invalid={!!errors.last_name}>
                  <FieldLabel htmlFor="last_name">Last name</FieldLabel>
                  <Input
                    id="last_name"
                    type="text"
                    autoComplete="family-name"
                    aria-invalid={!!errors.last_name}
                    {...register('last_name')}
                  />
                  <FieldError errors={[errors.last_name]} />
                </Field>
              </div>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
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
                  <FieldDescription
                  className="text-[0.6rem] text-muted-foreground"
                  >
                    At least 8 characters, with an uppercase letter, a lowercase
                    letter and a number.
                  </FieldDescription>
                )}
              </Field>

              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account? <Link to="/auth/login">Login</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src={heroImage}
              alt="Matcha"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
