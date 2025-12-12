import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { API_ENDPOINTS } from '../../config/api.config';

// Async thunks
export const fetchMatches = createAsyncThunk(
  'matches/fetchMatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_ENDPOINTS.MATCHES);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMatchById = createAsyncThunk(
  'matches/fetchMatchById',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.MATCHES}/${matchId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createMatch = createAsyncThunk(
  'matches/createMatch',
  async (matchData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.MATCHES, matchData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateMatch = createAsyncThunk(
  'matches/updateMatch',
  async ({ matchId, matchData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.MATCHES}/${matchId}`, matchData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  matches: [],
  currentMatch: null,
  liveMatches: [],
  loading: false,
  error: null,
};

const matchSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setCurrentMatch: (state, action) => {
      state.currentMatch = action.payload;
    },
    clearCurrentMatch: (state) => {
      state.currentMatch = null;
    },
    updateLiveScore: (state, action) => {
      const { matchId, scoreData } = action.payload;
      if (state.currentMatch?.id === matchId) {
        state.currentMatch = { ...state.currentMatch, ...scoreData };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
        state.liveMatches = action.payload.filter(m => m.status === 'live');
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMatchById.fulfilled, (state, action) => {
        state.currentMatch = action.payload;
      })
      .addCase(createMatch.fulfilled, (state, action) => {
        state.matches.push(action.payload);
      })
      .addCase(updateMatch.fulfilled, (state, action) => {
        const index = state.matches.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.matches[index] = action.payload;
        }
        if (state.currentMatch?.id === action.payload.id) {
          state.currentMatch = action.payload;
        }
      });
  },
});

export const { setCurrentMatch, clearCurrentMatch, updateLiveScore } = matchSlice.actions;
export default matchSlice.reducer;
