-- Rollback for 0000_init.sql
-- Drop in reverse dependency order.
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS "private-keys";
DROP TABLE IF EXISTS keys;
DROP INDEX IF EXISTS "IDX_identifiers_alias_provider";
DROP TABLE IF EXISTS identifiers;
