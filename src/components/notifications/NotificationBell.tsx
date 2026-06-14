'use client'

import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import {
  Bell,
  CalendarCheck,
  CalendarX,
  MessageSquare,
  CreditCard,
  Star,
  Info,
  CheckCheck,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { az, enUS, ru, type Locale } from 'date-fns/locale'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  type NotificationRow,
} from '@/hooks/useNotifications'

const TYPE_META: Record<
  string,
  { icon: typeof Bell; className: string }
> = {
  new_booking: { icon: CalendarCheck, className: 'text-emerald-400 bg-emerald-500/10' },
  lesson_reminder: { icon: CalendarCheck, className: 'text-primary bg-primary/10' },
  lesson_cancelled: { icon: CalendarX, className: 'text-rose-400 bg-rose-500/10' },
  new_message: { icon: MessageSquare, className: 'text-sky-400 bg-sky-500/10' },
  payment: { icon: CreditCard, className: 'text-amber-400 bg-amber-500/10' },
  review: { icon: Star, className: 'text-yellow-400 bg-yellow-500/10' },
  system: { icon: Info, className: 'text-muted-foreground bg-muted/40' },
}

function routeFor(n: NotificationRow): string | null {
  switch (n.type) {
    case 'new_booking':
    case 'lesson_reminder':
    case 'lesson_cancelled':
      return '/schedule'
    case 'new_message':
      return '/messages'
    case 'payment':
      return '/wallet'
    default:
      return null
  }
}

const LOCALES: Record<string, Locale> = { az, en: enUS, ru }

export default function NotificationBell() {
  const t = useTranslations('notifications')
  const dfLocale = LOCALES[useLocale()] ?? enUS
  const router = useRouter()
  const locale = useLocale()
  const { data: notifications = [], unreadCount } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllNotificationsRead()

  const handleClick = (n: NotificationRow) => {
    if (!n.is_read) markRead.mutate(n.id)
    const path = routeFor(n)
    if (path) router.push(`/${locale}${path}`)
  }

  return (
    <Popover>
      <PopoverTrigger className="relative h-9 w-9 flex items-center justify-center rounded-xl hover:bg-white/6 text-muted-foreground hover:text-foreground transition-colors">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-1 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
        <span className="sr-only">{t('title')}</span>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="dark bg-popover text-popover-foreground w-80 p-0"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <p className="text-sm font-semibold">{t('title')}</p>
          {unreadCount > 0 && (
            <button
              onClick={() => markAll.mutate()}
              disabled={markAll.isPending}
              className="flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              {t('markAllRead')}
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-muted/40 flex items-center justify-center mb-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">{t('noNotifications')}</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[360px]">
            <div className="divide-y divide-border/60">
              {notifications.map((n) => {
                const meta = TYPE_META[n.type] ?? TYPE_META.system
                const Icon = meta.icon
                return (
                  <button
                    key={n.id}
                    onClick={() => handleClick(n)}
                    className={cn(
                      'w-full text-left flex gap-3 px-4 py-3 hover:bg-white/5 transition-colors',
                      !n.is_read && 'bg-primary/5'
                    )}
                  >
                    <div
                      className={cn(
                        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                        meta.className
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight truncate">
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {n.body}
                        </p>
                      )}
                      {n.created_at && (
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          {formatDistanceToNow(new Date(n.created_at), {
                            addSuffix: true,
                            locale: dfLocale,
                          })}
                        </p>
                      )}
                    </div>
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                    )}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
