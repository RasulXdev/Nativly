'use client'

import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'

export interface AvailabilityResponse {
  timezone: string
  date: string
  slots: { time: string; available: boolean }[]
}

/** Fetches a tutor's bookable 30-min slots for a given day from the API. */
export function useTutorAvailabilityDay(tutorId: string | undefined, date: Date | undefined) {
  const dateStr = date ? format(date, 'yyyy-MM-dd') : undefined

  return useQuery({
    queryKey: ['availability', tutorId, dateStr],
    enabled: Boolean(tutorId && dateStr),
    queryFn: async (): Promise<AvailabilityResponse> => {
      const res = await fetch(`/api/tutors/${tutorId}/availability?date=${dateStr}`)
      if (!res.ok) throw new Error('Vaxtlar yüklənmədi')
      return res.json()
    },
  })
}
