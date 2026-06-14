'use client'

import * as React from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ColumnDef<T = Record<string, unknown>> {
  key: string
  header: string
  sortable?: boolean
  align?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  emptyState?: React.ReactNode
  className?: string
  /** Row click handler */
  onRowClick?: (row: T) => void
}

type SortConfig = { key: string; direction: 'asc' | 'desc' } | null

function getAlignClass(align?: string) {
  if (align === 'center') return 'text-center'
  if (align === 'right') return 'text-right'
  return 'text-left'
}

export function DataTable<T extends object>({
  columns = [],
  data = [],
  emptyState,
  className,
  onRowClick,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>(null)

  const handleSort = React.useCallback((key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : { key, direction: 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }, [])

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data
    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortConfig.key]
      const bVal = (b as Record<string, unknown>)[sortConfig.key]
      if (aVal === bVal) return 0
      const comparison = (aVal as number | string) > (bVal as number | string) ? 1 : -1
      return sortConfig.direction === 'asc' ? comparison : -comparison
    })
  }, [data, sortConfig])

  return (
    <div
      className={cn('w-full rounded-2xl border border-border overflow-hidden', className)}
      style={{ background: 'linear-gradient(145deg, oklch(0.15 0.022 260), oklch(0.135 0.020 260))' }}
    >
      <div className="relative w-full overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="sticky top-0 z-10 backdrop-blur-sm border-b border-border" style={{ background: 'oklch(0.165 0.024 260 / 0.85)' }}>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'h-11 px-4 align-middle text-[11px] font-semibold uppercase tracking-wider text-muted-foreground',
                    getAlignClass(column.align),
                    column.sortable && 'cursor-pointer select-none hover:text-foreground transition-colors',
                    column.headerClassName
                  )}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className={cn('flex items-center gap-1.5', column.align === 'center' && 'justify-center', column.align === 'right' && 'justify-end')}>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className="inline-flex">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc'
                            ? <ChevronUp className="h-3.5 w-3.5 text-primary" />
                            : <ChevronDown className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/30" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-10 text-center">
                  {emptyState || <div className="text-muted-foreground text-sm">No data available</div>}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b border-border/50 last:border-0 transition-colors hover:bg-primary/[0.04]',
                    onRowClick && 'cursor-pointer'
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key} className={cn('px-4 py-3 align-middle', getAlignClass(column.align), column.className)}>
                      {column.render ? column.render(row) : ((row as Record<string, unknown>)[column.key] as React.ReactNode) ?? '—'}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
