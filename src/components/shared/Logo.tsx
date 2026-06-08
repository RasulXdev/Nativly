import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

export default function Logo({ className, size = 'md', href = '/' }: LogoProps) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  return (
    <Link
      href={href}
      className={cn('font-bold tracking-tight text-primary', sizes[size], className)}
    >
      Nativly
    </Link>
  )
}
