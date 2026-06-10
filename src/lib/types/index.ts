import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type TutorProfile = Database['public']['Tables']['tutor_profiles']['Row']
export type Language = Database['public']['Tables']['languages']['Row']
export type UserLanguage = Database['public']['Tables']['user_languages']['Row']
export type Booking = Database['public']['Tables']['bookings']['Row']
export type Lesson = Database['public']['Tables']['lessons']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type Conversation = Database['public']['Tables']['conversations']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Wallet = Database['public']['Tables']['wallets']['Row']
export type Transaction = Database['public']['Tables']['transactions']['Row']
export type SubscriptionPlan = Database['public']['Tables']['subscription_plans']['Row']
export type UserSubscription = Database['public']['Tables']['user_subscriptions']['Row']
export type TutorPayout = Database['public']['Tables']['tutor_payouts']['Row']
export type Favorite = Database['public']['Tables']['favorites']['Row']
export type Notification = Database['public']['Tables']['notifications']['Row']
export type TutorAvailability = Database['public']['Tables']['tutor_availability']['Row']

// Extended types with joins
export type TutorWithProfile = TutorProfile & {
  profiles: Profile
  user_languages?: (UserLanguage & { languages: Language })[]
}

export type LessonWithParticipants = Lesson & {
  student: Profile
  tutor: TutorProfile & { profiles: Profile }
  language?: Language
}

export type BookingWithTutor = Booking & {
  tutor_profiles: TutorProfile & { profiles: Profile }
}

export type ReviewWithStudent = Review & {
  profiles: Profile
}

export type MessageWithSender = Message & {
  sender: Profile
}

export type ConversationWithParticipants = Conversation & {
  participants: (Profile)[]
  last_message?: Message
  unread_count?: number
}

// Locale type
export type Locale = 'az' | 'en' | 'ru'

// Auth types
export type UserRole = 'student' | 'tutor' | 'admin'
