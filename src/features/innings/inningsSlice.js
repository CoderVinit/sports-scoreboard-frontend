import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import { API_ENDPOINTS } from '../../config/api.config';

export const fetchInnings = createAsyncThunk(
  'innings/fetchInnings',
  async (matchId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.MATCHES}/${matchId}/innings`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateInnings = createAsyncThunk(
  'innings/updateInnings',
  async ({ inningsId, inningsData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_ENDPOINTS.INNINGS}/${inningsId}`, inningsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const recordBall = createAsyncThunk(
  'innings/recordBall',
  async (ballData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_ENDPOINTS.BALLS, ballData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  innings: [],
  currentInnings: null,
  balls: [],
  loading: false,
  error: null,
};

const inningsSlice = createSlice({
  name: 'innings',
  initialState,
  reducers: {
    setCurrentInnings: (state, action) => {
      state.currentInnings = action.payload;
    },
    addBall: (state, action) => {
      state.balls.push(action.payload);
    },
    clearBalls: (state) => {
      state.balls = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInnings.fulfilled, (state, action) => {
        state.innings = action.payload;
      })
      .addCase(updateInnings.fulfilled, (state, action) => {
        const index = state.innings.findIndex(i => i.id === action.payload.id);
        if (index !== -1) {
          state.innings[index] = action.payload;
        }
      })
      .addCase(recordBall.fulfilled, (state, action) => {
        state.balls.push(action.payload);
      });
  },
});

export const { setCurrentInnings, addBall, clearBalls } = inningsSlice.actions;
export default inningsSlice.reducer;
