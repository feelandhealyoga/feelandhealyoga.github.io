-- ═══════════════════════════════════════════════════════════
-- FEEL & HEAL YOGA — TEACHER ATTENDANCE & PMS PORTAL
-- Run this in Supabase SQL Editor to set up the database
-- ═══════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- PROFILES (extends auth.users)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  email       text NOT NULL,
  phone       text,
  role        text NOT NULL CHECK (role IN ('teacher','senior','admin')) DEFAULT 'teacher',
  senior_id   uuid REFERENCES profiles(id),
  avatar_url  text,
  joining_date date DEFAULT CURRENT_DATE,
  batch_ids   text[] DEFAULT '{}',
  status      text DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- BATCHES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS batches (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       text NOT NULL,
  time       text NOT NULL,
  days       text,
  type       text DEFAULT 'morning' CHECK (type IN ('morning','afternoon','evening')),
  is_active  boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Seed default batches
INSERT INTO batches (name, time, days, type) VALUES
  ('Morning Batch', '6:00–7:00 AM', 'Mon, Tue, Thu, Fri', 'morning'),
  ('Morning Batch 2', '8:00–9:00 AM', 'Mon, Tue, Thu, Fri', 'morning'),
  ('Weight Loss', '11:00 AM–12:00 PM', 'Mon, Tue, Thu, Fri', 'afternoon'),
  ('Evening Weight Loss', '5:30–6:30 PM', 'Daily', 'evening'),
  ('Evening Yoga', '7:30–8:30 PM', 'Daily', 'evening'),
  ('Kids Yoga', '6:00–7:00 AM', 'Mon, Thu, Fri', 'morning')
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- ATTENDANCE
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id     uuid NOT NULL REFERENCES profiles(id),
  date           date NOT NULL DEFAULT CURRENT_DATE,
  check_in_time  timestamptz DEFAULT now(),
  status         text NOT NULL DEFAULT 'present' CHECK (status IN ('present','absent','late','leave','half_day','holiday','not_marked')),
  batch_id       uuid REFERENCES batches(id),
  photo_url      text,
  note           text,
  latitude       numeric(9,6),
  longitude      numeric(9,6),
  is_manual      boolean DEFAULT false,
  corrected_by   uuid REFERENCES profiles(id),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now(),
  UNIQUE(teacher_id, date)
);

-- ─────────────────────────────────────────────
-- LEAVE REQUESTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leave_requests (
  id               uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id       uuid NOT NULL REFERENCES profiles(id),
  leave_type       text NOT NULL CHECK (leave_type IN ('full_day','half_day','emergency','sick','other')),
  from_date        date NOT NULL,
  to_date          date NOT NULL,
  reason           text NOT NULL,
  attachment_url   text,
  status           text DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','info_requested')),
  reviewed_by      uuid REFERENCES profiles(id),
  review_comment   text,
  reviewed_at      timestamptz,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- NOTIFICATIONS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id        uuid NOT NULL REFERENCES profiles(id),
  type           text NOT NULL,
  title          text NOT NULL,
  message        text NOT NULL,
  reference_id   uuid,
  read           boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

-- ─────────────────────────────────────────────
-- PERFORMANCE REVIEWS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS performance_reviews (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id          uuid NOT NULL REFERENCES profiles(id),
  reviewer_id         uuid NOT NULL REFERENCES profiles(id),
  month               text NOT NULL,  -- YYYY-MM
  attendance_rating   integer CHECK (attendance_rating BETWEEN 1 AND 5),
  performance_rating  integer CHECK (performance_rating BETWEEN 1 AND 5),
  professionalism     integer CHECK (professionalism BETWEEN 1 AND 5),
  punctuality         integer CHECK (punctuality BETWEEN 1 AND 5),
  student_feedback    numeric(3,1),
  remarks             text,
  goals_next_month    text,
  created_at          timestamptz DEFAULT now(),
  UNIQUE(teacher_id, month)
);

-- ─────────────────────────────────────────────
-- PORTAL SETTINGS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portal_settings (
  id                       uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  key                      text UNIQUE NOT NULL,
  value                    text NOT NULL,
  updated_at               timestamptz DEFAULT now()
);

INSERT INTO portal_settings (key, value) VALUES
  ('attendance_cutoff_time', '07:10'),
  ('late_rule_minutes', '10'),
  ('require_photo', 'true'),
  ('require_location', 'false'),
  ('allow_gallery_upload', 'true'),
  ('attendance_reminder_time', '07:00'),
  ('senior_notification', 'true'),
  ('leave_approval_required', 'true')
ON CONFLICT (key) DO NOTHING;

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance        ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications     ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_settings   ENABLE ROW LEVEL SECURITY;

-- Profiles: everyone can read, own profile update
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_insert_admin" ON profiles FOR INSERT WITH CHECK (true);

-- Attendance: teacher sees own, senior sees assigned, admin sees all
CREATE POLICY "attendance_teacher_own" ON attendance FOR SELECT
  USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('senior','admin')
  ));
CREATE POLICY "attendance_insert_own" ON attendance FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "attendance_update_admin" ON attendance FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('senior','admin'))
  OR teacher_id = auth.uid()
);

-- Leave requests
CREATE POLICY "leave_select" ON leave_requests FOR SELECT
  USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('senior','admin')
  ));
CREATE POLICY "leave_insert_own" ON leave_requests FOR INSERT WITH CHECK (teacher_id = auth.uid());
CREATE POLICY "leave_update" ON leave_requests FOR UPDATE USING (
  teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('senior','admin')
  )
);

-- Notifications: own only
CREATE POLICY "notifications_own" ON notifications FOR ALL USING (user_id = auth.uid());

-- Performance: teacher reads own, senior/admin full
CREATE POLICY "perf_select" ON performance_reviews FOR SELECT
  USING (teacher_id = auth.uid() OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('senior','admin')
  ));
CREATE POLICY "perf_insert_reviewer" ON performance_reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('senior','admin'))
);
CREATE POLICY "perf_update_reviewer" ON performance_reviews FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('senior','admin'))
);

-- Settings: admin only write, all read
CREATE POLICY "settings_read" ON portal_settings FOR SELECT USING (true);
CREATE POLICY "settings_write" ON portal_settings FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- ─────────────────────────────────────────────
-- STORAGE BUCKET FOR ATTENDANCE PHOTOS
-- ─────────────────────────────────────────────
-- Run in Supabase Dashboard > Storage > New Bucket
-- Name: attendance-photos
-- Make it PRIVATE (not public)
-- File size limit: 5MB
-- Allowed MIME: image/jpeg, image/png, image/webp

-- ─────────────────────────────────────────────
-- TRIGGER: auto-update updated_at
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER attendance_updated_at BEFORE UPDATE ON attendance FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER leave_updated_at BEFORE UPDATE ON leave_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
