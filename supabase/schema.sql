-- ═══════════════════════════════════════════════════════════════
-- SOC Browser Shield — Complete Database Schema
-- Run this in your Supabase SQL Editor (Dashboard → SQL → New Query)
-- ═══════════════════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- USER ROLES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_roles (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('admin', 'member')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ─────────────────────────────────────────────
-- EXTENSION TOKENS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.extension_tokens (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  extension_id TEXT NOT NULL UNIQUE,
  token_hash   TEXT NOT NULL,
  label        TEXT,
  issued_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ,
  revoked      BOOLEAN NOT NULL DEFAULT FALSE,
  revoked_at   TIMESTAMPTZ
);

-- ─────────────────────────────────────────────
-- GLOBAL BLOCKLIST
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.global_blocklist (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_type      TEXT NOT NULL CHECK (entry_type IN ('domain','ip','cidr','asn')),
  value           TEXT NOT NULL,
  threat_category TEXT NOT NULL CHECK (threat_category IN (
                    'malware','phishing','c2','spam','tor_exit',
                    'botnet','cryptomining','custom')),
  severity        SMALLINT NOT NULL DEFAULT 80 CHECK (severity BETWEEN 0 AND 100),
  source          TEXT NOT NULL DEFAULT 'manual',
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by      UUID REFERENCES auth.users(id),
  expires_at      TIMESTAMPTZ,
  UNIQUE(entry_type, value)
);

CREATE INDEX IF NOT EXISTS idx_global_bl_value  ON public.global_blocklist(value) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_global_bl_expiry ON public.global_blocklist(expires_at) WHERE expires_at IS NOT NULL;

-- ─────────────────────────────────────────────
-- GLOBAL ALLOWLIST
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.global_allowlist (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('domain','ip','cidr')),
  value      TEXT NOT NULL,
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(entry_type, value)
);

-- ─────────────────────────────────────────────
-- USER BLOCKLIST
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_blocklist (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type      TEXT NOT NULL CHECK (entry_type IN ('domain','ip','cidr')),
  value           TEXT NOT NULL,
  threat_category TEXT NOT NULL DEFAULT 'custom',
  notes           TEXT,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, entry_type, value)
);

CREATE INDEX IF NOT EXISTS idx_user_bl_user  ON public.user_blocklist(user_id) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_bl_value ON public.user_blocklist(value) WHERE is_active = TRUE;

-- ─────────────────────────────────────────────
-- USER ALLOWLIST
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_allowlist (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('domain','ip','cidr')),
  value      TEXT NOT NULL,
  reason     TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, entry_type, value)
);

