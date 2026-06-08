# NATIVLY — Production Blueprint for Claude Code

> **Nativly** — Azərbaycan üçün online dil öyrənmə platforması (Cambly modeli)
> Domain: nativly.az | getnativly.com
> Deploy: Vercel | DB: Supabase | Video: LiveKit Cloud

---

## ÖNCƏDƏn HAZIRLANMALI (Claude Code-a başlamazdan əvvəl)

### Supabase
1. https://supabase.com → yeni proyekt yarat (region: Frankfurt — Bakıya ən yaxın)
2. Bu dəyərləri götür:
   - `NEXT_PUBLIC_SUPABASE_URL` → Settings → API → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Settings → API → anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` → Settings → API → service_role key (gizli saxla)
3. Authentication → Providers → Google aktiv et (Google Cloud Console-dan OAuth Client ID / Secret lazımdır)
4. Authentication → Providers → Email aktiv et (magic link + password)

### LiveKit Cloud (Video Calls üçün)
1. https://cloud.livekit.io → pulsuz hesab aç
2. Bu dəyərləri götür:
   - `LIVEKIT_URL` → wss://your-project.livekit.cloud
   - `LIVEKIT_API_KEY`
   - `LIVEKIT_API_SECRET`

### Vercel
1. https://vercel.com → GitHub repo-nu connect et
2. Environment Variables-a yuxarıdakı bütün key-ləri əlavə et

### Ödəniş (Gün 8-ə qədər hazır olmalı)
- Stripe hesabı aç (AZ-da işləyir) → `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- və ya hesab.az / payriff.com / kapital bank e-commerce (lokal alternativlər — API docs yoxla)

### Google (OAuth + Maps)
- Google Cloud Console → OAuth 2.0 Client ID yarat
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### Bütün `.env.local` faylı belə olmalıdır:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# LiveKit
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Nativly
```

---

## TEXNOLOGİYA STEKI

| Qat | Texnologiya |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Dil | TypeScript (strict mode) |
| Styling | Tailwind CSS 3.4+ |
| UI Komponentlər | shadcn/ui (bütün komponentlər) |
| State | Zustand (global) + React Query (server) |
| DB | Supabase PostgreSQL |
| Auth | Supabase Auth (Email + Google) |
| Storage | Supabase Storage (avatarlar, sənədlər) |
| Realtime | Supabase Realtime (mesajlar, status) |
| Video | LiveKit (@livekit/components-react) |
| Ödəniş | Stripe |
| Email | Resend (tranzaksional emaillər) |
| i18n | next-intl (AZ / EN / RU) |
| Validation | Zod |
| Forms | React Hook Form + Zod resolver |
| Deploy | Vercel |
| Analytics | Vercel Analytics + PostHog |

---

## GÜN 1 — PROYEKT SETUP + DATABASE + AUTH

### 1.1 Proyekt İnisializasiyası
```bash
npx create-next-app@latest nativly --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd nativly
```

### 1.2 Paketlərin Quraşdırılması
```bash
# UI
npx shadcn@latest init
npx shadcn@latest add button card input label dialog dropdown-menu avatar badge separator sheet tabs textarea select command popover calendar toast sonner skeleton switch scroll-area

# Core
npm install @supabase/supabase-js @supabase/ssr zustand @tanstack/react-query zod react-hook-form @hookform/resolvers

# i18n
npm install next-intl

# Utils
npm install date-fns lucide-react clsx tailwind-merge class-variance-authority

# Video (Day 6-da istifadə olunacaq amma indi quraşdır)
npm install @livekit/components-react livekit-client livekit-server-sdk

