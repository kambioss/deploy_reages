-- ================================================================
--  init-db.sql — Initialisation PostgreSQL REAAGES
--  Exécuté automatiquement au 1er démarrage du conteneur
-- ================================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- pour les recherches full-text

-- Schéma dédié
CREATE SCHEMA IF NOT EXISTS reaages;

-- Log de démarrage
DO $$
BEGIN
  RAISE NOTICE 'Base REAAGES initialisée avec succès';
END $$;
