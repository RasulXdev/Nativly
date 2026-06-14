'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 → target with an ease-out curve once the element
 * is mounted. Respects prefers-reduced-motion. Returns the live value plus a
 * ref to attach to the element (animation only starts when it scrolls in view).
 */
export function useCountUp(target: number, durationMs = 1100) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLElement | null>(null)
  const started = useRef(false)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced || target === 0) {
      setValue(target)
      return
    }

    const node = ref.current
    if (!node) {
      // No element to observe — just run immediately.
      runAnimation()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true
          runAnimation()
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(node)

    function runAnimation() {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1)
        const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
        setValue(target * eased)
        if (progress < 1) requestAnimationFrame(tick)
        else setValue(target)
      }
      requestAnimationFrame(tick)
    }

    return () => observer.disconnect()
  }, [target, durationMs])

  return { value, ref }
}
