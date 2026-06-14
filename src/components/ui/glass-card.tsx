'use client'

import { motion } from 'framer-motion'
import { type LucideIcon } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  title?: string
  icon?: LucideIcon
  actionLabel?: string
  actionHref?: string
  className?: string
  children: React.ReactNode
}

export function GlassCard({
  title,
  icon: Icon,
  actionLabel,
  actionHref,
  className,
  children,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'group/card relative rounded-2xl border overflow-hidden transition-all duration-300',
        className
      )}
      style={{
        borderColor: 'oklch(1 0 0 / 0.07)',
        background: 'linear-gradient(145deg, oklch(0.15 0.022 260), oklch(0.125 0.018 260))',
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.62 0.18 255 / 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Corner accents */}
      <div className="absolute top-2 left-2 w-1 h-1 rounded-full bg-primary/30 group-hover/card:bg-primary/60 transition-colors duration-500" />
      <div className="absolute top-2 right-2 w-1 h-1 rounded-full bg-primary/30 group-hover/card:bg-primary/60 transition-colors duration-500" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      {title && (
        <div className="relative px-5 py-4 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center shadow-sm">
                <Icon className="h-4 w-4 text-white" />
              </div>
            )}
            <h2 className="font-semibold text-sm text-foreground">{title}</h2>
          </div>
          {actionLabel && actionHref && (
            <Link
              href={actionHref as Parameters<typeof Link>[0]['href']}
              className="text-xs text-primary hover:underline font-medium transition-colors"
            >
              {actionLabel} →
            </Link>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative">{children}</div>
    </motion.div>
  )
}