# Ödəniş (Day 8-də istifadə olunacaq amma indi quraşdır)
npm install stripe @stripe/stripe-js @stripe/react-stripe-js
```

### 1.3 Proyekt Strukturu
```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx                  # Root layout with i18n
│   │   ├── page.tsx                    # Landing page
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── register/page.tsx
│   │   │   ├── register/tutor/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── (platform)/
│   │   │   ├── layout.tsx              # Dashboard layout (sidebar + topbar)
│   │   │   ├── dashboard/page.tsx      # Student dashboard
│   │   │   ├── tutors/
│   │   │   │   ├── page.tsx            # Browse tutors
│   │   │   │   └── [id]/page.tsx       # Tutor profile
│   │   │   ├── schedule/page.tsx       # My schedule
│   │   │   ├── lessons/
│   │   │   │   ├── page.tsx            # Lesson history
│   │   │   │   └── [id]/page.tsx       # Lesson detail + review
│   │   │   ├── messages/
│   │   │   │   ├── page.tsx            # All conversations
│   │   │   │   └── [conversationId]/page.tsx
│   │   │   ├── room/[roomId]/page.tsx  # Video room
│   │   │   ├── settings/
│   │   │   │   ├── page.tsx            # Profile settings
│   │   │   │   ├── billing/page.tsx
│   │   │   │   └── notifications/page.tsx
│   │   │   └── wallet/page.tsx         # Balance & transactions
│   │   ├── (tutor)/
│   │   │   ├── layout.tsx              # Tutor-specific layout
│   │   │   ├── tutor-dashboard/page.tsx
│   │   │   ├── tutor-schedule/page.tsx
│   │   │   ├── tutor-students/page.tsx
│   │   │   ├── tutor-earnings/page.tsx
│   │   │   └── tutor-settings/page.tsx
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── admin/page.tsx          # Admin dashboard
│   │   │   ├── admin/users/page.tsx
│   │   │   ├── admin/tutors/page.tsx   # Tutor applications
│   │   │   ├── admin/lessons/page.tsx
│   │   │   ├── admin/payments/page.tsx
│   │   │   └── admin/settings/page.tsx
│   │   └── (public)/
│   │       ├── about/page.tsx
│   │       ├── pricing/page.tsx
│   │       ├── how-it-works/page.tsx
│   │       ├── become-tutor/page.tsx
│   │       ├── faq/page.tsx
│   │       ├── privacy/page.tsx
│   │       ├── terms/page.tsx
│   │       └── contact/page.tsx
│   └── api/
│       ├── auth/callback/route.ts
│       ├── livekit/token/route.ts
│       ├── stripe/
│       │   ├── checkout/route.ts
│       │   ├── webhook/route.ts
│       │   └── portal/route.ts
│       ├── tutors/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── lessons/
│       │   ├── route.ts
│       │   └── [id]/route.ts
│       ├── messages/route.ts
│       ├── upload/route.ts
│       └── admin/
│           ├── stats/route.ts
│           └── users/route.ts
├── components/
│   ├── ui/                    # shadcn components (auto-generated)
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── MobileNav.tsx
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── TutorShowcase.tsx
│   │   ├── Stats.tsx
│   │   ├── FAQ.tsx
│   │   └── CTA.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── TutorRegisterForm.tsx
│   │   ├── SocialButtons.tsx
│   │   └── AuthGuard.tsx
│   ├── tutors/
│   │   ├── TutorCard.tsx
│   │   ├── TutorGrid.tsx
│   │   ├── TutorFilters.tsx
│   │   ├── TutorProfile.tsx
│   │   ├── TutorAvailability.tsx
│   │   ├── TutorReviews.tsx
│   │   └── BookingModal.tsx
│   ├── lessons/
│   │   ├── LessonCard.tsx
│   │   ├── LessonList.tsx
│   │   ├── LessonTimer.tsx
│   │   ├── LessonNotes.tsx
│   │   └── ReviewForm.tsx
│   ├── schedule/
│   │   ├── WeeklyCalendar.tsx
│   │   ├── TimeSlotPicker.tsx
│   │   ├── AvailabilityEditor.tsx
│   │   └── UpcomingLessons.tsx
│   ├── video/
│   │   ├── VideoRoom.tsx
│   │   ├── VideoControls.tsx
│   │   ├── ParticipantView.tsx
│   │   ├── ChatPanel.tsx
│   │   └── SharedNotes.tsx
│   ├── messages/
│   │   ├── ConversationList.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx
│   │   └── ConversationView.tsx
│   ├── dashboard/
│   │   ├── StatsCards.tsx
│   │   ├── UpcomingLessons.tsx
│   │   ├── RecentActivity.tsx
│   │   ├── ProgressChart.tsx
│   │   └── RecommendedTutors.tsx
│   └── shared/
│       ├── Logo.tsx
│       ├── LanguageSwitcher.tsx
│       ├── ThemeToggle.tsx
│       ├── LoadingSpinner.tsx
│       ├── EmptyState.tsx
│       ├── ErrorBoundary.tsx
│       ├── Avatar.tsx
│       ├── Rating.tsx
│       ├── PriceDisplay.tsx
│       └── OnlineStatus.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   ├── server.ts           # Server client
│   │   ├── middleware.ts        # Auth middleware
│   │   └── admin.ts            # Service role client
│   ├── livekit/
│   │   └── server.ts           # Token generation
│   ├── stripe/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── validations/
│   │   ├── auth.ts
│   │   ├── booking.ts
│   │   ├── profile.ts
│   │   └── review.ts
│   ├── utils.ts
│   ├── constants.ts
│   └── types/
│       ├── database.ts         # Supabase generated types
│       ├── index.ts
│       └── api.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useTutors.ts
│   ├── useLessons.ts
│   ├── useMessages.ts
│   ├── useSchedule.ts
│   ├── useBooking.ts
│   └── useRealtime.ts
├── stores/
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── bookingStore.ts
├── messages/                   # i18n translations
│   ├── az.json
│   ├── en.json
│   └── ru.json
├── middleware.ts                # Auth + i18n middleware
└── styles/
    └── globals.css
```

### 1.4 Supabase Database Schema

Bu SQL-i Supabase SQL Editor-da işlət (Claude Code da `supabase/migrations/` folder-ə yazacaq):

```sql
-- ============================================
-- NATIVLY DATABASE SCHEMA — FULL PRODUCTION
-- ============================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- for fuzzy search

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE user_role AS ENUM ('student', 'tutor', 'admin');
CREATE TYPE lesson_status AS ENUM ('scheduled', 'in_progress', 'completed', 'cancelled', 'no_show');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'expired');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE tutor_application_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE language_level AS ENUM ('beginner', 'elementary', 'intermediate', 'upper_intermediate', 'advanced', 'native');
CREATE TYPE day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');
CREATE TYPE notification_type AS ENUM ('lesson_reminder', 'lesson_cancelled', 'new_booking', 'new_message', 'payment', 'review', 'system');
CREATE TYPE conversation_type AS ENUM ('direct', 'lesson');

-- ============================================
-- PROFILES (extends Supabase Auth)
-- ============================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'student',
    date_of_birth DATE,
    country TEXT DEFAULT 'AZ',
    city TEXT DEFAULT 'Bakı',
    timezone TEXT DEFAULT 'Asia/Baku',
    preferred_language TEXT DEFAULT 'az', -- interface language
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    is_online BOOLEAN DEFAULT false,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LANGUAGES (dillər siyahısı)
-- ============================================
CREATE TABLE languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL, -- 'en', 'az', 'ru', 'tr', 'de', 'fr', etc.
    name_az TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    flag_emoji TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0
);

-- Seed languages
INSERT INTO languages (code, name_az, name_en, name_ru, flag_emoji, sort_order) VALUES
('en', 'İngilis dili', 'English', 'Английский', '🇬🇧', 1),
('ru', 'Rus dili', 'Russian', 'Русский', '🇷🇺', 2),
('tr', 'Türk dili', 'Turkish', 'Турецкий', '🇹🇷', 3),
('de', 'Alman dili', 'German', 'Немецкий', '🇩🇪', 4),
('fr', 'Fransız dili', 'French', 'Французский', '🇫🇷', 5),
('az', 'Azərbaycan dili', 'Azerbaijani', 'Азербайджанский', '🇦🇿', 6),
('ar', 'Ərəb dili', 'Arabic', 'Арабский', '🇸🇦', 7),
('es', 'İspan dili', 'Spanish', 'Испанский', '🇪🇸', 8),
('it', 'İtalyan dili', 'Italian', 'Итальянский', '🇮🇹', 9),
('zh', 'Çin dili', 'Chinese', 'Китайский', '🇨🇳', 10),
('ja', 'Yapon dili', 'Japanese', 'Японский', '🇯🇵', 11),
('ko', 'Koreya dili', 'Korean', 'Корейский', '🇰🇷', 12);