-- ─────────────────────────────────────────────
-- INCIDENTS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.incidents (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  extension_id    TEXT NOT NULL,
  decision        TEXT NOT NULL CHECK (decision IN ('blocked','allowed','suspicious')),
  threat_category TEXT,
  threat_score    SMALLINT,
  domain_hash     TEXT NOT NULL,
  tld             TEXT,
  country_code    CHAR(2),
  asn             TEXT,
  source          TEXT NOT NULL,
  response_ms     SMALLINT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_incidents_user ON public.incidents(user_id);
CREATE INDEX IF NOT EXISTS idx_incidents_time ON public.incidents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_incidents_dec  ON public.incidents(decision);

-- ─────────────────────────────────────────────
-- AUDIT LOG (immutable)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (
  id          BIGSERIAL PRIMARY KEY,
  actor_id    UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  target_type TEXT,
  target_id   TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drop rules before creating them to avoid errors if they already exist
DROP RULE IF EXISTS no_update_audit ON public.audit_log;
CREATE RULE no_update_audit AS ON UPDATE TO public.audit_log DO INSTEAD NOTHING;
DROP RULE IF EXISTS no_delete_audit ON public.audit_log;
CREATE RULE no_delete_audit AS ON DELETE TO public.audit_log DO INSTEAD NOTHING;

-- ─────────────────────────────────────────────
-- QUOTA TRACKER
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.api_quota (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_name   TEXT NOT NULL DEFAULT 'abuseipdb',
  date       DATE NOT NULL DEFAULT CURRENT_DATE,
  used       INT NOT NULL DEFAULT 0,
  limit_val  INT NOT NULL DEFAULT 1000,
  UNIQUE(api_name, date)
);

-- ─────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────────
ALTER TABLE public.user_roles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.extension_tokens  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_blocklist  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_allowlist  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_blocklist    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_allowlist    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log         ENABLE ROW LEVEL SECURITY;

-- Helper function for RLS
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_roles WHERE user_id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Global blocklist policies
DROP POLICY IF EXISTS "admin_all_global_bl" ON public.global_blocklist;
CREATE POLICY "admin_all_global_bl"   ON public.global_blocklist FOR ALL    USING (public.current_user_role() = 'admin');
DROP POLICY IF EXISTS "member_read_global_bl" ON public.global_blocklist;
CREATE POLICY "member_read_global_bl" ON public.global_blocklist FOR SELECT USING (public.current_user_role() IN ('admin','member'));

-- Global allowlist policies
DROP POLICY IF EXISTS "admin_all_global_al" ON public.global_allowlist;
CREATE POLICY "admin_all_global_al"   ON public.global_allowlist FOR ALL    USING (public.current_user_role() = 'admin');
DROP POLICY IF EXISTS "member_read_global_al" ON public.global_allowlist;
CREATE POLICY "member_read_global_al" ON public.global_allowlist FOR SELECT USING (public.current_user_role() IN ('admin','member'));

-- User blocklist policies
DROP POLICY IF EXISTS "user_own_blocklist" ON public.user_blocklist;
CREATE POLICY "user_own_blocklist" ON public.user_blocklist FOR ALL USING (user_id = auth.uid());

-- User allowlist policies
DROP POLICY IF EXISTS "user_own_allowlist" ON public.user_allowlist;
CREATE POLICY "user_own_allowlist" ON public.user_allowlist FOR ALL USING (user_id = auth.uid());

-- Extension tokens policies
DROP POLICY IF EXISTS "user_own_tokens" ON public.extension_tokens;
CREATE POLICY "user_own_tokens" ON public.extension_tokens FOR ALL USING (user_id = auth.uid());

-- Incidents policies
DROP POLICY IF EXISTS "user_own_incidents" ON public.incidents;
CREATE POLICY "user_own_incidents" ON public.incidents FOR SELECT USING (user_id = auth.uid());

-- Audit log policies
DROP POLICY IF EXISTS "admin_read_audit" ON public.audit_log;
CREATE POLICY "admin_read_audit" ON public.audit_log FOR SELECT USING (public.current_user_role() = 'admin');

-- ─────────────────────────────────────────────
-- AUTO-ASSIGN MEMBER ROLE ON SIGNUP
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'member');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─────────────────────────────────────────────
-- HELPER FUNCTIONS
-- ─────────────────────────────────────────────

-- Atomically increment API quota usage
CREATE OR REPLACE FUNCTION public.increment_api_quota(name_param TEXT, date_param DATE)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.api_quota (api_name, date, used)
  VALUES (name_param, date_param, 1)
  ON CONFLICT (api_name, date)
  DO UPDATE SET used = public.api_quota.used + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─────────────────────────────────────────────
-- USER PREFERENCES
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id            UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  anonymized_logging BOOLEAN NOT NULL DEFAULT TRUE,
  auto_cleanup_days  SMALLINT NOT NULL DEFAULT 90,
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_own_preferences" ON public.user_preferences;
CREATE POLICY "user_own_preferences" ON public.user_preferences FOR ALL USING (user_id = auth.uid());

-- Auto-initialize preferences on user creation
CREATE OR REPLACE FUNCTION public.handle_new_user_prefs()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_prefs ON auth.users;
CREATE TRIGGER on_auth_user_created_prefs
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_prefs();
