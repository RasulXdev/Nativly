# Nativly — Qalan TODO (18%)

Son yenilənmə: 2026-06-13
Hazırkı vəziyyət: ~82% production-ready

---

## 🔴 Yüksək prioritet

### 1. Stripe inteqrasiyası
- [ ] Stripe dashboard-da product + price yaratmaq (Basic, Standard, Premium)
- [ ] `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` env var-larını Vercel-ə əlavə etmək
- [ ] `/api/stripe/checkout` — checkout session test etmək (hazır var, test edilməyib)
- [ ] `/api/stripe/webhook` — `checkout.session.completed` → `user_subscriptions` yenilənməsini test etmək
- [ ] `/api/stripe/portal` — abonəlik idarəsi portalını test etmək
- [ ] Billing səhifəsini (`/billing`) real Stripe ilə uçdan-uca test etmək
- [ ] Subscription expiry / renewal axınını test etmək

### 2. LiveKit canlı video zəng
- [ ] İki tərəfli real video zəng test etmək (2 brauzer / 2 hesab)
- [ ] Kamera + mikrofon icazəsi flow-unu test etmək
- [ ] Screen share test etmək
- [ ] Zəng bitdikdə `lesson.status = completed` yenilənməsini yoxlamaq
- [ ] Zəng keyfiyyəti: gecikməni ölçmək (LiveKit dashboard → Room Analytics)

---

## 🟡 Orta prioritet

### 3. Tutor onboarding → Admin approve/reject axını
- [ ] Yeni tutor qeydiyyatdan keçir → `application_status = pending` görünür
- [ ] Admin `/admin/tutors` → "Təsdiqlə" / "Rədd et" düymələrini test etmək
- [ ] Təsdiq sonrası tutor profilə daxil ola bilir — yoxlamaq
- [ ] Rədd edilmiş tutora bildiriş gedir — yoxlamaq
- [ ] Email notification (approve/reject) işlədiyini yoxlamaq

### 4. Review + Tutor payout axını
- [ ] Dərs tamamlandıqdan sonra tələbə review yaza bilir — test etmək
- [ ] Tutor earnings səhifəsində qazanc görünür — yoxlamaq
- [ ] Admin `/admin/payments` → "Mark as paid" → tutor wallet yenilənir — test etmək
- [ ] Payout sonrası tutor wallet balansı azalır — yoxlamaq

### 5. Mobil piksel-audit
- [ ] 320px (küçük telefon) — hər səhifə keçid edir
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 14)
- [ ] 414px (Android standart)
- [ ] 768px (tablet)
- [ ] Xüsusi diqqət: booking modal, tutor card grid, nav menu, auth forms

---

## 🟢 Aşağı prioritet

### 6. Email template-lar
- [ ] Bütün Supabase Auth email-ləri (confirm, reset, magic link) AZ/EN/RU-da yoxlamaq
- [ ] Email template-ları `cancellationTierMessage()` kimi hardcoded AZ stringlərini i18n etmək

### 7. Google OAuth canlı test
- [ ] Google OAuth ilə qeydiyyat + login uçdan-uca test etmək
- [ ] Callback URL Vercel production domeninə uyğundur — yoxlamaq

### 8. Security
- [ ] Supabase Auth → "Leaked password protection" aktiv etmək
- [ ] Rate limiting: login endpoint — yoxlamaq
- [ ] Supabase Auth → `OTP expiry`, `Session timeout` konfiquratsiya etmək

### 9. Performance / SEO
- [ ] Lighthouse audit: Performance, Accessibility, SEO skorları
- [ ] Core Web Vitals: LCP, CLS, FID ölçmək
- [ ] Image optimization: `next/image` istifadəsi hər yerdə — yoxlamaq

---

## Tamamlanan (✅ bu sessiyalarda)

- ✅ Bütün 35 səhifə test edildi
- ✅ AZ/EN/RU i18n — 0 raw key, 0 hardcoded string
- ✅ RLS + security trigger-lar
- ✅ Booking uçdan-uca (student → slot → lesson yaranır)
- ✅ Tutor schedule: 10-dəq granularlıq, split dropdown, buffer time
- ✅ Tələbə booking: timezone-aware slot display
- ✅ Admin panel: 6 səhifə tam işlək
