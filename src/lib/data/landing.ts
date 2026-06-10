import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database'

type PlanRow = Database['public']['Tables']['subscription_plans']['Row']
type TutorRow = Database['public']['Tables']['tutor_profiles']['Row']

export type LandingPlan = {
  id: string
  name: string
  lessonsPerMonth: number
  minutes: number
  priceAzn: number
  popular: boolean
  features: number
}

export type FeaturedTutor = {
  id: string
  name: string
  headline: string
  rating: number
  reviews: number
  lessons: number
  specializations: string[]
  avatarUrl: string | null
}

type Locale = 'az' | 'en' | 'ru'

/**
 * The 3 monthly subscription plans shown on the landing page, pulled from the
 * `subscription_plans` table. Feature count grows with the tier to mirror the
 * design. Prices are monthly in AZN — tutors no longer set their own rates.
 */
export async function getLandingPlans(locale: Locale): Promise<LandingPlan[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('subscription_plans')
    .select('id, name_az, name_en, name_ru, lessons_per_month, duration_minutes, price_azn, is_popular')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(3)

  if (error || !data) return []

  const rows = data as unknown as PlanRow[]
  return rows.map((p, i) => ({
    id: p.id,
    name: locale === 'en' ? p.name_en : locale === 'ru' ? p.name_ru : p.name_az,
    lessonsPerMonth: p.lessons_per_month,
    minutes: p.duration_minutes,
    priceAzn: Number(p.price_azn),
    popular: p.is_popular ?? false,
    features: Math.min(6, 4 + i),
  }))
}

type TutorJoinRow = Pick<
  TutorRow,
  'id' | 'headline' | 'total_lessons' | 'average_rating' | 'total_reviews' | 'specializations'
> & {
  profiles: { full_name: string; avatar_url: string | null } | { full_name: string; avatar_url: string | null }[] | null
}

/**
 * Up to 6 featured, approved tutors for the landing showcase. Returns an empty
 * array when none exist yet — the component falls back to a curated demo set.
 */
export async function getFeaturedTutors(): Promise<FeaturedTutor[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('tutor_profiles')
    .select('id, headline, total_lessons, average_rating, total_reviews, specializations, profiles(full_name, avatar_url)')
    .eq('application_status', 'approved')
    .eq('is_featured', true)
    .eq('is_accepting_students', true)
    .order('average_rating', { ascending: false })
    .limit(6)

  if (error || !data) return []

  const rows = data as unknown as TutorJoinRow[]
  return rows.map((t) => {
    const profile = Array.isArray(t.profiles) ? t.profiles[0] : t.profiles
    return {
      id: t.id,
      name: profile?.full_name ?? 'Tutor',
      headline: t.headline ?? '',
      rating: Number(t.average_rating ?? 0),
      reviews: t.total_reviews ?? 0,
      lessons: t.total_lessons ?? 0,
      specializations: (t.specializations ?? []).slice(0, 2),
      avatarUrl: profile?.avatar_url ?? null,
    }
  })
}
