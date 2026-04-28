-- Rogue Geometric Universe - Persistence v1
-- Schema canônico: metadata leve no Postgres, payload pesado no Vercel Blob.
-- Princípios:
--   * UI nunca consulta o banco diretamente. UI lê de Repository (cache em memória).
--   * Repository sincroniza com /api/*, que fala com Neon + Blob.
--   * Hot path (renderFrame, simulation tick) NUNCA toca este banco.
--   * Mutações fazem flush diferido (idle + debounce >= 400ms).
--
-- Idempotente: pode rodar múltiplas vezes.

-- =============================================================================
-- created_mobs
--   Mobs criados pelo Character Forge. Metadata (id, dnaCode, label, hash...)
--   fica aqui. O package completo (.rogue-mob.json) vive no Blob via blob_key.
-- =============================================================================
CREATE TABLE IF NOT EXISTS created_mobs (
  id              TEXT PRIMARY KEY,
  dna_code        TEXT UNIQUE NOT NULL,
  label           TEXT NOT NULL,
  kind            TEXT NOT NULL,           -- 'enemy' | 'ally' | 'neutral'
  attack_id       TEXT,
  behavior_id     TEXT,
  hash            TEXT NOT NULL,           -- fnv1a do package serializado
  schema_version  INTEGER NOT NULL DEFAULT 1,
  blob_key        TEXT NOT NULL,           -- chave no Vercel Blob (.rogue-mob.json)
  blob_url        TEXT NOT NULL,           -- URL pública do Blob
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS created_mobs_updated_idx
  ON created_mobs(updated_at DESC);

CREATE INDEX IF NOT EXISTS created_mobs_kind_idx
  ON created_mobs(kind);

-- =============================================================================
-- archetypes
--   Arquétipos da biblioteca de Characters. Body é pequeno o suficiente para
--   viver inline em jsonb (sem Blob), facilita filtros.
-- =============================================================================
CREATE TABLE IF NOT EXISTS archetypes (
  id          TEXT PRIMARY KEY,
  label       TEXT NOT NULL,
  kind        TEXT NOT NULL,
  body_json   JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS archetypes_kind_idx
  ON archetypes(kind);

-- =============================================================================
-- runtime_artifacts
--   "Bake" do mundo do Studio empacotado para o Runtime. O worldJson cru pode
--   ficar grande (centenas de KB), então vai inteiro para o Blob.
-- =============================================================================
CREATE TABLE IF NOT EXISTS runtime_artifacts (
  id          TEXT PRIMARY KEY,
  source      TEXT NOT NULL,               -- 'studio' | 'character-studio' | etc
  label       TEXT NOT NULL,
  signature   TEXT NOT NULL,               -- canonicalGeometrySignature
  blob_key    TEXT NOT NULL,
  blob_url    TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS runtime_artifacts_updated_idx
  ON runtime_artifacts(updated_at DESC);

-- =============================================================================
-- replay_records
--   Sessões gravadas para replay determinístico. Frame stream vai no Blob.
-- =============================================================================
CREATE TABLE IF NOT EXISTS replay_records (
  id          TEXT PRIMARY KEY,
  source      TEXT NOT NULL,
  label       TEXT NOT NULL,
  blob_key    TEXT NOT NULL,
  blob_url    TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS replay_records_created_idx
  ON replay_records(created_at DESC);

-- =============================================================================
-- settings
--   KV tipado para preferências de UI, theme, harnessViews etc.
--   Substitui localStorage para configs.
-- =============================================================================
CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value_json  JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- universe_seeds
--   Seeds + deltas determinísticos para reproduzir o universo procedural.
--   Mantém "deltas-only" em vez do mundo inteiro serializado.
-- =============================================================================
CREATE TABLE IF NOT EXISTS universe_seeds (
  id          TEXT PRIMARY KEY,
  seed        BIGINT NOT NULL,
  deltas_json JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================================
-- Trigger genérico de updated_at (idempotente)
-- =============================================================================
CREATE OR REPLACE FUNCTION touch_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t TEXT;
BEGIN
  FOR t IN
    SELECT unnest(ARRAY[
      'created_mobs',
      'archetypes',
      'runtime_artifacts',
      'settings',
      'universe_seeds'
    ])
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS %I_touch_updated ON %I;',
      t, t
    );
    EXECUTE format(
      'CREATE TRIGGER %I_touch_updated BEFORE UPDATE ON %I
         FOR EACH ROW EXECUTE FUNCTION touch_updated_at();',
      t, t
    );
  END LOOP;
END $$;
