import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RatingProps {
  value: number
  count?: number
  size?: 'sm' | 'md' | 'lg'
  showCount?: boolean
  className?: string
}

export default function Rating({ value, count, size = 'sm', showCount = true, className }: RatingProps) {
  const starSize = size === 'sm' ? 'h-3.5 w-3.5' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
  const textSize = size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              starSize,
              star <= Math.round(value)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-muted text-muted'
            )}
          />
        ))}
      </div>
      <span className={cn('font-semibold', textSize)}>{value.toFixed(1)}</span>
      {showCount && count != null && (
        <span className={cn('text-muted-foreground', textSize)}>({count})</span>
      )}
    </div>
  )
}