-- ============================================
-- USER LANGUAGES (istifadəçinin bildiyi/öyrəndiyi dillər)
-- ============================================
CREATE TABLE user_languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    language_id UUID NOT NULL REFERENCES languages(id) ON DELETE CASCADE,
    level language_level NOT NULL,
    is_teaching BOOLEAN DEFAULT false, -- true = tutor teaches this
    is_learning BOOLEAN DEFAULT false, -- true = student learning this
    UNIQUE(user_id, language_id)
);

-- ============================================
-- TUTOR PROFILES
-- ============================================
CREATE TABLE tutor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    headline TEXT, -- "IELTS Expert | Native English Speaker"
    about TEXT, -- detailed bio
    video_intro_url TEXT, -- intro video
    hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 15.00, -- USD
    trial_rate DECIMAL(10,2) DEFAULT 5.00, -- trial lesson price
    currency TEXT DEFAULT 'USD',
    years_experience INT DEFAULT 0,
    total_lessons INT DEFAULT 0,
    total_hours DECIMAL(10,2) DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_reviews INT DEFAULT 0,
    response_time_minutes INT, -- average response time
    completion_rate DECIMAL(5,2) DEFAULT 100, -- % of completed lessons
    specializations TEXT[], -- ['IELTS', 'Business English', 'Kids', 'Conversation']
    education TEXT[], -- ["BSc Computer Science, University of London"]
    certificates TEXT[], -- ["TEFL Certified", "IELTS Band 9"]
    application_status tutor_application_status DEFAULT 'pending',
    approved_at TIMESTAMPTZ,
    is_featured BOOLEAN DEFAULT false,
    is_accepting_students BOOLEAN DEFAULT true,
    instant_booking BOOLEAN DEFAULT true, -- can book without approval
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TUTOR AVAILABILITY (həftəlik cədvəl)
-- ============================================
CREATE TABLE tutor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    day_of_week day_of_week NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- ============================================
-- TUTOR UNAVAILABILITY (xüsusi qeyri-iş günləri)
-- ============================================
CREATE TABLE tutor_unavailability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    start_time TIME, -- null = all day
    end_time TIME,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BOOKINGS (rezervasiyalar)
-- ============================================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30, -- 30 or 60
    status booking_status DEFAULT 'pending',
    is_trial BOOLEAN DEFAULT false,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    student_note TEXT, -- student message to tutor
    tutor_note TEXT,
    cancelled_by UUID REFERENCES profiles(id),
    cancelled_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- LESSONS (dərslər — booking confirm olunandan sonra yaranır)
-- ============================================
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID UNIQUE REFERENCES bookings(id) ON DELETE SET NULL,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    room_id TEXT UNIQUE, -- LiveKit room name
    status lesson_status DEFAULT 'scheduled',
    scheduled_at TIMESTAMPTZ NOT NULL,
    started_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    duration_minutes INT NOT NULL DEFAULT 30,
    actual_duration_minutes INT,
    price DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    language_id UUID REFERENCES languages(id),
    topic TEXT,
    tutor_notes TEXT, -- tutor's private notes about student
    student_notes TEXT,
    shared_notes TEXT, -- collaborative notes during lesson
    homework TEXT,
    recording_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REVIEWS (dərs rəyləri)
-- ============================================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID UNIQUE NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tutor_response TEXT,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CONVERSATIONS (söhbətlər)
-- ============================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type conversation_type DEFAULT 'direct',
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    last_read_at TIMESTAMPTZ DEFAULT NOW(),
    is_muted BOOLEAN DEFAULT false,
    UNIQUE(conversation_id, user_id)
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_edited BOOLEAN DEFAULT false,
    attachment_url TEXT,
    attachment_type TEXT, -- 'image', 'file', 'audio'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS & WALLET
-- ============================================
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    total_deposited DECIMAL(10,2) DEFAULT 0,
    total_spent DECIMAL(10,2) DEFAULT 0,
    total_earned DECIMAL(10,2) DEFAULT 0, -- for tutors
    total_withdrawn DECIMAL(10,2) DEFAULT 0, -- for tutors
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'deposit', 'lesson_payment', 'lesson_earning', 'withdrawal', 'refund'
    amount DECIMAL(10,2) NOT NULL,
    currency TEXT DEFAULT 'USD',
    status payment_status DEFAULT 'pending',
    description TEXT,
    lesson_id UUID REFERENCES lessons(id),
    stripe_payment_intent_id TEXT,
    stripe_session_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PACKAGES (dərs paketləri)
-- ============================================
CREATE TABLE packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_az TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    description_az TEXT,
    description_en TEXT,
    description_ru TEXT,
    lesson_count INT NOT NULL, -- 4, 8, 12, 20
    duration_minutes INT NOT NULL DEFAULT 30, -- per lesson
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2), -- for showing discount
    currency TEXT DEFAULT 'USD',
    discount_percent INT DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed packages
INSERT INTO packages (name_az, name_en, name_ru, lesson_count, duration_minutes, price, original_price, discount_percent, is_popular, sort_order) VALUES
('Başlanğıc', 'Starter', 'Стартер', 4, 30, 49.99, 59.96, 15, false, 1),
('Populyar', 'Popular', 'Популярный', 8, 30, 89.99, 119.92, 25, true, 2),
('Premium', 'Premium', 'Премиум', 12, 30, 119.99, 179.88, 33, false, 3),
('Intensiv', 'Intensive', 'Интенсив', 20, 30, 179.99, 299.80, 40, false, 4),
('Başlanğıc 60', 'Starter 60', 'Стартер 60', 4, 60, 89.99, 107.96, 15, false, 5),
('Populyar 60', 'Popular 60', 'Популярный 60', 8, 60, 159.99, 215.92, 25, false, 6),
('Premium 60', 'Premium 60', 'Премиум 60', 12, 60, 219.99, 323.88, 32, false, 7);

