'use client'

import * as React from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { type LucideIcon, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

function CountAnimation({ number, format }: { number: number; format?: (v: number) => string }) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => (format ? format(Math.round(v * 100) / 100) : String(Math.round(v))))

  React.useEffect(() => {
    const animation = animate(count, number, { duration: 1.8, ease: [0.25, 0.46, 0.45, 0.94] })
    return animation.stop
  }, [number, count])

  return <motion.span>{rounded}</motion.span>
}

function Sparkles({ color, density = 20 }: { color: string; density?: number }) {
  const particles = React.useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2.5 + 0.5,
        delay: Math.random() * 3,
        duration: Math.random() * 1.5 + 1.5,
      })),
    [density]
  )

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size, backgroundColor: color }}
          animate={{ opacity: [0, 0.8, 0], scale: [0, 1.2, 0] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

export interface PremiumStatsCardProps {
  icon: LucideIcon
  label: string
  value: number
  unit?: string
  format?: (v: number) => string
  color: string
  colorBg: string
  colorBorder: string
  gradient: string
  className?: string
}

export function PremiumStatsCard({
  icon: Icon,
  label,
  value,
  unit,
  format,
  color,
  colorBg,
  colorBorder,
  gradient,
  className,
}: PremiumStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className={cn('relative group', className)}
    >
      {/* Outer glow on hover */}
      <div
        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl pointer-events-none"
        style={{ background: color }}
      />

      <div
        className="relative rounded-2xl border overflow-hidden transition-all duration-300 backdrop-blur-xl"
        style={{
          borderColor: 'oklch(1 0 0 / 0.07)',
          background: 'linear-gradient(145deg, oklch(0.165 0.024 260), oklch(0.135 0.020 260))',
        }}
      >
        {/* Sparkles */}
        <Sparkles color={color} density={18} />

        {/* Top accent bar */}
        <div className={cn('h-0.5 w-full bg-gradient-to-r', gradient)} />

        {/* Ambient glow on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${colorBg} 0%, transparent 70%)` }}
        />

        {/* Shimmer sweep on hover */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          style={{ background: `linear-gradient(105deg, transparent 40%, ${color}15 50%, transparent 60%)` }}
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />

        <div className="relative p-5">
          {/* Icon + unit badge */}
          <div className="flex items-start justify-between mb-4">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: colorBg, border: `1px solid ${colorBorder}` }}
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Icon className="h-[18px] w-[18px]" style={{ color }} />
            </motion.div>
            {unit && (
              <div
                className="flex items-center gap-0.5 text-[10px] font-semibold px-2 py-1 rounded-full"
                style={{ background: colorBg, color, border: `1px solid ${colorBorder}` }}
              >
                <TrendingUp className="h-2.5 w-2.5" />
                {unit}
              </div>
            )}
          </div>

          {/* Value with count-up animation */}
          <div className="text-2xl font-extrabold tracking-tight text-foreground tabular-nums">
            <CountAnimation number={value} format={format} />
          </div>

          {/* Label */}
          <p className="text-sm text-muted-foreground mt-1 font-medium">{label}</p>

          {/* Bottom accent line that grows on hover */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  )
}
