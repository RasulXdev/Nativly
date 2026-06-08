import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface BookingState {
  selectedDate: Date | null
  selectedTime: string | null
  selectedDuration: 30 | 60
  tutorId: string | null
  isTrialLesson: boolean
  note: string
  setSelectedDate: (date: Date | null) => void
  setSelectedTime: (time: string | null) => void
  setSelectedDuration: (duration: 30 | 60) => void
  setTutorId: (id: string | null) => void
  setIsTrialLesson: (isTrial: boolean) => void
  setNote: (note: string) => void
  reset: () => void
}

export const useBookingStore = create<BookingState>()(
  devtools(
    (set) => ({
      selectedDate: null,
      selectedTime: null,
      selectedDuration: 30,
      tutorId: null,
      isTrialLesson: false,
      note: '',
      setSelectedDate: (date) => set({ selectedDate: date }),
      setSelectedTime: (time) => set({ selectedTime: time }),
      setSelectedDuration: (duration) => set({ selectedDuration: duration }),
      setTutorId: (id) => set({ tutorId: id }),
      setIsTrialLesson: (isTrial) => set({ isTrialLesson: isTrial }),
      setNote: (note) => set({ note }),
      reset: () =>
        set({
          selectedDate: null,
          selectedTime: null,
          selectedDuration: 30,
          tutorId: null,
          isTrialLesson: false,
          note: '',
        }),
    }),
    { name: 'booking-store' }
  )
)