-- ============================================
-- STUDENT PACKAGES (alınmış paketlər)
-- ============================================
CREATE TABLE student_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    package_id UUID REFERENCES packages(id),
    total_lessons INT NOT NULL,
    used_lessons INT DEFAULT 0,
    remaining_lessons INT GENERATED ALWAYS AS (total_lessons - used_lessons) STORED,
    duration_minutes INT NOT NULL DEFAULT 30,
    expires_at TIMESTAMPTZ, -- package expiry
    is_active BOOLEAN DEFAULT true,
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    transaction_id UUID REFERENCES transactions(id)
);

-- ============================================
-- FAVORITES (seçilmişlər)
-- ============================================
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    tutor_id UUID NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, tutor_id)
);

-- ============================================
-- NOTIFICATIONS
-- ============================================
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data JSONB, -- { lesson_id, tutor_id, etc. }
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REPORTS (şikayətlər)
-- ============================================
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reported_user_id UUID REFERENCES profiles(id),
    lesson_id UUID REFERENCES lessons(id),
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'resolved'
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_is_online ON profiles(is_online);
CREATE INDEX idx_tutor_profiles_user_id ON tutor_profiles(user_id);
CREATE INDEX idx_tutor_profiles_status ON tutor_profiles(application_status);
CREATE INDEX idx_tutor_profiles_rating ON tutor_profiles(average_rating DESC);
CREATE INDEX idx_tutor_profiles_featured ON tutor_profiles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_tutor_availability_tutor ON tutor_availability(tutor_id);
CREATE INDEX idx_bookings_student ON bookings(student_id);
CREATE INDEX idx_bookings_tutor ON bookings(tutor_id);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_lessons_student ON lessons(student_id);
CREATE INDEX idx_lessons_tutor ON lessons(tutor_id);
CREATE INDEX idx_lessons_status ON lessons(status);
CREATE INDEX idx_lessons_scheduled ON lessons(scheduled_at);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE is_read = false;
CREATE INDEX idx_favorites_student ON favorites(student_id);
CREATE INDEX idx_reviews_tutor ON reviews(tutor_id);

-- Full-text search on tutor profiles
CREATE INDEX idx_tutor_search ON tutor_profiles USING gin(
    to_tsvector('english', coalesce(headline, '') || ' ' || coalesce(about, '') || ' ' || array_to_string(specializations, ' '))
);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_unavailability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Profiles: everyone can read, owner can update
CREATE POLICY "Profiles visible to all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Tutor profiles: approved ones visible to all
CREATE POLICY "Approved tutors visible" ON tutor_profiles FOR SELECT USING (application_status = 'approved' OR user_id = auth.uid());
CREATE POLICY "Tutors can update own" ON tutor_profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Tutors can insert own" ON tutor_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- Tutor availability: visible to all, editable by owner
CREATE POLICY "Availability visible" ON tutor_availability FOR SELECT USING (true);
CREATE POLICY "Tutors manage own availability" ON tutor_availability FOR ALL USING (
    tutor_id IN (SELECT id FROM tutor_profiles WHERE user_id = auth.uid())
);

-- Bookings: visible to student and tutor
CREATE POLICY "Booking parties can view" ON bookings FOR SELECT USING (
    student_id = auth.uid() OR tutor_id IN (SELECT id FROM tutor_profiles WHERE user_id = auth.uid())
);
CREATE POLICY "Students can create bookings" ON bookings FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Booking parties can update" ON bookings FOR UPDATE USING (
    student_id = auth.uid() OR tutor_id IN (SELECT id FROM tutor_profiles WHERE user_id = auth.uid())
);

-- Lessons: visible to participants
CREATE POLICY "Lesson participants can view" ON lessons FOR SELECT USING (
    student_id = auth.uid() OR tutor_id IN (SELECT id FROM tutor_profiles WHERE user_id = auth.uid())
);

-- Reviews: visible to all, students can create
CREATE POLICY "Reviews visible to all" ON reviews FOR SELECT USING (true);
CREATE POLICY "Students can create reviews" ON reviews FOR INSERT WITH CHECK (student_id = auth.uid());
CREATE POLICY "Review authors can update" ON reviews FOR UPDATE USING (student_id = auth.uid());

-- Messages: visible to conversation participants
CREATE POLICY "Participants can view messages" ON messages FOR SELECT USING (
    conversation_id IN (
        SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
);
CREATE POLICY "Participants can send messages" ON messages FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND conversation_id IN (
        SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
    )
);

-- Wallets: owner only
CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System manages wallets" ON wallets FOR ALL USING (user_id = auth.uid());

-- Transactions: owner only
CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (user_id = auth.uid());

-- Favorites: owner only
CREATE POLICY "Users manage own favorites" ON favorites FOR ALL USING (student_id = auth.uid());

-- Notifications: owner only
CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users update own notifications" ON notifications FOR UPDATE USING (user_id = auth.uid());

-- User languages: visible to all, owner can manage
CREATE POLICY "Languages visible to all" ON user_languages FOR SELECT USING (true);
CREATE POLICY "Users manage own languages" ON user_languages FOR ALL USING (user_id = auth.uid());

-- Student packages: owner only
CREATE POLICY "Students view own packages" ON student_packages FOR SELECT USING (student_id = auth.uid());

-- Conversation participants
CREATE POLICY "Participants can view" ON conversation_participants FOR SELECT USING (user_id = auth.uid());

-- Conversations
CREATE POLICY "Participants can view conversations" ON conversations FOR SELECT USING (
    id IN (SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid())
);

-- Reports: reporter can view own
CREATE POLICY "Users can create reports" ON reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Users can view own reports" ON reports FOR SELECT USING (reporter_id = auth.uid());

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );
    -- Create wallet
    INSERT INTO wallets (user_id) VALUES (new.id);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update tutor rating after review
CREATE OR REPLACE FUNCTION update_tutor_rating()
RETURNS trigger AS $$
BEGIN
    UPDATE tutor_profiles SET
        average_rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE tutor_id = NEW.tutor_id AND is_visible = true),
        total_reviews = (SELECT COUNT(*) FROM reviews WHERE tutor_id = NEW.tutor_id AND is_visible = true),
        updated_at = NOW()
    WHERE id = NEW.tutor_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_tutor_rating();

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_tutor_profiles_updated_at BEFORE UPDATE ON tutor_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SUPABASE STORAGE BUCKETS
-- ============================================
-- Run in Supabase Dashboard → Storage:
-- 1. Create bucket "avatars" (public)
-- 2. Create bucket "documents" (private) — tutor certificates, IDs
-- 3. Create bucket "lesson-attachments" (private)
-- 4. Create bucket "chat-attachments" (private)

