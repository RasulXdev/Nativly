'use client'

import { useCountUp } from '@/hooks/useCountUp'

interface AnimatedNumberProps {
  value: number
  /** Receives the live (possibly fractional) value, returns the display string */
  format: (v: number) => string
  className?: string
}

/**
 * Renders a number that counts up from 0 to `value` when it scrolls into view.
 */
export default function AnimatedNumber({ value, format, className }: AnimatedNumberProps) {
  const { value: live, ref } = useCountUp(value)
  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={className}>
      {format(live)}
    </span>
  )
}
