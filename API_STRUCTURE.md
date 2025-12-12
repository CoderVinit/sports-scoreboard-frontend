# Backend API Response Structure

## Live Matches API Response

**Endpoint:** `GET /api/matches/live`

**Response Format:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 3,
      "matchNumber": "3",
      "team1Id": 1,
      "team2Id": 2,
      "matchFormat": "T20",
      "totalOvers": 20,
      "venue": "Eden Gardens",
      "city": "Kolkata",
      "matchDate": "2024-01-25T14:00:00.000Z",
      "tossWinnerId": 1,
      "tossDecision": "bowl",
      "battingFirstId": 2,
      "winnerId": null,
      "status": "live",
      "currentInnings": 1,
      "series": "Team Horizon Premier League",
      "team1": {
        "id": 1,
        "name": "Team Horizon",
        "shortName": "TH",
        "logo": "https://example.com/team-horizon-logo.png"
      },
      "team2": {
        "id": 2,
        "name": "Royal Challengers",
        "shortName": "RC",
        "logo": "https://example.com/rc-logo.png"
      },
      "innings": [
        {
          "id": 5,
          "matchId": 3,
          "battingTeamId": 2,
          "bowlingTeamId": 1,
          "inningsNumber": 1,
          "totalRuns": 78,
          "totalWickets": 2,
          "totalOvers": "10.3",
          "extras": 5,
          "runRate": "7.43",
          "status": "in_progress"
        }
      ]
    }
  ]
}
```

## Key Points for Frontend Integration

### 1. Response Wrapper
- All responses wrapped in `{ success, count, data }` format
- Use `response.data` instead of `response.matches`
- Fallback: `response.data || response.matches || []`

### 2. Team References
- Teams are `team1` and `team2` (lowercase)
- Team names: `match.team1.name` or `match.team1.shortName`
- IDs: `match.team1Id`, `match.team2Id`

### 3. Match Format
- Use `matchFormat` instead of `matchType`
- Values: "T20", "ODI", "Test"
- Total overs in `totalOvers` field

### 4. Score Information
- Scores are in `innings` array, not directly on match object
- Current innings: `match.innings[0]` (first innings) or `match.innings[1]` (second innings)
- Runs: `innings[0].totalRuns`
- Wickets: `innings[0].totalWickets`
- Overs: `innings[0].totalOvers`
- Determine which team's score by checking: `innings[0].battingTeamId === match.team1Id`

### 5. Date Fields
- Use `matchDate` instead of `date`
- Format: ISO 8601 string
- Display: `new Date(match.matchDate).toLocaleDateString()`

### 6. Match Status
- Values: "live", "upcoming", "completed"
- Current innings number: `match.currentInnings` (1 or 2)

## Frontend Code Patterns

### Fetching Matches
```javascript
const response = await matchService.getLiveMatches();
const matches = response.data || response.matches || [];
```

### Displaying Team Names
```javascript
{match.team1?.name || match.team1?.shortName}
{match.team2?.name || match.team2?.shortName}
```

### Displaying Scores
```javascript
// Team 1 Score
{match.innings?.[0]?.battingTeamId === match.team1Id ? 
  `${match.innings[0]?.totalRuns || 0}/${match.innings[0]?.totalWickets || 0}` :
  match.innings?.[1]?.totalRuns ? 
    `${match.innings[1]?.totalRuns || 0}/${match.innings[1]?.totalWickets || 0}` : 
    '0/0'
}

// Team 2 Score
{match.innings?.[0]?.battingTeamId === match.team2Id ? 
  `${match.innings[0]?.totalRuns || 0}/${match.innings[0]?.totalWickets || 0}` :
  match.innings?.[1]?.totalRuns ? 
    `${match.innings[1]?.totalRuns || 0}/${match.innings[1]?.totalWickets || 0}` : 
    'Yet to bat'
}
```

### Match Format Display
```javascript
{match.matchFormat || match.matchType}
```

### Overs Display
```javascript
{match.innings?.[0]?.totalOvers || '0.0'}/{match.totalOvers}
```

## Updated Files

All pages have been updated to use this structure:

1. ✅ HomePage.jsx
2. ✅ HomePageStatic.jsx
3. ✅ LiveScoreboard.jsx
4. ✅ LiveScoreboardNew.jsx
5. ✅ AdminMatchesStatic.jsx
6. ✅ AdminDashboardStatic.jsx
7. ✅ MatchDetails.jsx (already compatible)
8. ✅ MatchDetailsStatic.jsx (already compatible)

## Testing

Start backend: `cd sports-scoreboard-backend && npm start`
Start frontend: `cd client && npm run dev`

Login with:
- Username: `admin`
- Password: `admin123`

Check that all pages display data correctly from the API.
