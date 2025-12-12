import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import matchReducer from '../features/matches/matchSlice';
import inningsReducer from '../features/innings/inningsSlice';
import teamReducer from '../features/teams/teamSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    matches: matchReducer,
    innings: inningsReducer,
    teams: teamReducer,
  },
});

export default store;