-- Storage policies (run in SQL editor):
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-attachments', 'lesson-attachments', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('chat-attachments', 'chat-attachments', false);

CREATE POLICY "Avatar images are public" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload own avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can view own documents" ON storage.objects FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 1.5 Auth Implementation

- Supabase Auth setup: email/password + Google OAuth + magic link
- Middleware: session refresh, locale detection, protected routes redirect
- Auth pages: Login, Register (student), Register (tutor — multi-step form), Forgot Password
- AuthGuard component: wraps protected routes
- Profile creation trigger fires automatically (see SQL above)
- Role-based redirects: student → /dashboard, tutor → /tutor-dashboard, admin → /admin

### 1.6 i18n Setup (next-intl)
- Routing: `/az/...`, `/en/...`, `/ru/...`
- Default locale: `az`
- Translation files: `messages/az.json`, `messages/en.json`, `messages/ru.json`
- Minimum 200 translation keys per language for full coverage
- LanguageSwitcher component in navbar

### 1.7 Gün 1 Gözlənilən Nəticə
- [ ] Next.js proyekt işləyir (localhost:3000)
- [ ] Supabase bağlıdır, DB schema deploy olunub
- [ ] Auth tam işləyir (register, login, logout, Google, magic link)
- [ ] i18n 3 dildə işləyir
- [ ] Middleware: auth redirect + locale detection
- [ ] Supabase types generate olunub
- [ ] shadcn/ui komponentlər quraşdırılıb
- [ ] Bazal layout: Navbar (logo, language switcher, auth buttons)

---

## GÜN 2 — LANDING PAGE + PUBLIC PAGES

### 2.1 Landing Page Komponentləri

**Design konsepti:** Modern, professional, güvən yaradan. Azərbaycanlı istifadəçilər üçün tanış hiss. Birinci baxışda "bu ciddi platformadır" mesajı verməli.

**Hero Section:**
- Böyük başlıq: "İstənilən vaxt, istənilən yerdən dil öyrən" (AZ)
- Alt başlıq: native müəllimlərlə 1-on-1 video dərslər
- CTA button: "Pulsuz sınaq dərsi" + "Müəllimləri gör"
- Background: canlı gradient + abstract shapes/illustration
- Statistika strip: "500+ müəllim · 10,000+ dərs · 4.9 reytinq"

**Features Section:**
- 1-on-1 video dərslər
- Elastik cədvəl (24/7)
- Sertifikatlı müəllimlər
- Uyğun qiymətlər
- Hər səviyyə üçün (A1-C2)
- Dərs materialları daxildir

**How It Works:**
1. Qeydiyyatdan keç
2. Müəllim seç
3. Vaxt rezerv et
4. Dərsə qoşul

**Tutor Showcase:**
- 6 ən yaxşı müəllimin kartları (DB-dən)
- Şəkil, ad, reytinq, dil, qiymət
- "Hamısını gör" butonu

**Pricing Section:**
- Paket kartları (DB-dən `packages` table)
- Populyar paket vurğulanmış
- AZN / USD toggle

**Testimonials:**
- Student rəyləri (karusel)

**FAQ Section:**
- Accordion — 10+ sual/cavab

**CTA Section:**
- "İndi başla" — son CTA

**Footer:**
- Linklər, sosial media, copyright, dil seçimi

### 2.2 Public Pages
- `/about` — Haqqımızda (missiya, komanda)
- `/pricing` — Tam qiymət səhifəsi
- `/how-it-works` — Detallı izah + video
- `/become-tutor` — Müəllim ol (CTA → tutor register)
- `/faq` — Tam FAQ
- `/privacy` — Gizlilik siyasəti
- `/terms` — İstifadə şərtləri
- `/contact` — Əlaqə formu

### 2.3 SEO & Meta
- Hər səhifə üçün dynamic metadata (title, description, og:image)
- JSON-LD structured data (Organization, FAQPage, Course)
- sitemap.xml (dynamic)
- robots.txt
- Open Graph images (auto-generated və ya static)

### 2.4 Gün 2 Gözlənilən Nəticə
- [ ] Landing page tam hazır, responsive (mobile-first)
- [ ] Bütün public pages hazır
- [ ] SEO meta tags, sitemap, robots.txt
- [ ] Animasiyalar (scroll-triggered, hover effects)
- [ ] Footer, Navbar tam işləyir
- [ ] Performance: Lighthouse 90+ (performance, accessibility, SEO)

---

## GÜN 3 — STUDENT DASHBOARD + TUTOR BROWSING

### 3.1 Platform Layout
- Sidebar (desktop): navigation linklər, collapse/expand
- TopBar: search, notifications bell (badge count), avatar dropdown
- MobileNav: bottom tabs (Home, Tutors, Schedule, Messages, Profile)
- Breadcrumbs

### 3.2 Student Dashboard (`/dashboard`)
- Welcome banner (ad + current streak)
- Stats Cards: total lessons, hours, upcoming, balance
- Upcoming Lessons (next 3, with "Join" button if < 5 min)
- Recent Activity feed
- Recommended Tutors (based on learning language)
- Progress Chart (lessons per week, line chart)
- Quick actions: Book lesson, Add balance, Browse tutors

### 3.3 Browse Tutors (`/tutors`)
- Filter sidebar:
  - Dil (multi-select)
  - Qiymət aralığı (range slider)
  - Reytinq (minimum)
  - Mövcudluq (bu gün, sabah, bu həftə)
  - İxtisas (IELTS, Business, Kids, General, etc.)
  - Ölkə
  - İndi onlayn (toggle)
  - Ani rezervasiya (toggle)
