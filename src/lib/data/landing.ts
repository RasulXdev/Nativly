import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/types/database'

type PackageRow = Database['public']['Tables']['packages']['Row']
type TutorRow = Database['public']['Tables']['tutor_profiles']['Row']

export type LandingPackage = {
  id: string
  name: string
  lessons: number
  minutes: number
  price: number
  originalPrice: number
  discount: number
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
  price: number
  specializations: string[]
  avatarUrl: string | null
}

type Locale = 'az' | 'en' | 'ru'

/**
 * The 3 main 30-minute packages shown on the landing page, pulled from the
 * `packages` table. Feature count grows with the tier to mirror the design.
 */
export async function getLandingPackages(locale: Locale): Promise<LandingPackage[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('packages')
    .select('id, name_az, name_en, name_ru, lesson_count, duration_minutes, price, original_price, discount_percent, is_popular')
    .eq('is_active', true)
    .eq('duration_minutes', 30)
    .order('sort_order', { ascending: true })
    .limit(3)

  if (error || !data) return []

  const rows = data as unknown as PackageRow[]
  return rows.map((p, i) => ({
    id: p.id,
    name: locale === 'en' ? p.name_en : locale === 'ru' ? p.name_ru : p.name_az,
    lessons: p.lesson_count,
    minutes: p.duration_minutes,
    price: Number(p.price),
    originalPrice: Number(p.original_price),
    discount: p.discount_percent,
    popular: p.is_popular,
    features: Math.min(6, 4 + i),
  }))
}

type TutorJoinRow = Pick<
  TutorRow,
  'id' | 'headline' | 'hourly_rate' | 'total_lessons' | 'average_rating' | 'total_reviews' | 'specializations'
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
    .select('id, headline, hourly_rate, total_lessons, average_rating, total_reviews, specializations, profiles(full_name, avatar_url)')
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
      price: Number(t.hourly_rate ?? 0),
      specializations: (t.specializations ?? []).slice(0, 2),
      avatarUrl: profile?.avatar_url ?? null,
    }
  })
}
