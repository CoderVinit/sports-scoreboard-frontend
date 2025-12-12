# API Integration Guide

## Overview
This document provides a complete guide for the frontend-backend API integration in the Cricket Scoreboard application.

## API Configuration

### Base URL
- Development: `http://localhost:5000/api`
- Production: Configure via environment variables

### Axios Client Setup
Location: `/src/api/client.js`

The API client is configured with:
- Request interceptors for adding JWT tokens
- Response interceptors for global error handling
- Automatic token refresh on 401 errors
- 10-second timeout

## API Services

### Authentication Service
**File:** `/src/api/services/authService.js`

#### Methods:
- `register(userData)` - Register new user
- `login(credentials)` - Login user and store token
- `logout()` - Logout user and clear token
- `getProfile(userId)` - Get user profile
- `updateProfile(userId, userData)` - Update user profile

#### Usage Example:
```javascript
import { authService } from '../api/services';

// Login
const response = await authService.login({
  username: 'admin',
  password: 'admin123'
});
// Token is automatically stored in localStorage

// Get profile
const profile = await authService.getProfile(userId);
```

### Match Service
**File:** `/src/api/services/matchService.js`

#### Methods:
- `getAllMatches()` - Get all matches
- `getLiveMatches()` - Get live matches only
- `getUpcomingMatches()` - Get upcoming matches (limit 10)
- `getMatchDetails(matchId)` - Get match details
- `getMatchStatistics(matchId)` - Get batting/bowling stats and partnerships
- `getMatchCommentary(matchId)` - Get ball-by-ball commentary
- `getLiveScorecard(matchId)` - Get live scorecard
- `createMatch(matchData)` - Create match (admin)
- `updateMatchStatus(matchId, status)` - Update match status (admin)
- `deleteMatch(matchId)` - Delete match (admin)

#### Usage Example:
```javascript
import { matchService } from '../api/services';

// Get live matches
const { matches } = await matchService.getLiveMatches();

// Get match statistics
const stats = await matchService.getMatchStatistics(matchId);
// Returns: { battingStats, bowlingStats, partnerships }

// Get commentary
const { commentary } = await matchService.getMatchCommentary(matchId);
```

### Team Service
**File:** `/src/api/services/teamService.js`

#### Methods:
- `getAllTeams()` - Get all teams
- `getTeamById(teamId)` - Get team by ID
- `createTeam(teamData)` - Create team (admin)
- `updateTeam(teamId, teamData)` - Update team (admin)
- `deleteTeam(teamId)` - Delete team (admin)

### Player Service
**File:** `/src/api/services/playerService.js`

#### Methods:
- `getAllPlayers()` - Get all players
- `getPlayerById(playerId)` - Get player by ID
- `getPlayersByTeam(teamId)` - Get players by team
- `createPlayer(playerData)` - Create player (admin)
- `updatePlayer(playerId, playerData)` - Update player (admin)
- `deletePlayer(playerId)` - Delete player (admin)

### Ball Service
**File:** `/src/api/services/ballService.js`

#### Methods:
- `createBall(ballData)` - Record ball (admin - score entry)
- `getBallsByInnings(inningsId)` - Get balls by innings
- `updateBall(ballId, ballData)` - Update ball (admin)
- `deleteBall(ballId)` - Delete ball (admin)

#### Ball Data Structure:
```javascript
{
  inningsId: 1,
  overNumber: 46,
  ballNumber: 6,
  batsmanId: 5,
  bowlerId: 8,
  runs: 4,
  extras: 0,
  extraType: null, // or 'wide', 'no_ball', 'bye', 'leg_bye'
  isWicket: false,
  dismissalType: null // or 'bowled', 'caught', 'lbw', 'run_out', etc.
}
```

## Redux Integration

### Auth Slice
**File:** `/src/features/auth/authSlice.js`

#### Actions:
- `loginUser(credentials)` - Async thunk for login
- `registerUser(userData)` - Async thunk for register
- `logoutUser()` - Async thunk for logout
- `loginSuccess(payload)` - Sync action (for backward compatibility)
- `logout()` - Sync action for manual logout

#### State:
```javascript
{
  user: null | { id, username, email, role },
  token: null | string,
  isAuthenticated: boolean,
  isAdmin: boolean,
  loading: boolean,
  error: null | string
}
```

#### Usage:
```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../features/auth/authSlice';

// In component
const dispatch = useDispatch();
const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

// Login
await dispatch(loginUser({ username: 'admin', password: 'admin123' }));

// Logout
await dispatch(logoutUser());
```

## Component Integration Examples

### HomePage
**Location:** `/src/pages/HomePage.jsx`