- Sort: Reytinq, Qiymət (aşağı→yuxarı), Qiymət (yuxarı→aşağı), Ən yeni, Ən populyar
- TutorCard: avatar, ad, ölkə bayrağı, reytinq (stars + count), qiymət, dillər, ixtisaslar, qısa bio, online status, "Profil" + "Rezerv et" buttons
- TutorGrid: responsive grid (1-2-3 columns)
- Infinite scroll və ya pagination
- Search: tutor adı, ixtisas üzrə axtarış

### 3.4 Tutor Profile (`/tutors/[id]`)
- Header: böyük avatar, ad, ölkə, reytinq, online status
- Video intro (if available)
- About section
- Dillər + səviyyələr
- İxtisaslar (badges)
- Təhsil & Sertifikatlar
- Statistikalar: dərs sayı, tamamlama %, cavab müddəti
- Availability calendar (həftəlik görünüş)
- Reviews section (paginated, average breakdown)
- Booking sidebar/modal:
  - Tarix seç (calendar)
  - Vaxt seç (available slots)
  - Müddət seç (30 / 60 dəq)
  - Qiymət göstər
  - Qeyd yaz (optional)
  - "Rezerv et" button
- Favoritlərə əlavə et (heart icon)
- Mesaj göndər button

### 3.5 Gün 3 Gözlənilən Nəticə
- [ ] Platform layout (sidebar, topbar, mobile nav)
- [ ] Student dashboard tam funksional
- [ ] Tutors browse page with filters + search + sort
- [ ] Tutor profile page tam
- [ ] Favorites functionality
- [ ] React Query hooks: useTutors, useLessons, useFavorites
- [ ] Loading skeletons, empty states, error states

---

## GÜN 4 — TUTOR DASHBOARD + TUTOR ONBOARDING

### 4.1 Tutor Registration (Multi-step form)
- Step 1: Əsas məlumatlar (ad, email, ölkə, şəhər, telefon)
- Step 2: Dillər (nə öyrədir + səviyyələr)
- Step 3: Təhsil & Sertifikatlar (file upload)
- Step 4: Haqqında + İxtisaslar
- Step 5: Video intro (upload və ya record)
- Step 6: Qiymət təyini + cədvəl
- Step 7: Nəzərdən keçir + Göndər
- Göndərdikdən sonra: "Müraciətiniz nəzərdən keçirilir" status page

### 4.2 Tutor Dashboard (`/tutor-dashboard`)
- Stats: bu aydakı dərslər, qazanc, reytinq, yeni tələbələr
- Bu günün dərsləri (timeline view)
- Gözləyən booking-lər (təsdiqlə/rədd et)
- Son rəylər
- Qazanc qrafiki (aylıq)

### 4.3 Tutor Schedule (`/tutor-schedule`)
- Həftəlik cədvəl redaktoru (drag & select time blocks)
- Availability Editor: hər gün üçün iş saatları
- Xüsusi qeyri-iş günləri əlavə et
- Gələn həftənin booking-ləri göstər (overlay)
- Sync with Google Calendar (future feature flag)

### 4.4 Tutor Students (`/tutor-students`)
- Tələbə siyahısı (əlifba sırası, son dərs tarixinə görə)
- Hər tələbə: avatar, ad, dərs sayı, son dərs, qeydlər
- Tələbə profil modali: tarixçə, qeydlər, progress

### 4.5 Tutor Earnings (`/tutor-earnings`)
- Cari balans
- Çıxarış (withdrawal) — bank transfer məlumatları
- Tranzaksiya tarixçəsi
- Aylıq/həftəlik qazanc qrafiki

### 4.6 Tutor Settings (`/tutor-settings`)
- Profil redaktə (bio, video, avatar)
- Qiymət dəyişdir
- Ani booking on/off
- Bildiriş tənzimləmələri
- İş saatlarını dəyişdir

### 4.7 Gün 4 Gözlənilən Nəticə
- [ ] Tutor registration multi-step form tam işləyir
- [ ] Tutor dashboard tam funksional
- [ ] Cədvəl redaktoru işləyir
- [ ] Tələbə siyahısı
- [ ] Qazanc səhifəsi
- [ ] Tutor settings
- [ ] File upload (avatar, certificates) Supabase Storage ilə

---

## GÜN 5 — BOOKING SYSTEM + SCHEDULING

### 5.1 Booking Flow
1. Student tutor profilindən vaxt seçir
2. Müddət seçir (30/60 dəq)
3. Paketdən istifadə və ya tək dərs ödənişi
4. Booking yaranır (status: pending/confirmed)
5. Tutor bildiriş alır (instant booking = auto-confirm)
6. Lesson record yaranır
7. Hər iki tərəf email/notification alır
8. Xatırlatma: 1 saat əvvəl, 15 dəqiqə əvvəl

### 5.2 Availability Engine
- `GET /api/tutors/[id]/availability?date=2026-06-15`
- Tutor-un həftəlik cədvəlini yoxla
- Mövcud booking-ləri çıx
- Unavailability dates çıx
- Timezone conversion (tutor tz → student tz)
- 30 dəqiqəlik slotlar qaytar
- Response: `{ slots: [{ time: "09:00", available: true }, ...] }`

### 5.3 Schedule Pages
**Student Schedule (`/schedule`):**
- Həftəlik calendar view
- Gələn dərslərin siyahısı
- Keçmiş dərslərin siyahısı (with review button)
- Cancel / Reschedule buttons (24 saat əvvəl pulsuz ləğv)

**TimeSlotPicker component:**
- Calendar (date picker)
- Available slots grid (time buttons)
- Selected slot highlight
- Timezone indicator

### 5.4 Cancellation Policy
- 24+ saat əvvəl: pulsuz ləğv
- 12-24 saat: 50% tutulur
- < 12 saat: tam ödəniş tutulur
- No-show: tam ödəniş tutulur
- Policy açıq göstərilir booking zamanı

### 5.5 Notifications System
- In-app notifications (bell icon, dropdown list)
- Realtime: Supabase Realtime subscription
- Types: lesson_reminder, new_booking, cancelled, new_message, payment, review
- Mark as read / Mark all as read

### 5.6 Gün 5 Gözlənilən Nəticə
- [ ] Booking flow start to finish
- [ ] Availability calculation engine
- [ ] Schedule views (student + tutor)
- [ ] TimeSlotPicker component
- [ ] Cancellation with policy enforcement
- [ ] Notifications (in-app, realtime)
- [ ] Email notifications (booking confirmed, reminder, cancelled)

