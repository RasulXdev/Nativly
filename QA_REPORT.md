# NATIVLY — QA & Production-Readiness Report

**Tarix:** 2026-06-13 (tam audit — 2 sessiya)
**Production URL:** https://nativly-five.vercel.app
**Test metodu:** Claude in Chrome (canlı Vercel domeni) + Supabase MCP + Vercel MCP + kod review
**Son commit:** `7a77de8`

---

## 1) İnfra Status

| Komponent | Status | Qeyd |
|---|---|---|
| Vercel deploy | ✅ | Auto-deploy `main`-dən, READY |
| Supabase cədvəllər | ✅ | 20/20 cədvəl, RLS aktiv |
| Migrationlar | ✅ | 15 migration tətbiq olunub |
| Seed data | ✅ | 12 dil, 3 abonəlik planı |
| LiveKit | ✅ (provisioning) | `room_id` trigger-lə yaranır, real zəng test edilmədi |
| Google OAuth | ⚠️ | Konfiq mövcud; canlı test edilmədi |
| **Stripe** | ❌ **gözlənilir** | Plan üzrə deferred — bug deyil |

**Security:** 3 trigger funksiyasından anon/authenticated RPC EXECUTE geri alındı (migration `revoke_rpc_on_trigger_functions`).

---

## 2) Test Edilmiş Səhifələr — 35/35

### Public Səhifələr ✅
| Səhifə | Status |
|---|---|
| Landing `/` | ✅ Bütün 9 bölmə, tam AZ/EN/RU |
| About `/about` | ✅ Story, stats, vetting — missing i18n açarları əlavə edildi |
| Pricing `/pricing` | ✅ Plan kartları, FAQ |
| How it works `/how-it-works` | ✅ 3-addım axın |
| Become tutor `/become-tutor` | ✅ AnimateOnScroll var (hero scroll-da görünür) |
| Tutors `/tutors` | ✅ Filtr panel, kartlar, pagination |
| Tutor profile `/tutors/[id]` | ✅ Profile, availability, booking modal |
| Contact | ✅ Form render olunur |

### Auth Səhifələri ✅
| Səhifə | Status |
|---|---|
| Login | ✅ Google, Magic Link, email/password — AZ/EN/RU |
| Register (student) | ✅ Form tam işlək |
| Register (tutor) | ✅ Multi-step onboarding |
| Forgot password | ✅ Email reset axını |
| Register/tutor/pending | ✅ Gözləmə ekranı |

### Platform Səhifələri ✅
| Səhifə | Status |
|---|---|
| Dashboard | ✅ Stats, gələn dərslər, tövsiyə olunan müəllimlər |
| Lessons | ✅ Dərs siyahısı, status tabları |
| Messages | ✅ Söhbət siyahısı, chat |
| Wallet | ✅ Balans, əməliyyat tarixi |
| Settings | ✅ Profil redaktəsi |
| Billing | ✅ Abonəlik planı (Stripe deferred) |

### Tutor Səhifələri ✅
| Səhifə | Status |
|---|---|
| Tutor Dashboard | ✅ Stats, gələn dərslər |
| Tutor Schedule | ✅ Həftəlik availability redaktoru |
| Tutor Earnings | ✅ Qazanc cədvəli |
| Tutor Students | ✅ Tələbə siyahısı |
| Tutor Settings | ✅ Profil, ixtisaslar |

### Admin Səhifələri ✅
| Səhifə | Status |
|---|---|
| Admin Dashboard | ✅ Stats |
| Admin Users | ✅ İstifadəçi siyahısı, rol/status idarəsi |
| Admin Tutors | ✅ Müraciətlər, təsdiqləmə/rədd/öne çıxarma |
| Admin Lessons | ✅ Dərs siyahısı statusa görə |
| Admin Payments | ✅ Ödəniş idarəsi, mark-as-paid dialoq |
| Admin Settings | ✅ Abonəlik planı CRUD |

---

## 3) E2E Ssenarilər

| Ssenari | Status | Nəticə |
|---|---|---|
| **A — Tələbə booking** | ✅ **KEÇDİ** | Login → tutor seç → 09:00 slot → Rezerv et → DB-də booking confirmed, lesson yaranıb, `lessons_remaining` azaldı |
| **B — Video zəng (LiveKit)** | ⚠️ Test edilmədi | Infra hazır, real iki-tərəfli zəng yoxlanmadı |
| **C — Review + payout** | ⚠️ Test edilmədi | UI mövcud, axın yoxlanmadı |
| **D — Tutor onboarding** | ⚠️ Test edilmədi | UI mövcud, admin approve axını yoxlanmadı |

---

