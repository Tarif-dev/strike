# Match Initialization from API

This module provides functionality for initializing cricket match pools using Cricbuzz API data. The feature allows administrators to fetch live cricket match data and create corresponding match pools both in the database and on the blockchain.

## API Integration

The feature uses the Cricbuzz API via RapidAPI. For production use, update the API key in the configuration:

```typescript
const options = {
  method: 'GET',
  url: 'https://cricbuzz-cricket.p.rapidapi.com/matches/v1/upcoming',
  headers: {
    'x-rapidapi-key': 'YOUR_PRODUCTION_API_KEY',
    'x-rapidapi-host': 'cricbuzz-cricket.p.rapidapi.com'
  }
};
```

For security, consider moving the API key to environment variables.

## Components

### AdminMatchCard

The `AdminMatchCard` component displays match information from the API and provides an "Initialize Pool" button for admins. Key features:

- Displays match details including teams, venue, date/time
- Handles team logo fallbacks gracefully
- Provides initialization status feedback
- Prevents duplicate initializations
- Handles both database and blockchain operations

### InitializeMatches

The `InitializeMatches` admin page fetches and displays matches from the Cricbuzz API. Key features:

- Fetches match data from the Cricbuzz API
- Transforms API data to the application's format
- Provides filtering by match type (IPL, T20, ODI)
- Tracks already initialized matches
- Provides refresh functionality
- Shows initialization status

## Usage

1. Navigate to the Admin Dashboard
2. Click "Initialize API Matches" button
3. Browse available matches
4. Click "Initialize Pool" on a match card to create the match pool
5. Monitor the initialization process until completion

## Blockchain Integration

The initialization process:

1. Stores match data in the Supabase database
2. Creates a match pool on the Solana blockchain
3. Associates the match with a token account for prize distribution
4. Verifies all transactions for consistency

## Error Handling

- Validates all API data before processing
- Handles connection and transaction errors gracefully
- Provides helpful error messages to administrators
- Prevents duplicate initializations

## Future Enhancements

- Batch initialization of multiple matches
- Enhanced filtering and search capabilities
- Manual override options for API data
- Automatic synchronization with score updates
