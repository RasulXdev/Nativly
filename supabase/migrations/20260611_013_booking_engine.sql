-- ============================================
-- 013 BOOKING ENGINE
-- Turns a `bookings` row into a real lesson lifecycle:
--   * decrement the student's active subscription on booking
--   * create a `lessons` row when a booking is confirmed
--   * emit in-app notifications for both parties
--   * refund a lesson credit on free (>=24h) cancellation
-- All logic lives in SECURITY DEFINER triggers because, under RLS, a tutor
-- confirming a booking cannot write the student's lesson / subscription rows.
-- ============================================

-- ── Helper: create the lesson + notify the student on confirm ──
CREATE OR REPLACE FUNCTION create_lesson_for_booking(b bookings)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tutor_user_id UUID;
  v_student_name  TEXT;
BEGIN
  -- Idempotent: never create a second lesson for the same booking.
  IF EXISTS (SELECT 1 FROM lessons WHERE booking_id = b.id) THEN
    RETURN;
  END IF;

  INSERT INTO lessons (
    booking_id, student_id, tutor_id, scheduled_at,
    duration_minutes, price, currency, status, room_id
  ) VALUES (
    b.id, b.student_id, b.tutor_id, b.scheduled_at,
    b.duration_minutes, 0, COALESCE(b.currency, 'AZN'), 'scheduled',
    'lesson_' || b.id::text
  );

  -- Notify the student that the lesson is confirmed.
  INSERT INTO notifications (user_id, type, title, body, data)
  VALUES (
    b.student_id, 'new_booking', 'Dərs təsdiqləndi',
    'Dərsiniz təsdiqləndi və cədvəlinizə əlavə olundu.',
    jsonb_build_object('booking_id', b.id, 'scheduled_at', b.scheduled_at)
  );
END;
$$;

-- ── AFTER INSERT: reserve a lesson credit + notify the tutor ──
CREATE OR REPLACE FUNCTION handle_booking_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tutor_user_id UUID;
BEGIN
  -- Reserve one lesson from the student's active subscription (skip trials).
  IF COALESCE(NEW.is_trial, false) = false THEN
    UPDATE user_subscriptions
       SET lessons_remaining = lessons_remaining - 1
     WHERE student_id = NEW.student_id
       AND status = 'active'
       AND lessons_remaining > 0;
  END IF;

  -- Resolve the tutor's auth/profile id (bookings.tutor_id -> tutor_profiles.id).
  SELECT user_id INTO v_tutor_user_id
    FROM tutor_profiles WHERE id = NEW.tutor_id;

  IF v_tutor_user_id IS NOT NULL THEN
    INSERT INTO notifications (user_id, type, title, body, data)
    VALUES (
      v_tutor_user_id, 'new_booking',
      CASE WHEN NEW.status = 'confirmed'
           THEN 'Yeni dərs rezerv edildi'
           ELSE 'Yeni rezervasiya tələbi' END,
      CASE WHEN NEW.status = 'confirmed'
           THEN 'Tələbə dərsi ani rezerv etdi.'
           ELSE 'Yeni rezervasiya tələbiniz var. Təsdiqləyin və ya rədd edin.' END,
      jsonb_build_object('booking_id', NEW.id, 'scheduled_at', NEW.scheduled_at)
    );
  END IF;

  -- Instant booking (already confirmed) -> create the lesson immediately.
  IF NEW.status = 'confirmed' THEN
    PERFORM create_lesson_for_booking(NEW);
  END IF;

  RETURN NEW;
END;
$$;

-- ── AFTER UPDATE OF status: confirm / cancel transitions ──
CREATE OR REPLACE FUNCTION handle_booking_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tutor_user_id UUID;
  v_hours_until   NUMERIC;
BEGIN
  IF NEW.status = OLD.status THEN
    RETURN NEW;
  END IF;

  SELECT user_id INTO v_tutor_user_id
    FROM tutor_profiles WHERE id = NEW.tutor_id;

  -- pending -> confirmed
  IF NEW.status = 'confirmed' AND OLD.status <> 'confirmed' THEN
    PERFORM create_lesson_for_booking(NEW);
  END IF;

  -- anything -> cancelled
  IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    -- Cancel any linked lesson.
    UPDATE lessons
       SET status = 'cancelled'
     WHERE booking_id = NEW.id
       AND status IN ('scheduled', 'in_progress');

    -- Free cancellation (>=24h before start) -> refund one lesson credit.
    v_hours_until := EXTRACT(EPOCH FROM (NEW.scheduled_at - NOW())) / 3600;
    IF COALESCE(NEW.is_trial, false) = false AND v_hours_until >= 24 THEN
      UPDATE user_subscriptions
         SET lessons_remaining = lessons_remaining + 1
       WHERE student_id = NEW.student_id
         AND status = 'active';
    END IF;

    -- Notify the party who did NOT cancel.
    -- Student notification (when tutor/admin cancelled).
    IF NEW.cancelled_by IS DISTINCT FROM NEW.student_id THEN
      INSERT INTO notifications (user_id, type, title, body, data)
      VALUES (
        NEW.student_id, 'lesson_cancelled', 'Dərs ləğv edildi',
        COALESCE(NEW.cancelled_reason, 'Dərsiniz ləğv edildi.'),
        jsonb_build_object('booking_id', NEW.id, 'scheduled_at', NEW.scheduled_at)
      );
    END IF;
    -- Tutor notification (when student cancelled).
    IF v_tutor_user_id IS NOT NULL AND NEW.cancelled_by IS DISTINCT FROM v_tutor_user_id THEN
      INSERT INTO notifications (user_id, type, title, body, data)
      VALUES (
        v_tutor_user_id, 'lesson_cancelled', 'Dərs ləğv edildi',
        'Tələbə dərsi ləğv etdi.',
        jsonb_build_object('booking_id', NEW.id, 'scheduled_at', NEW.scheduled_at)
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_booking_created ON bookings;
CREATE TRIGGER on_booking_created
  AFTER INSERT ON bookings
  FOR EACH ROW EXECUTE FUNCTION handle_booking_created();

DROP TRIGGER IF EXISTS on_booking_status_change ON bookings;
CREATE TRIGGER on_booking_status_change
  AFTER UPDATE OF status ON bookings
  FOR EACH ROW EXECUTE FUNCTION handle_booking_status_change();

-- ── Realtime: make sure notifications stream to clients ──
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'notifications'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
  END IF;
END $$;