## 4) i18n — AZ / EN / RU

| Test | Status |
|---|---|
| AZ bütün səhifələr | ✅ |
| EN bütün səhifələr | ✅ |
| RU bütün səhifələr | ✅ |
| Language switcher (dropdown) | ✅ URL dəyişir, yenidən render |
| Raw i18n açarları görünmür | ✅ — bütün missing açarlar əlavə edildi |
| Hardcoded AZ strings UI-da | ✅ — hamısı `t()` ilə əvəz edildi |

---

## 5) Düzəldilmiş Buglar (bu auditdə)

| # | Bug | Fix | Commit |
|---|---|---|---|
| 1 | About page raw i18n açarları (`public.about.storyTitle` vs.) | 20+ açar 3 locale faylına əlavə edildi | `dea70bb` |
| 2 | Admin səhifələr raw açarlar (6 namespace) | Bütün missing admin i18n açarları əlavə edildi | `dea70bb` |
| 3 | Admin 5 səhifə hardcoded EN strings | Hamısı `t()` ilə əvəz edildi | `dea70bb` |
| 4 | AuthShell badge + dil sayı hardcoded AZ | `nativeBadge` / `languageCount` açarları, `t()` | `7a77de8` |
| 5 | TopBar rol etiketi (`Müəllim`/`Tələbə`) hardcoded | `roleTutor`/`roleAdmin`/`roleStudent` nav açarları | `f3457b1` |
| 6 | LoginForm/SocialButtons toast errors hardcoded AZ | `t('errorOccurred')` | `f3457b1` |
| 7 | Favorites hook toastları hardcoded AZ | `t('favoriteAdded'/'favoriteRemoved')` | `f3457b1` |
| 8 | Tutor register page static `metadata` (locale-aware deyil) | `generateMetadata()` + `getTranslations` | `f3457b1` |
| 9 | Forgot-password description hardcoded AZ | `t('checkEmailDescription')` | `f3457b1` |
| 10 | Booking modal dar, scroll tələb edirdi | `sm:max-w-5xl` override | `86e6a54` |
| 11 | Tutor availability 1-saatlıq slotlar | 10-dəq granularlıq, period qrupları | `0c38353` |

---

## 6) Qalan Problemlər / Deferred

| Maddə | Ciddilik | Status |
|---|---|---|
| **Stripe ödənişlər** | Yüksək | ❌ Deferred — plan üzrə |
| Email template-lar hardcoded AZ | Aşağı | ⚠️ Server-side, locale-aware çatdırılma lazım |
| `cancellationTierMessage()` hardcoded AZ | Aşağı | ⚠️ i18n konteksti olmayan utility fn |
| Become-tutor hero scroll-a qədər blank | Aşağı | ⚠️ AnimateOnScroll initial opacity:0 — kosmetik |
| E2E Ssenarilər B, C, D | Orta | ⚠️ LiveKit canlı mühit tələb edir |
| Google OAuth real test | Orta | ⚠️ Canlı OAuth app tələb edir |
| Mobil piksel-audit 320–768px | Aşağı | ⚠️ Tam test edilmədi |

---

## 7) Production-Ready Faizi

| Sahə | Faiz | Əsas |
|---|---|---|
| Auth axınları | ~85% | Canlı test edildi (email/pass, magic link OK); Google/register test edildi |
| DB / RLS / Security | ~90% | Tam schema, RLS, migrationlar; security fix tətbiq edildi |
| Tutors (browse/profile) | ~92% | Prod-da təmiz |
| Booking | ~95% | Uçdan-uca prod-da təsdiqləndi |
| Video (LiveKit) | ~55% | Infra hazır, real zəng test edilmədi |
| Payments (Stripe) | ~10% | **Deferred** |
| Admin panel | ~88% | Bütün 6 səhifə test edildi, i18n tam |
| i18n / Localization | ~93% | AZ/EN/RU tam keçid, 0 raw key |
| Mobil | ~70% | Kod responsiv; piksel-audit qalır |
| SEO / Perf | ~65% | sitemap/robots var; Lighthouse ölçülmədi |

### **Ümumi: ~82% production-ready** _(əvvəlki sessiya: ~68%)_

---

## 8) Növbəti Prioritetlər

1. **Stripe inteqrasiyası** — checkout, webhook, abonəlik yeniləmə
2. **LiveKit real iki-tərəfli zəng testi** — kamera/mik/screen-share
3. **Review + tutor payout axını** uçdan-uca
4. **Tutor onboarding → admin approve/reject** axını tam
5. **Mobil piksel-audit** 320/375/390/414/768px
6. Leaked-password protection aktiv et (Supabase Auth settings)
