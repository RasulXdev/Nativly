import { cn } from '@/lib/utils'

interface OnlineStatusProps {
  isOnline: boolean
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}

export default function OnlineStatus({ isOnline, showLabel = false, size = 'sm', className }: OnlineStatusProps) {
  const dotSize = size === 'sm' ? 'h-2 w-2' : 'h-2.5 w-2.5'

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <span
        className={cn(
          'rounded-full shrink-0',
          dotSize,
          isOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-muted-foreground/40'
        )}
      />
      {showLabel && (
        <span className="text-xs text-muted-foreground">
          {isOnline ? 'Onlayn' : 'Oflayn'}
        </span>
      )}
    </div>
  )
}
