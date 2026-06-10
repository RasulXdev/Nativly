'use client'

import { forwardRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface AuthFieldProps extends React.ComponentProps<'input'> {
  label: string
  icon: LucideIcon
  error?: string
  /** Renders a show/hide toggle and switches type between password/text */
  password?: boolean
  /** Optional node rendered to the right of the label (e.g. "Forgot?") */
  labelAside?: React.ReactNode
  showLabel?: string
  hideLabel?: string
}

const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(function AuthField(
  { label, icon: Icon, error, password, labelAside, showLabel, hideLabel, id, className, ...props },
  ref
) {
  const [visible, setVisible] = useState(false)
  const type = password ? (visible ? 'text' : 'password') : props.type

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-[0.8rem] font-semibold text-foreground/75">
          {label}
        </Label>
        {labelAside}
      </div>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/35" />
        <Input
          id={id}
          ref={ref}
          {...props}
          type={type}
          aria-invalid={!!error}
          className={cn('auth-input', password && 'pr-10', error && 'border-destructive/60', className)}
        />
        {password && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? hideLabel : showLabel}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-lg text-foreground/40 hover:text-foreground/70 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive font-medium">{error}</p>}
    </div>
  )
})

export default AuthField
