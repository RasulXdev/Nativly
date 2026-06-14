'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type HeroVariant = 'sapphire' | 'gold' | 'violet'

const VARIANTS: Record<HeroVariant, {
  bg: string
  radials: string
  orb1: string
  orb2: string
  btnBg: string
  btnText: string
}> = {
  sapphire: {
    bg: 'linear-gradient(135deg, oklch(0.40 0.16 258) 0%, oklch(0.34 0.14 260) 50%, oklch(0.28 0.11 262) 100%)',
    radials: `radial-gradient(ellipse 70% 60% at 85% -10%, rgba(255,255,255,0.12) 0%, transparent 65%),
              radial-gradient(ellipse 50% 50% at 0% 100%, oklch(0.72 0.17 68 / 0.12) 0%, transparent 60%)`,
    orb1: 'radial-gradient(circle, oklch(0.62 0.18 255 / 0.18) 0%, transparent 70%)',
    orb2: 'radial-gradient(circle, oklch(0.72 0.17 68 / 0.10) 0%, transparent 70%)',
    btnBg: 'bg-white text-[oklch(0.40_0.16_258)]',
    btnText: 'hover:bg-white/92',
  },
  gold: {
    bg: 'linear-gradient(135deg, oklch(0.25 0.055 68) 0%, oklch(0.20 0.045 72) 40%, oklch(0.16 0.035 240) 100%)',
    radials: `radial-gradient(ellipse 70% 60% at 90% -10%, oklch(0.72 0.17 68 / 0.20) 0%, transparent 65%),
              radial-gradient(ellipse 50% 50% at 0% 100%, oklch(0.50 0.18 255 / 0.15) 0%, transparent 60%)`,
    orb1: 'radial-gradient(circle, oklch(0.72 0.17 68 / 0.15) 0%, transparent 70%)',
    orb2: 'radial-gradient(circle, oklch(0.50 0.18 255 / 0.10) 0%, transparent 70%)',
    btnBg: 'bg-white/95 text-[oklch(0.25_0.055_68)]',
    btnText: 'hover:bg-white',
  },
  violet: {
    bg: 'linear-gradient(135deg, oklch(0.22 0.060 295) 0%, oklch(0.17 0.048 300) 45%, oklch(0.13 0.020 262) 100%)',
    radials: `radial-gradient(ellipse 65% 55% at 88% -10%, oklch(0.62 0.18 300 / 0.25) 0%, transparent 65%),
              radial-gradient(ellipse 50% 45% at 0% 100%, oklch(0.62 0.18 255 / 0.15) 0%, transparent 60%)`,
    orb1: 'radial-gradient(circle, oklch(0.62 0.18 300 / 0.15) 0%, transparent 70%)',
    orb2: 'radial-gradient(circle, oklch(0.62 0.18 255 / 0.10) 0%, transparent 70%)',
    btnBg: 'bg-white text-[oklch(0.22_0.060_295)]',
    btnText: 'hover:bg-white/92',
  },
}

interface HeroBannerProps {
  variant?: HeroVariant
  greeting: string
  title: string
  subtitle: string
  badge?: { label: string; color?: string }
  children?: React.ReactNode
}

export default function HeroBanner({
  variant = 'sapphire',
  greeting,
  title,
  subtitle,
  badge,
  children,
}: HeroBannerProps) {
  const v = VARIANTS[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden rounded-2xl text-white"
      style={{ background: v.bg }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Radial highlights */}
      <div className="absolute inset-0" style={{ background: v.radials }} />

      {/* Animated floating orbs */}
      <motion.div
        className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: v.orb1 }}
        animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-16 right-24 w-44 h-44 rounded-full pointer-events-none"
        style={{ background: v.orb2 }}
        animate={{ y: [0, 10, 0], x: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      {/* Shimmer sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)' }}
        animate={{ x: ['-100%', '200%'] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear', repeatDelay: 3 }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 p-7 sm:p-8">
        <motion.div
          className="min-w-0"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium border border-white/10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
              {greeting}
            </div>
            {badge && (
              <span className={cn(
                'text-xs font-semibold px-2.5 py-1 rounded-full border backdrop-blur-sm',
                badge.color ?? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
              )}>
                {badge.label}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{title}</h1>
          <p className="text-sm text-white/65 mt-2 max-w-sm leading-relaxed">{subtitle}</p>
        </motion.div>

        {/* Action buttons slot */}
        {children && (
          <motion.div
            className="flex flex-wrap gap-2.5 shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
