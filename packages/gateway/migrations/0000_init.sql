-- Migration number: 0000

-- Identifiers table
-- Stores DIDs and their metadata
-- Used by the DID store to reference DIDs and their controllers
-- and by the DID Manager to manage DIDs
CREATE TABLE identifiers (
  did             TEXT NOT NULL PRIMARY KEY,
  provider        TEXT NULL,
  alias           TEXT NULL,
  saveDate        TEXT DEFAULT (datetime('now')),
  updateDate      TEXT DEFAULT (datetime('now')),
  controllerKeyId TEXT NULL
) STRICT;

-- Unique composite index (alias + provider must be unique together)
CREATE UNIQUE INDEX "IDX_identifiers_alias_provider" ON identifiers(alias, provider);

-- Keys table
-- Stores public keys and their metadata
-- Used by the DID store to reference keys associated with DIDs
-- and by the Key Manager to manage keys
CREATE TABLE keys (
    kid             TEXT PRIMARY KEY, 
    kms             TEXT NOT NULL,
    -- 'Ed25519' | 'Secp256k1' | 'Secp256r1' | 'X25519' | 'Bls12381G1' | 'Bls12381G2' | (string & {})
    type            TEXT NOT NULL,
    publicKeyHex    TEXT NOT NULL,
    meta            TEXT,
    identifier_id   TEXT NULL,

    FOREIGN KEY (identifier_id) REFERENCES identifiers(did) ON DELETE CASCADE
) STRICT;

-- Private Keys table
-- Stores private keys and their metadata
-- Used by the Key Manager to manage private keys
-- Note: Private keys should be stored securely and encrypted at rest
-- This table assumes that the privateKeyHex is already encrypted if needed
-- The encryption/decryption should be handled by the application layer
CREATE TABLE "private-keys" (
  alias           TEXT NOT NULL PRIMARY KEY,
  type            TEXT NOT NULL,
  privateKeyHex   TEXT NOT NULL
) STRICT;

-- Services table
-- Stores service endpoints and their metadata
-- Used by the DID store to reference services associated with DIDs
CREATE TABLE services (
    id              TEXT PRIMARY KEY, 
    type            TEXT NOT NULL,
    serviceEndpoint TEXT NOT NULL,
    description     TEXT NULL,
    identifier_id   TEXT NULL,

    FOREIGN KEY (identifier_id) REFERENCES identifiers(did) ON DELETE CASCADE
) STRICT;

-- Messages table
-- Stores messages and their metadata
-- Used by the DataStore store to manage messages
CREATE TABLE messages (
  id           TEXT PRIMARY KEY,                     
  saveDate     TEXT DEFAULT (datetime('now')),
  updateDate   TEXT DEFAULT (datetime('now')),
  createdAt    TEXT,
  expiresAt    TEXT,
  threadId     TEXT,
  type         TEXT NOT NULL,
  raw          TEXT,
  -- TypeORM 'simple-json' -> TEXT (store JSON string)
  data         TEXT CHECK (data IS NULL OR json_valid(data)),
  -- TypeORM 'simple-array' -> TEXT (comma-separated)
  replyTo      TEXT,
  replyUrl     TEXT,
  -- Relations to identifiers
  from_id      TEXT REFERENCES identifiers(did) ON DELETE CASCADE,
  to_id        TEXT REFERENCES identifiers(did) ON DELETE CASCADE,
  -- TypeORM 'simple-json' -> TEXT (store JSON string)
  metaData     TEXT CHECK (metaData IS NULL OR json_valid(metaData))
) STRICT;