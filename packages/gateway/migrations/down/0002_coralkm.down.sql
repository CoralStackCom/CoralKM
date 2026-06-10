-- Rollback for 0002_coralkm.sql
-- Drop in reverse dependency order (FKs reference the policy/share tables).
DROP TABLE IF EXISTS recovery_requests;
DROP TABLE IF EXISTS guardian_shares;
DROP TABLE IF EXISTS guardian_policies;
DROP TABLE IF EXISTS namespaces;
DROP TABLE IF EXISTS namespace_policies;
