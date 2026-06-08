// API Response types

export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

// Auth
export interface AuthCallbackParams {
  code?: string
  next?: string
  locale?: string
  error?: string
}

// Tutor availability
export interface AvailabilitySlot {
  time: string        // "09:00"
  available: boolean
  datetime: string    // ISO string
}

export interface AvailabilityResponse {
  date: string
  slots: AvailabilitySlot[]
  timezone: string
}

// Booking
export interface CreateBookingRequest {
  tutorId: string
  scheduledAt: string // ISO string
  durationMinutes: 30 | 60
  isTrialLesson: boolean
  note?: string
}

export interface CreateBookingResponse {
  bookingId: string
  lessonId: string
  price: number
  currency: string
}

// LiveKit
export interface LiveKitTokenRequest {
  roomId: string
  participantName: string
}

export interface LiveKitTokenResponse {
  token: string
  url: string
}

// Stripe
export interface CreateCheckoutRequest {
  type: 'deposit' | 'package'
  amount?: number
  packageId?: string
  successUrl: string
  cancelUrl: string
}

export interface CreateCheckoutResponse {
  sessionId: string
  url: string
}

// Upload
export interface UploadResponse {
  url: string
  path: string
  bucket: string
}

// Admin stats
export interface AdminStats {
  totalUsers: number
  totalTutors: number
  totalLessons: number
  todayLessons: number
  todayRevenue: number
  monthRevenue: number
  pendingApplications: number
  activeLessons: number
}
