-- ============================================
-- 012 SUBSCRIPTION MODEL
-- Tutors no longer set their own prices. Pricing is driven by platform
-- subscription plans (Basic/Standard/Premium). Tutors are paid a fixed
-- payout per completed lesson, settled by admin via tutor_payouts.
-- Replaces the old per-package model (packages / student_packages).
-- ============================================

-- ============================================
-- SUBSCRIPTION PLANS
-- ============================================
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_az TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    description_az TEXT,
    description_en TEXT,
    description_ru TEXT,
    lessons_per_month INT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 30,
    price_azn DECIMAL(10,2) NOT NULL,
    tutor_payout_per_lesson DECIMAL(10,2) NOT NULL,
    stripe_price_id TEXT,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO subscription_plans (name_az, name_en, name_ru, lessons_per_month, duration_minutes, price_azn, tutor_payout_per_lesson, is_popular, sort_order) VALUES
('Basic', 'Basic', 'Базовый', 4, 30, 15.00, 2.50, false, 1),
('Standard', 'Standard', 'Стандартный', 8, 30, 35.00, 3.50, true, 2),
('Premium', 'Premium', 'Премиум', 16, 30, 60.00, 3.00, false, 3);

-- ============================================
-- USER SUBSCRIPTIONS
-- ============================================
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status TEXT NOT NULL DEFAULT 'active',
    lessons_remaining INT NOT NULL,
    lessons_total INT NOT NULL,
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TUTOR PAYOUTS
-- ============================================
CREATE TABLE tutor_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tutor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    lesson_id UUID REFERENCES lessons(id),
    amount_azn DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    admin_note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_subscriptions_student ON user_subscriptions(student_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_tutor_payouts_tutor ON tutor_payouts(tutor_id);
CREATE INDEX idx_tutor_payouts_status ON tutor_payouts(status);

CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- RLS
-- ============================================
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_payouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plans visible to all" ON subscription_plans FOR SELECT USING (true);

CREATE POLICY "Students view own subscriptions" ON user_subscriptions FOR SELECT USING (student_id = auth.uid());
CREATE POLICY "Students manage own subscriptions" ON user_subscriptions FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Tutors view own payouts" ON tutor_payouts FOR SELECT USING (tutor_id = auth.uid());

-- ============================================
-- DROP OLD PACKAGE-BASED MODEL
-- ============================================
DROP TABLE IF EXISTS student_packages CASCADE;
DROP TABLE IF EXISTS packages CASCADE;

-- ============================================
-- REMOVE TUTOR-SET PRICING (managed by platform now)
-- ============================================
ALTER TABLE tutor_profiles DROP COLUMN IF EXISTS hourly_rate;
ALTER TABLE tutor_profiles DROP COLUMN IF EXISTS trial_rate;
ALTER TABLE tutor_profiles DROP COLUMN IF EXISTS currency;