---

## GÜN 6 — VIDEO CALLING (LiveKit)

### 6.1 LiveKit Integration
- Server: `/api/livekit/token` — JWT token generate
  - Input: room_id, participant_name, participant_id
  - Validates: user is participant of this lesson
  - Returns: LiveKit access token
- Room naming: `lesson_${lesson.id}`

### 6.2 Video Room Page (`/room/[roomId]`)
- LiveKit Components React:
  - `<LiveKitRoom>` wrapper
  - `<VideoConference>` layout
  - Custom `<VideoControls>`: mute/unmute, camera on/off, screen share, chat, end call
  - `<ParticipantView>`: video tiles
- Lesson timer (countdown/count-up)
- In-call chat panel (side panel)
- Shared notes panel (collaborative text area, saved to lesson.shared_notes)
- Screen sharing support
- Connection quality indicator

### 6.3 Pre-call Screen
- Camera preview
- Mic test
- Speaker test
- Network quality check
- "Dərsə qoşul" button
- Lesson info (tutor/student name, topic, scheduled time)

### 6.4 Post-call Screen
- Lesson summary
- Duration
- "Rəy yaz" button (student)
- "Qeyd əlavə et" (tutor)
- "Ev tapşırığı ver" (tutor)
- Next lesson suggestion

### 6.5 Lesson Lifecycle
1. 15 dəq əvvəl: "Join" button aktivləşir
2. Room açılır, participants qoşulur
3. lesson.status → 'in_progress', started_at set
4. Timer işləyir
5. Vaxt bitəndə: xəbərdarlıq (5 dəq əvvəl)
6. Call bitir: lesson.status → 'completed', ended_at set
7. actual_duration hesablanır
8. Post-call screen göstərilir
9. Student-ə review notification göndərilir

### 6.6 Gün 6 Gözlənilən Nəticə
- [ ] LiveKit token generation API
- [ ] Video room tam işləyir (1-on-1)
- [ ] Custom controls (mute, camera, screen share, end)
- [ ] Pre-call device check
- [ ] Post-call summary + review
- [ ] In-call chat
- [ ] Shared notes
- [ ] Lesson timer
- [ ] Lesson lifecycle management
- [ ] Mobile responsive video layout

---

## GÜN 7 — MESSAGING SYSTEM

### 7.1 Realtime Chat
- Supabase Realtime subscriptions
- Conversation list (left panel)
- Message view (right panel)
- Message types: text, image, file, audio
- Typing indicator
- Read receipts (last_read_at)
- Online status indicator (green dot)
- Unread count badges

### 7.2 Conversations Page (`/messages`)
- ConversationList:
  - Avatar, name, last message preview, timestamp
  - Unread badge
  - Online status
  - Sort by last message time
- ConversationView:
  - Message bubbles (sent/received styling)
  - Timestamp grouping (today, yesterday, date)
  - Auto-scroll to bottom
  - Load more (older messages, infinite scroll up)
- MessageInput:
  - Text input with send button
  - File attachment button
  - Emoji picker (optional, nice-to-have)
  - Enter to send, Shift+Enter for newline

### 7.3 Direct Message from Tutor Profile
- "Mesaj göndər" button → creates/opens conversation
- Auto-create conversation if not exists

### 7.4 Lesson Chat
- Lesson-specific conversation (conversation.type = 'lesson')
- Accessible from lesson detail page
- Shared between student and tutor for that lesson

### 7.5 Gün 7 Gözlənilən Nəticə
- [ ] Realtime messaging tam işləyir
- [ ] Conversation list + message view
- [ ] File/image attachments
- [ ] Typing indicator
- [ ] Online status
- [ ] Unread counts
- [ ] Message from tutor profile
- [ ] Mobile responsive chat layout (full-screen on mobile)

---

## GÜN 8 — PAYMENT SYSTEM (Stripe)

### 8.1 Stripe Integration
- `/api/stripe/checkout` — Checkout Session yaratmaq
- `/api/stripe/webhook` — Webhook handler (payment events)
- `/api/stripe/portal` — Customer portal redirect

### 8.2 Payment Flows

**Balans artırmaq (Deposit):**
1. Student → Wallet → "Balans artır"
2. Məbləğ seçir (preset: $10, $25, $50, $100 + custom)
3. Stripe Checkout redirect
4. Ödəniş sonrası: wallet.balance += amount, transaction record
5. Success page

**Paket almaq:**
1. Student → Pricing / tutor profile
2. Paket seçir
3. Stripe Checkout redirect (metadata: package_id, student_id)
4. Webhook: student_packages record yaradılır
5. Success page

**Dərs ödənişi (balansdan):**
1. Booking zamanı: wallet.balance >= price yoxla
2. Balans yetərsə: ödəniş alınır (wallet debit)
3. Yetmirsə: "Balans artırın" redirect

**Tutor payout:**
- Dərs bitdikdən sonra: tutor wallet credited (platform commission çıxılmış — 20%)
- Manual withdrawal request → admin approve → bank transfer
- Minimum withdrawal: $50

### 8.3 Wallet Page (`/wallet`)
- Current balance (böyük rəqəm)
- "Balans artır" button
- Transaction history (filterable: all, deposits, payments, refunds)
- Active packages (remaining lessons)

### 8.4 Pricing Page
- Package cards (from DB)
- Currency toggle (USD / AZN) — AZN = USD × rate
- Comparison table
- FAQ section

### 8.5 Gün 8 Gözlənilən Nəticə
- [ ] Stripe Checkout tam işləyir
- [ ] Webhook handler: payment_intent.succeeded, checkout.session.completed
- [ ] Wallet system (deposit, debit, balance check)
- [ ] Package purchase flow
- [ ] Transaction history
- [ ] Tutor earnings + withdrawal request
- [ ] Pricing page
- [ ] Error handling: failed payments, expired sessions

---

## GÜN 9 — ADMIN PANEL

### 9.1 Admin Dashboard (`/admin`)
- Stats: total users, tutors, lessons today, revenue today/month
- Charts: user growth, revenue, lessons per day (line charts)
- Recent registrations
- Pending tutor applications (count + quick link)
- Active lessons right now (live count)

