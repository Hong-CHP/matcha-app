import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/card'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'

type AuthStatusCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  /** Recovery action, omitted while a request is still in flight. */
  action?: React.ReactNode
} & React.ComponentProps<'div'>

/**
 * Terminal screen for the token-driven auth routes (email verification, 42
 * callback, malformed reset links): the outcome is reported, and the only
 * thing left to do is leave.
 */
export function AuthStatusCard({
  className,
  icon,
  title,
  description,
  action,
  ...props
}: AuthStatusCardProps) {
  return (
    <div
      className={cn('mx-auto flex w-full max-w-sm flex-col gap-6', className)}
      {...props}
    >
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">{icon}</EmptyMedia>
            <EmptyTitle>{title}</EmptyTitle>
            <EmptyDescription>{description}</EmptyDescription>
          </EmptyHeader>
          {action && <EmptyContent>{action}</EmptyContent>}
        </Empty>
      </Card>
    </div>
  )
}
