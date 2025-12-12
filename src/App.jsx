import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LiveScoreboard from './pages/LiveScoreboardNew';
import MatchDetailsStatic from './pages/MatchDetailsStatic';
import LoginPageStatic from './pages/LoginPageStatic';
import RegisterPage from './pages/RegisterPage';
import AdminDashboardStatic from './pages/admin/AdminDashboardStatic';
import AdminMatchesStatic from './pages/admin/AdminMatchesStatic';
import AdminScoreEntryStatic from './pages/admin/AdminScoreEntryStatic';
import AdminPlayers from './pages/admin/AdminPlayers';
import AdminTeams from './pages/admin/AdminTeams';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import './App.css';

// Cricket Scoreboard Application
function App() {
  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/live" element={<LiveScoreboard />} />
            <Route path="/match/:matchId" element={<MatchDetailsStatic />} />
            <Route path="/login" element={<LoginPageStatic />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboardStatic />
              </AdminRoute>
            } />
            <Route path="/admin/matches" element={
              <AdminRoute>
                <AdminMatchesStatic />
              </AdminRoute>
            } />
            <Route path="/admin/score-entry/:matchId" element={
              <AdminRoute>
                <AdminScoreEntryStatic />
              </AdminRoute>
            } />
            <Route path="/admin/players" element={
              <AdminRoute>
                <AdminPlayers />
              </AdminRoute>
            } />
            <Route path="/admin/teams" element={
              <AdminRoute>
                <AdminTeams />
              </AdminRoute>
            } />
          </Routes>
        </Box>
        <Footer />
      </Box>
    </Router>
  );
}

export default App;
