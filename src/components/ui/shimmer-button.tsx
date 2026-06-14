'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const shimmerButtonVariants = cva(
  'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 overflow-hidden [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        primary: 'gradient-bg text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35',
        gold: 'gradient-bg-gold text-[oklch(0.20_0.06_60)] shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-500/35',
        ghost: 'bg-secondary/60 text-foreground border border-border hover:bg-secondary',
      },
      size: {
        sm: 'h-9 rounded-lg px-4 text-xs [&_svg]:size-3.5',
        default: 'h-11 rounded-xl px-6 text-sm [&_svg]:size-4',
        lg: 'h-12 rounded-xl px-8 text-base [&_svg]:size-[18px]',
        icon: 'h-11 w-11 rounded-xl [&_svg]:size-4',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof shimmerButtonVariants> {
  asChild?: boolean
  icon?: LucideIcon
  loading?: boolean
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, variant, size, asChild = false, icon: Icon, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          shimmerButtonVariants({ variant, size }),
          'hover:scale-[1.02] active:scale-[0.98]',
          className
        )}
        {...props}
      >
        {/* Shimmer sweep */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.25)_50%,transparent_60%)] transition-transform duration-700 group-hover:translate-x-full"
        />
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {loading ? <Loader2 className="animate-spin" /> : Icon ? <Icon /> : null}
          {children}
        </span>
      </Comp>
    )
  }
)
ShimmerButton.displayName = 'ShimmerButton'

export { ShimmerButton, shimmerButtonVariants }