Fetches live and upcoming matches on mount:
```javascript
const [liveMatches, setLiveMatches] = useState([]);
const [upcomingMatches, setUpcomingMatches] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const [liveData, upcomingData] = await Promise.all([
      matchService.getLiveMatches(),
      matchService.getUpcomingMatches()
    ]);
    setLiveMatches(liveData.matches || []);
    setUpcomingMatches(upcomingData.matches || []);
  };
  fetchData();
}, []);
```

### LiveScoreboardNew
**Location:** `/src/pages/LiveScoreboardNew.jsx`

Fetches live matches with auto-refresh every 30 seconds:
```javascript
useEffect(() => {
  const fetchLiveMatches = async () => {
    const response = await matchService.getLiveMatches();
    setLiveMatches(response.matches || []);
  };

  fetchLiveMatches();
  const interval = setInterval(fetchLiveMatches, 30000);
  return () => clearInterval(interval);
}, []);
```

### MatchDetails
**Location:** `/src/pages/MatchDetails.jsx`

Fetches match details, statistics, and commentary with auto-refresh:
```javascript
useEffect(() => {
  const fetchMatchData = async () => {
    const [matchData, statsData, commentaryData] = await Promise.all([
      matchService.getMatchDetails(matchId),
      matchService.getMatchStatistics(matchId),
      matchService.getMatchCommentary(matchId)
    ]);
    
    setCurrentMatch(matchData.match);
    setStatistics(statsData);
    setCommentary(commentaryData.commentary || []);
  };

  fetchMatchData();
  const interval = setInterval(fetchMatchData, 10000);
  return () => clearInterval(interval);
}, [matchId]);
```

### AdminScoreEntry
**Location:** `/src/pages/admin/AdminScoreEntryStatic.jsx`

Records ball data to API:
```javascript
const handleBallSubmit = async () => {
  const ballData = {
    inningsId: match.currentInningsId,
    overNumber: scoreData.currentOver,
    ballNumber: scoreData.currentBallInOver + 1,
    batsmanId: parseInt(currentBall.batsmanId),
    bowlerId: parseInt(currentBall.bowlerId),
    runs: parseInt(currentBall.runs) || 0,
    extras: parseInt(currentBall.extras) || 0,
    extraType: currentBall.extraType !== 'none' ? currentBall.extraType : null,
    isWicket: currentBall.isWicket,
    dismissalType: currentBall.isWicket ? currentBall.dismissalType : null,
  };

  await ballService.createBall(ballData);
};
```

## Error Handling

### Global Error Handling
Axios interceptor automatically handles:
- 401 Unauthorized - Clears token and redirects to login
- 403 Forbidden - Logs error
- 404 Not Found - Logs error
- 500 Server Error - Logs error
- Network errors - Shows connection error

### Component-Level Error Handling
```javascript
const [error, setError] = useState(null);

try {
  const data = await matchService.getLiveMatches();
  setMatches(data.matches);
} catch (err) {
  setError(err.message || 'Failed to load matches');
}

// Display error
{error && (
  <Alert severity="error">{error}</Alert>
)}
```

## Authentication Flow

1. User enters credentials on login page
2. Frontend calls `authService.login(credentials)`
3. Backend validates and returns JWT token + user data
4. Token stored in localStorage automatically
5. All subsequent API requests include token in Authorization header
6. On 401 error, user is automatically logged out

## Testing

### Test with Backend Running
1. Start backend: `cd sports-scoreboard-backend && npm start`
2. Backend runs on: `http://localhost:5000`
3. Start frontend: `cd client && npm run dev`
4. Frontend runs on: `http://localhost:3001`

### Test Credentials (from backend seeders)
- Admin: `admin` / `admin123`
- User: `user` / `user123`

### API Endpoints to Test
- GET `http://localhost:5000/api/matches/live`
- GET `http://localhost:5000/api/matches/upcoming`
- POST `http://localhost:5000/api/auth/login`
- GET `http://localhost:5000/api/matches/:id/statistics`
- POST `http://localhost:5000/api/balls`

## Environment Variables

Create `.env` file in client folder:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

Update `/src/api/client.js`:
```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  // ...
});
```

## Next Steps

1. **Start Backend Server**
   ```bash
   cd sports-scoreboard-backend
   npm install
   npx sequelize-cli db:migrate
   npx sequelize-cli db:seed:all
   npm start
   ```

2. **Test API Endpoints**
   - Use Postman or browser to test endpoints
   - Verify database has seeded data

3. **Run Frontend**
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Test Full Flow**
   - Login with admin credentials
   - View live matches
   - Enter scores (admin only)
   - View match details with real-time updates

## Troubleshooting

### CORS Errors
Ensure backend has CORS enabled:
```javascript
// backend/src/server.js
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
```

### Token Not Sent
Check browser localStorage for token:
```javascript
localStorage.getItem('token')
```

### Network Errors
- Verify backend is running on port 5000
- Check firewall settings
- Ensure no proxy blocking requests

## API Documentation
Full API documentation: `/sports-scoreboard-backend/API_DOCUMENTATION.md`
