'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  children: React.ReactNode
  className?: string
  delay?: number
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right'
}

export default function AnimateOnScroll({
  children,
  className,
  delay = 0,
  animation = 'fade-up',
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
          observer.unobserve(el)
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const animations = {
    'fade-up': visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    'fade-in': visible ? 'opacity-100' : 'opacity-0',
    'slide-left': visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    'slide-right': visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
  }

  return (
    <div
      ref={ref}
      className={cn('transition-all duration-700', animations[animation], className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
