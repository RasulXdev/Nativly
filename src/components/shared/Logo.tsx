import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className, size = 'md' }: LogoProps) {
  const sizes = {
    sm: { text: 'text-lg', icon: 'w-7 h-7 text-xs' },
    md: { text: 'text-xl', icon: 'w-8 h-8 text-sm' },
    lg: { text: 'text-2xl', icon: 'w-9 h-9 text-base' },
  }

  return (
    <Link
      href="/"
      className={cn('flex items-center gap-2.5 group', className)}
    >
      <div className={cn(
        'gradient-bg rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-primary/20 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/30 group-hover:scale-105',
        sizes[size].icon
      )}>
        N
      </div>
      <span className={cn(
        'font-extrabold tracking-tight text-foreground',
        sizes[size].text
      )}>
        Nativly
      </span>
    </Link>
  )
}
