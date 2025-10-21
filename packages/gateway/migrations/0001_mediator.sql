-- Migration number: 0001

-- Mediation table
-- Stores mediation status for requestor DIDs
CREATE TABLE mediation_policies (
  requester_did   TEXT PRIMARY KEY,
  status          TEXT NOT NULL CHECK (status IN ('GRANTED', 'DENIED'))
)STRICT;

-- Mediations table
-- Stores active mediations between recipient DIDs and requester DIDs
CREATE TABLE mediations (
  recipient_did   TEXT PRIMARY KEY,
  requester_did   TEXT NOT NULL,
  FOREIGN KEY (requester_did) REFERENCES mediation_policies(requester_did) ON DELETE CASCADE
)STRICT;