### 9.2 User Management (`/admin/users`)
- Datatable: avatar, name, email, role, status, joined, last active
- Filters: role, status, date range
- Search by name/email
- Actions: view profile, deactivate, change role, send email
- User detail modal: full info, lesson history, transactions

### 9.3 Tutor Management (`/admin/tutors`)
- Pending Applications tab:
  - Application card: full info, documents, video
  - Approve / Reject buttons
  - Rejection reason modal
- All Tutors tab:
  - Datatable similar to users
  - Rating, lessons, earnings columns
  - Feature/unfeature toggle
  - Suspend tutor

### 9.4 Lesson Management (`/admin/lessons`)
- All lessons datatable
- Filters: status, date range, tutor, student
- Lesson detail: participants, duration, recording
- Handle disputes

### 9.5 Payment Management (`/admin/payments`)
- All transactions
- Pending withdrawals (tutor payouts)
- Revenue analytics
- Refund management

### 9.6 Admin Settings (`/admin/settings`)
- Platform commission rate
- Minimum withdrawal amount
- Cancellation policy settings
- Featured tutors selection
- System announcements
- Manage languages & packages

### 9.7 Admin Authorization
- Middleware check: profile.role === 'admin'
- Admin routes protected
- Supabase RLS: admin policies (service_role for admin operations)
- Admin API routes use service_role key

### 9.8 Gün 9 Gözlənilən Nəticə
- [ ] Admin dashboard with stats + charts
- [ ] User management (CRUD)
- [ ] Tutor application review (approve/reject)
- [ ] Lesson management
- [ ] Payment/transaction management
- [ ] Admin settings
- [ ] Role-based authorization

---

## GÜN 10 — POLISH + SEO + TESTING + DEPLOY

### 10.1 Performance Optimization
- Image optimization (next/image, WebP, lazy loading)
- Code splitting (dynamic imports)
- React Query: staleTime, cacheTime configuration
- Supabase query optimization (select only needed columns)
- Bundle analyzer: remove unused dependencies
- Font optimization (next/font)

### 10.2 SEO
- All meta tags verified
- OG images for social sharing
- Structured data (JSON-LD): Organization, Course, FAQ, Review
- sitemap.xml (dynamic, all public pages + tutor profiles)
- robots.txt
- Canonical URLs with locale
- hreflang tags

### 10.3 Accessibility
- Keyboard navigation
- ARIA labels
- Focus management
- Color contrast (WCAG AA)
- Screen reader friendly

### 10.4 Error Handling
- Global ErrorBoundary
- 404 page (custom)
- 500 page (custom)
- API error responses (consistent format)
- Toast notifications for user actions
- Form validation error messages (AZ/EN/RU)

### 10.5 Security Checklist
- [ ] RLS policies tam test olunub
- [ ] API routes auth middleware
- [ ] Rate limiting (Vercel Edge middleware)
- [ ] Input sanitization (Zod everywhere)
- [ ] CSRF protection
- [ ] Secure headers (next.config.js)
- [ ] Environment variables check
- [ ] Stripe webhook signature verification

### 10.6 Testing
- Component tests (key flows): auth, booking, payment
- API route tests: token generation, webhook handling
- E2E critical paths: register → browse tutors → book → join → review
- Mobile responsive check (320px, 375px, 768px, 1024px, 1440px)

### 10.7 Vercel Deploy
```bash
# Production deploy
vercel --prod

# Environment variables (Vercel dashboard-da)
# Bütün .env.local dəyərləri əlavə et

# Domain setup
# vercel domains add nativly.az
# vercel domains add getnativly.com
```

### 10.8 Post-Deploy
- [ ] SSL certificates (auto by Vercel)
- [ ] Custom domain verified
- [ ] Analytics setup (Vercel Analytics + PostHog)
- [ ] Error monitoring (Sentry — optional)
- [ ] Uptime monitoring
- [ ] Stripe webhook URL update to production
- [ ] Supabase auth redirect URLs update
- [ ] Google OAuth redirect URIs update
- [ ] Test full flow on production

### 10.9 Gün 10 Gözlənilən Nəticə
- [ ] Performance: Lighthouse 90+ bütün sahələrdə
- [ ] SEO: tam optimized
- [ ] Accessibility: WCAG AA
- [ ] Security: tam audit
- [ ] Production deploy on Vercel
- [ ] Custom domain active
- [ ] Full flow tested on production
- [ ] Analytics active

---

## CLAUDE CODE ÜÇÜN QAYDALAR

1. **Dil:** Kod, comments, variable adları İngiliscə. UI text-lər i18n vasitəsilə AZ/EN/RU.
2. **Type Safety:** Strict TypeScript. `any` istifadə etmə. Supabase types generate et.
3. **Error Handling:** Hər API call try/catch. User-facing errors toast/sonner ilə göstər.
4. **Loading States:** Hər data fetch üçün skeleton/spinner göstər.
5. **Empty States:** Boş siyahılar üçün gözəl empty state komponentləri.
6. **Responsive:** Mobile-first. Breakpoints: sm(640) md(768) lg(1024) xl(1280).
7. **Components:** Kiçik, təkrar istifadə edilən komponentlər. Props-lar typed.
8. **API Routes:** Input validation (Zod). Auth check. Error responses consistent.
9. **Commits:** Hər gün sonunda working state olmalıdır.
10. **No shortcuts:** Production-ready kod. Placeholder data yox, real data flows.

---

## QEYD: Bu sənəd Claude Code-a veriləcək. Hər gün üçün belə de:

> "Bu gün Gün 1-dir. NATIVLY_BLUEPRINT.md faylını oxu və Gün 1-in bütün tapşırıqlarını yerinə yetir. Gün 1 Gözlənilən Nəticədəki bütün checkbox-lar tamamlanmalıdır."

Növbəti gün üçün:
> "Bu gün Gün 2-dir. NATIVLY_BLUEPRINT.md → Gün 2 bölməsini oxu və tam yerinə yetir."

Bu formada hər gün 1 gün bitir, 10 gündə production-ready platform hazırdır.
