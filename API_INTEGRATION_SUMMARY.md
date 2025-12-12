# API Integration Summary

## ✅ Completed Tasks

### 1. API Client Setup
- Created Axios instance with baseURL `http://localhost:5000/api`
- Added request interceptor for JWT token authentication
- Added response interceptor for global error handling
- Configured automatic logout on 401 errors

### 2. API Services Created
All services located in `/src/api/services/`:

- **authService.js** - Login, register, logout, profile management
- **matchService.js** - Match CRUD, live matches, statistics, commentary
- **teamService.js** - Team management
- **playerService.js** - Player management
- **inningsService.js** - Innings management
- **ballService.js** - Ball recording (score entry)
- **index.js** - Export all services

### 3. Redux Integration
- Updated authSlice to use real API calls
- Added async thunks: `loginUser`, `registerUser`, `logoutUser`
- Token automatically stored/retrieved from localStorage
- Error states properly handled

### 4. Component Updates

#### HomePage
- Replaced mock data with API calls
- Fetches live matches via `matchService.getLiveMatches()`
- Fetches upcoming matches via `matchService.getUpcomingMatches()`
- Displays loading and error states

#### LiveScoreboardNew
- Replaced mock data with `matchService.getLiveMatches()`
- Auto-refreshes every 30 seconds
- Shows "No live matches" when empty
- Displays real match data from backend

#### MatchDetails
- Fetches match details, statistics, and commentary
- Three tabs: Scorecard, Commentary, Statistics
- Auto-refreshes every 10 seconds
- Shows batting stats, bowling stats, partnerships

#### AdminScoreEntry
- Fetches match data and player lists from API
- POST ball data to `/balls` endpoint
- Real-time score updates
- Snackbar notifications for success/errors
- Validates batsman and bowler selection

#### LoginPage
- Already using Redux `loginUser` thunk
- Automatic navigation after successful login
- Error display from Redux state

## 🔑 Key Features

### Authentication
- JWT token-based authentication
- Auto-login from localStorage
- Automatic logout on token expiration
- Protected routes for admin pages

### Real-time Updates
- Live matches refresh every 30 seconds
- Match details refresh every 10 seconds
- Immediate UI updates after score entry
- Optimistic UI updates

### Error Handling
- Global error interceptor
- Component-level error states
- User-friendly error messages
- Network error detection

## 📁 File Structure

```
client/src/
├── api/
│   ├── client.js              # Axios configuration
│   └── services/
│       ├── index.js           # Export all services
│       ├── authService.js     # Authentication
│       ├── matchService.js    # Matches
│       ├── teamService.js     # Teams
│       ├── playerService.js   # Players
│       ├── inningsService.js  # Innings
│       └── ballService.js     # Balls/Score entry
├── features/
│   └── auth/
│       └── authSlice.js       # Updated with API calls
└── pages/
    ├── HomePage.jsx           # Updated with API
    ├── LiveScoreboardNew.jsx  # Updated with API
    ├── MatchDetails.jsx       # Updated with API
    ├── LoginPage.jsx          # Already using Redux
    └── admin/
        └── AdminScoreEntryStatic.jsx  # Updated with API
```

## 🚀 Quick Start

### 1. Start Backend
```bash
cd sports-scoreboard-backend
npm install
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
npm start
```
Backend runs on: http://localhost:5000

### 2. Start Frontend
```bash
cd client
npm install
npm run dev
```
Frontend runs on: http://localhost:3001

### 3. Test Login
- Username: `admin`
- Password: `admin123`

## 📊 API Endpoints Used

### Authentication
- POST `/auth/login` - User login
- POST `/auth/register` - User registration
- POST `/auth/logout` - User logout
- GET `/auth/profile/:userId` - Get user profile

### Matches
- GET `/matches/live` - Get live matches
- GET `/matches/upcoming` - Get upcoming matches
- GET `/matches/:id` - Get match details
- GET `/matches/:id/statistics` - Get match statistics
- GET `/matches/:id/commentary` - Get ball-by-ball commentary
- POST `/matches` - Create match (admin)
- PUT `/matches/:id` - Update match (admin)

### Players
- GET `/players` - Get all players
- GET `/players/:id` - Get player by ID

### Balls (Score Entry)
- POST `/balls` - Record ball (admin)
- GET `/balls?inningsId=:id` - Get balls by innings

### Teams
- GET `/teams` - Get all teams
- GET `/teams/:id` - Get team by ID

## 🔐 Authentication Flow

1. User logs in via LoginPage
2. `authService.login()` called
3. Backend returns JWT token + user data
4. Token stored in localStorage
5. All API requests include token in Authorization header
6. On 401, user automatically logged out

## 🎯 Key Code Patterns

### Fetching Data
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await matchService.getLiveMatches();
      setData(response.matches || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);
```

### Posting Data
```javascript
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async () => {
  try {
    setSubmitting(true);
    await ballService.createBall(ballData);
    setSuccessMessage('Ball recorded successfully');
  } catch (err) {
    setError(err.message);
  } finally {
    setSubmitting(false);
  }
};
```

### Using Redux Auth
```javascript
import { useDispatch } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';

const dispatch = useDispatch();

const handleLogin = async (credentials) => {
  const result = await dispatch(loginUser(credentials));
  if (result.type === 'auth/login/fulfilled') {
    navigate('/');
  }
};
```

## ⚠️ Important Notes

1. **Backend Must Be Running**: Frontend will show errors if backend is not running on port 5000

2. **CORS**: Backend must have CORS enabled for `http://localhost:3001`

3. **Database**: Run migrations and seeders before testing

4. **Token Expiry**: Currently using mock tokens, implement JWT expiry handling in production

5. **Innings Tracking**: AdminScoreEntry needs `match.currentInningsId` - ensure this is set in backend

## 🐛 Common Issues

### "Network Error"
- Backend not running
- Wrong port
- CORS not configured

### "401 Unauthorized"
- Token expired
- Not logged in
- Invalid credentials

### "Match not found"
- Database not seeded
- Wrong match ID
- Migrations not run

### Empty Data Arrays
- No seeded data in database
- Wrong API endpoint
- Backend returning wrong format

## 📚 Documentation

- Full API Integration Guide: `/client/API_INTEGRATION.md`
- Backend API Docs: `/sports-scoreboard-backend/API_DOCUMENTATION.md`
- Database Guide: `/sports-scoreboard-backend/MATCH_DATA_GUIDE.md`

## ✨ Next Steps

1. Test all API endpoints with backend running
2. Verify database has seeded data
3. Test full user flow (login → view matches → score entry)
4. Implement JWT token refresh
5. Add loading skeletons for better UX
6. Implement error boundaries
7. Add unit tests for API services
8. Configure production environment variables
