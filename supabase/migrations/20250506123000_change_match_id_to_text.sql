-- Change match_id column from uuid to text in the matches table
ALTER TABLE "matches" ALTER COLUMN "match_id" TYPE TEXT;

-- Also ensure we have proper indexes on this column for efficient lookup
DROP INDEX IF EXISTS matches_match_id_idx;
CREATE INDEX matches_match_id_idx ON "matches" ("match_id");
