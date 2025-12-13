# BitEater Server

Backend server for BitEater game with SQLite database.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### GET /api/scores
Get all scores for the scoreboard (sorted by total_score DESC)

### GET /api/scores/:walletAddress
Get score for a specific wallet address

### POST /api/scores
Create or update a score
```json
{
  "walletAddress": "0x1234...",
  "score": 150
}
```

### PUT /api/scores/:walletAddress
Update total score for a wallet
```json
{
  "totalScore": 300
}
```

### GET /api/health
Health check endpoint

## Database

The database file `scores.db` will be created automatically in the server directory.

Schema:
- `id`: Primary key
- `wallet_address`: Unique wallet address
- `total_score`: Accumulated total points
- `last_score`: Last quiz score
- `updated_at`: Last update timestamp
- `created_at`: Creation timestamp

