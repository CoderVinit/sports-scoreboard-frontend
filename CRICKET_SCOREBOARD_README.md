# Cricket Scoreboard Application

A comprehensive, real-time cricket scoreboard application with admin controls for managing matches, teams, players, and live score updates. Built with React, Redux Toolkit, Material-UI, and Tailwind CSS.

## 🏏 Features

### Public Features
- **Live Scoreboard**: Real-time cricket match scores with automatic updates
- **Match Details**: Comprehensive view of batting and bowling statistics
- **Ball-by-Ball Commentary**: Track every ball with detailed scoring information
- **Scoring Breakdown**: Detailed statistics including boundaries, dot balls, and extras
- **Multiple Match Viewing**: Browse and view multiple live and completed matches

### Admin Features (Admin Role Required)
- **Match Management**: Create, edit, and manage cricket matches
- **Live Score Entry**: Real-time score updates during matches
  - Ball-by-ball scoring
  - Run tracking (0, 1, 2, 3, 4, 6)
  - Wicket recording
  - Extras (Wide, No Ball, Bye, Leg Bye)
  - Player selection (Batsman and Bowler)
  - Undo functionality
- **Team Management**: Add and manage cricket teams
- **Player Management**: Manage player profiles and statistics
- **Match Statistics**: Track and update comprehensive match data

## 🎨 UI Features

The application features an interactive, ESPN Cricinfo-inspired design:

- **Real-time Score Updates**: Live polling for score changes
- **Interactive Tables**: Batting and bowling scorecards with detailed statistics
- **Color-coded Information**: 
  - Live matches highlighted in red
  - Wickets in red
  - Boundaries (4s in blue, 6s in green)
  - Current batsman and bowler highlighted
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Material-UI Components**: Professional, polished UI components
- **Tailwind Utilities**: Custom styling for enhanced visual appeal

## 📁 Project Structure

```
client/
├── src/
│   ├── features/           # Redux slices
│   │   ├── auth/          # Authentication slice
│   │   ├── matches/       # Match management slice
│   │   ├── innings/       # Innings and ball tracking slice
│   │   └── teams/         # Team management slice
│   ├── pages/             # Page components
│   │   ├── HomePage.jsx              # Landing page with match listings
│   │   ├── LiveScoreboard.jsx        # Live matches display
│   │   ├── MatchDetails.jsx          # Detailed match view
│   │   ├── LoginPage.jsx             # User login
│   │   ├── RegisterPage.jsx          # User registration
│   │   └── admin/                    # Admin pages (protected)
│   │       ├── AdminDashboard.jsx    # Admin control panel
│   │       ├── AdminMatches.jsx      # Match management
│   │       ├── AdminScoreEntry.jsx   # Live score entry interface
│   │       ├── AdminTeams.jsx        # Team management
│   │       └── AdminPlayers.jsx      # Player management
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx     # Navigation with role-based menus
│   │   ├── Footer.jsx     # Footer component
│   │   └── ProtectedRoute.jsx  # Route guards
│   ├── store/             # Redux store configuration
│   ├── config/            # API configuration
│   ├── utils/             # Utilities (axios instance)
│   └── theme/             # MUI theme customization
```

## 🔐 Authentication & Authorization

### User Roles
- **User**: Can view live scores and match details
- **Admin**: Full access to score entry and match management

### Protected Routes
- `/admin/*` - All admin routes require admin role
- Authentication via JWT tokens
- Automatic token refresh and session management

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Backend API running on `http://localhost:5000`

### Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

## 📊 Admin Score Entry Guide

### How to Update Live Scores

1. **Login as Admin**: Use admin credentials to access admin panel
2. **Navigate to Matches**: Go to Admin → Manage Matches
3. **Select Match**: Click "Score Entry" button for the match
4. **Score Entry Interface**:
   - **Select Runs**: Click buttons 0-6 to record runs scored
   - **Record Wicket**: Click "WICKET" button if batsman is out
   - **Mark Extras**: Select Wide, No Ball, Bye, or Leg Bye if applicable
   - **Select Players**: Choose current batsman and bowler from dropdowns
   - **Submit Ball**: Click "SUBMIT BALL" to record the delivery
   - **Undo**: Click "UNDO" to reverse the last ball entry

### Score Entry Features
- Real-time score updates visible to all users
- Ball-by-ball tracking with complete statistics
- Automatic over calculations
- Run rate calculations (Current RR, Required RR)
- Partnership tracking
- Individual player statistics (runs, balls, 4s, 6s, strike rate)
- Bowling figures (overs, maidens, runs, wickets, economy)

## 🎯 Key Pages

### Public Pages
- `/` - Home page with live and recent matches
- `/live` - All live matches with real-time updates
- `/match/:matchId` - Detailed match view with scorecards
- `/login` - User login
- `/register` - New user registration

### Admin Pages (Protected)
- `/admin` - Admin dashboard
- `/admin/matches` - Match management and creation
- `/admin/score-entry/:matchId` - Live score entry interface
- `/admin/teams` - Team management
- `/admin/players` - Player management

## 🔄 Real-time Updates

The application implements automatic polling:
- Live scoreboard updates every 5 seconds
- Match details update every 3 seconds
- Efficient state management with Redux
- Optimistic UI updates for instant feedback

## 🎨 Styling

- **Material-UI**: Professional components and theming
- **Tailwind CSS**: Utility classes for custom styling
- **Custom Theme**: Cricket-focused color scheme
- **Responsive Grid**: Mobile-first design approach

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers (1920px+)
- Laptops (1366px+)
- Tablets (768px+)
- Mobile phones (320px+)

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔌 API Integration

The app connects to the backend API for:
- User authentication
- Match data (CRUD operations)
- Team management
- Player management
- Innings and ball recording
- Real-time score updates

## 🛠️ Technologies Used

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Material-UI** - Component library
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **ESLint** - Code linting

## 📝 Future Enhancements

- [ ] WebSocket integration for real-time updates
- [ ] Advanced statistics and analytics
- [ ] Player profiles with career statistics
- [ ] Match predictions and insights
- [ ] Video highlights integration
- [ ] Commentary and analysis features
- [ ] Push notifications for match events
- [ ] Social media integration
- [ ] Mobile app version

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

---

**Built with ❤️ for cricket fans worldwide**
