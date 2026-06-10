'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

type Animation = 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up' | 'blur-in' | 'rotate-in'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  animation?: Animation
  duration?: number
  once?: boolean
}

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  animation = 'fade-up',
  duration = 700,
  once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const base = 'transition-all ease-out'

  const animations: Record<Animation, string> = {
    'fade-up': visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
    'fade-in': visible ? 'opacity-100' : 'opacity-0',
    'slide-left': visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12',
    'slide-right': visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12',
    'scale-up': visible ? 'opacity-100 scale-100' : 'opacity-0 scale-90',
    'blur-in': visible ? 'opacity-100 blur-0' : 'opacity-0 blur-sm',
    'rotate-in': visible ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-3',
  }

  return (
    <div
      ref={ref}
      className={cn(base, animations[animation], className)}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  )
}
