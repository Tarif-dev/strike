# Match ID Handling in Strike App

## Database Structure

In the Strike application, match data is stored in the Supabase database with the following considerations:

### Database Schema

- The `matches` table has a `match_id` column that is defined as a UUID data type.
- Original match IDs from the Cricbuzz API are stored in the `match_details` JSON field.

## UUID Handling

Because the Supabase database schema expects UUIDs for the `match_id` column, but the Cricbuzz API returns numerical IDs (like "115336"), we handle this mismatch as follows:

1. When initializing a match, we:
   - Generate a new UUID using `crypto.randomUUID()`
   - Use this UUID as the `match_id` in the database
   - Store the original Cricbuzz API match ID in the `match_details` JSON object

2. When checking if a match is already initialized, we:
   - Query the `match_details` field to get the original match IDs
   - Compare these IDs with the ones from the API to determine which matches are already initialized

## Implementation Notes

This approach allows us to:
- Maintain compatibility with the existing database schema
- Preserve the original API match IDs for reference
- Correctly track which matches have been initialized

## Future Improvements

If possible, an alternative approach would be to alter the database schema:

```sql
-- This would change match_id column from uuid to text
ALTER TABLE "matches" ALTER COLUMN "match_id" TYPE TEXT;
```

This would allow storing the original API match IDs directly in the `match_id` column, simplifying the code.
