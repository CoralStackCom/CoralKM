-- Migration number: 0002

-- Namespace Policies Table
-- Stores namespace request status for requestor DIDs
CREATE TABLE namespace_policies (
  requester_did     TEXT PRIMARY KEY,
  status            TEXT NOT NULL CHECK (status IN ('GRANTED', 'DENIED'))
)STRICT;

-- Namespaces table
-- Stores active namespaces and their associated data
CREATE TABLE namespaces (
  id                TEXT PRIMARY KEY,
  owner_did         TEXT NOT NULL,
  createdAt         TEXT DEFAULT (datetime('now')),
  syncedAt          TEXT DEFAULT NULL,
  data              TEXT DEFAULT NULL,
  FOREIGN KEY (owner_did) REFERENCES namespace_policies(requester_did) ON DELETE CASCADE
)STRICT;

-- Guardian Policies Table
-- Stores guardian request status for requestor DIDs
CREATE TABLE guardian_policies (
  requester_did     TEXT PRIMARY KEY,
  status            TEXT NOT NULL CHECK (status IN ('GRANTED', 'DENIED'))
)STRICT;

-- Guardian Shares Table
-- Stores guardian shares for namespaces
CREATE TABLE guardian_shares (
  owner_did         TEXT PRIMARY KEY,
  createdAt         TEXT DEFAULT (datetime('now')),
  updatedAt         TEXT DEFAULT (datetime('now')),
  namespace_id      TEXT NOT NULL,
  namespace_gateway TEXT NOT NULL,
  threshold         INTEGER NOT NULL,
  share             TEXT,
  UNIQUE(namespace_id, namespace_gateway),
  FOREIGN KEY (owner_did) REFERENCES guardian_policies(requester_did) ON DELETE CASCADE
)STRICT;

-- Recovery Requests Table
-- Stores recovery requests made to guardians
CREATE TABLE recovery_requests (
  id                TEXT PRIMARY KEY,
  device_did        TEXT NOT NULL,
  namespace_id      TEXT NOT NULL,
  namespace_gateway TEXT NOT NULL,
  createdAt         TEXT DEFAULT (datetime('now')),
  expiresAt         TEXT NOT NULL,
  FOREIGN KEY (namespace_id, namespace_gateway) REFERENCES guardian_shares(namespace_id, namespace_gateway) ON DELETE CASCADE
)STRICT;