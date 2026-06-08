export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          avatar_url: string | null
          phone: string | null
          role: 'student' | 'tutor' | 'admin'
          date_of_birth: string | null
          country: string | null
          city: string | null
          timezone: string | null
          preferred_language: string | null
          bio: string | null
          is_active: boolean
          is_online: boolean
          last_seen_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      tutor_profiles: {
        Row: {
          id: string
          user_id: string
          headline: string | null
          about: string | null
          video_intro_url: string | null
          hourly_rate: number
          trial_rate: number | null
          currency: string
          years_experience: number
          total_lessons: number
          total_hours: number
          average_rating: number
          total_reviews: number
          response_time_minutes: number | null
          completion_rate: number
          specializations: string[] | null
          education: string[] | null
          certificates: string[] | null
          application_status: 'pending' | 'approved' | 'rejected'
          approved_at: string | null
          is_featured: boolean
          is_accepting_students: boolean
          instant_booking: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutor_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['tutor_profiles']['Insert']>
      }
      languages: {
        Row: {
          id: string
          code: string
          name_az: string
          name_en: string
          name_ru: string
          flag_emoji: string | null
          is_active: boolean
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['languages']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['languages']['Insert']>
      }
      user_languages: {
        Row: {
          id: string
          user_id: string
          language_id: string
          level: 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced' | 'native'
          is_teaching: boolean
          is_learning: boolean
        }
        Insert: Omit<Database['public']['Tables']['user_languages']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['user_languages']['Insert']>
      }
      bookings: {
        Row: {
          id: string
          student_id: string
          tutor_id: string
          scheduled_at: string
          duration_minutes: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'expired'
          is_trial: boolean
          price: number
          currency: string
          student_note: string | null
          tutor_note: string | null
          cancelled_by: string | null
          cancelled_reason: string | null
          cancelled_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bookings']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
      }
      lessons: {
        Row: {
          id: string
          booking_id: string | null
          student_id: string
          tutor_id: string
          room_id: string | null
          status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
          scheduled_at: string
          started_at: string | null
          ended_at: string | null
          duration_minutes: number
          actual_duration_minutes: number | null
          price: number
          currency: string
          language_id: string | null
          topic: string | null
          tutor_notes: string | null
          student_notes: string | null
          shared_notes: string | null
          homework: string | null
          recording_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
      }
      reviews: {
        Row: {
          id: string
          lesson_id: string
          student_id: string
          tutor_id: string
          rating: number
          comment: string | null
          tutor_response: string | null
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['reviews']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
      }
      conversations: {
        Row: {
          id: string
          type: 'direct' | 'lesson'
          lesson_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['conversations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['conversations']['Insert']>
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          last_read_at: string
          is_muted: boolean
        }
        Insert: Omit<Database['public']['Tables']['conversation_participants']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['conversation_participants']['Insert']>
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          is_read: boolean
          is_edited: boolean
          attachment_url: string | null
          attachment_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['messages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['messages']['Insert']>
      }
      wallets: {
        Row: {
          id: string
          user_id: string
          balance: number
          currency: string
          total_deposited: number
          total_spent: number
          total_earned: number
          total_withdrawn: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['wallets']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['wallets']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'deposit' | 'lesson_payment' | 'lesson_earning' | 'withdrawal' | 'refund'
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          description: string | null
          lesson_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          metadata: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      packages: {
        Row: {
          id: string
          name_az: string
          name_en: string
          name_ru: string
          description_az: string | null
          description_en: string | null
          description_ru: string | null
          lesson_count: number
          duration_minutes: number
          price: number
          original_price: number | null
          currency: string
          discount_percent: number
          is_popular: boolean
          is_active: boolean
          sort_order: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['packages']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['packages']['Insert']>
      }
      student_packages: {
        Row: {
          id: string
          student_id: string
          package_id: string | null
          total_lessons: number
          used_lessons: number
          remaining_lessons: number
          duration_minutes: number
          expires_at: string | null
          is_active: boolean
          purchased_at: string
          transaction_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['student_packages']['Row'], 'id' | 'remaining_lessons' | 'purchased_at'>
        Update: Partial<Database['public']['Tables']['student_packages']['Insert']>
      }
      favorites: {
        Row: {
          id: string
          student_id: string
          tutor_id: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['favorites']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: 'lesson_reminder' | 'lesson_cancelled' | 'new_booking' | 'new_message' | 'payment' | 'review' | 'system'
          title: string
          body: string | null
          data: Json | null
          is_read: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['notifications']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['notifications']['Insert']>
      }
      tutor_availability: {
        Row: {
          id: string
          tutor_id: string
          day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
          start_time: string
          end_time: string
          is_active: boolean
        }
        Insert: Omit<Database['public']['Tables']['tutor_availability']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['tutor_availability']['Insert']>
      }
      tutor_unavailability: {
        Row: {
          id: string
          tutor_id: string
          date: string
          start_time: string | null
          end_time: string | null
          reason: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tutor_unavailability']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['tutor_unavailability']['Insert']>
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          reported_user_id: string | null
          lesson_id: string | null
          reason: string
          description: string | null
          status: string
          admin_notes: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'student' | 'tutor' | 'admin'
      lesson_status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'expired'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      tutor_application_status: 'pending' | 'approved' | 'rejected'
      language_level: 'beginner' | 'elementary' | 'intermediate' | 'upper_intermediate' | 'advanced' | 'native'
      day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
      notification_type: 'lesson_reminder' | 'lesson_cancelled' | 'new_booking' | 'new_message' | 'payment' | 'review' | 'system'
      conversation_type: 'direct' | 'lesson'
    }
  }
}
