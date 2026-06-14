'use client'

import { forwardRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Eye, EyeOff, Check } from 'lucide-react'
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
  { label, icon: Icon, error, password, labelAside, showLabel, hideLabel, id, className, onFocus, onBlur, onChange, ...props },
  ref
) {
  const [visible, setVisible] = useState(false)
  const [focused, setFocused] = useState(false)
  const [filled, setFilled] = useState(false)
  const type = password ? (visible ? 'text' : 'password') : props.type

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label
          htmlFor={id}
          className={cn(
            'text-[0.8rem] font-semibold transition-colors duration-200',
            focused ? 'text-primary' : 'text-foreground/75'
          )}
        >
          {label}
        </Label>
        {labelAside}
      </div>

      <div className="relative group">
        {/* Icon */}
        <Icon
          className={cn(
            'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-all duration-200',
            focused ? 'text-primary scale-110' : error ? 'text-destructive/60' : 'text-foreground/35'
          )}
        />

        <Input
          id={id}
          ref={ref}
          {...props}
          type={type}
          aria-invalid={!!error}
          onFocus={(e) => { setFocused(true); onFocus?.(e) }}
          onBlur={(e) => { setFocused(false); onBlur?.(e) }}
          onChange={(e) => { setFilled(e.target.value.length > 0); onChange?.(e) }}
          className={cn(
            'auth-input',
            (password || (filled && !error)) && 'pr-10',
            error && 'border-destructive/60',
            className
          )}
        />

        {/* Password toggle */}
        {password && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? hideLabel : showLabel}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 grid h-7 w-7 place-items-center rounded-lg text-foreground/40 hover:text-primary hover:bg-primary/5 transition-colors cursor-pointer"
          >
            {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}

        {/* Filled checkmark (non-password) */}
        {!password && filled && !error && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 grid h-5 w-5 place-items-center rounded-full bg-primary/12 text-primary animate-in zoom-in duration-200">
            <Check className="h-3 w-3" />
          </span>
        )}

        {/* Animated focus underline */}
        <span
          className={cn(
            'pointer-events-none absolute -bottom-px left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-300',
            focused ? 'w-[calc(100%-1.5rem)] bg-gradient-to-r from-transparent via-primary to-transparent' : 'w-0'
          )}
        />
      </div>

      {error && (
        <p className="text-xs text-destructive font-medium animate-in slide-in-from-top-1 duration-200">{error}</p>
      )}
    </div>
  )
})

export default AuthField
