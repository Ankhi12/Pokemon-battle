
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk using fetch POST
export const startBattle = createAsyncThunk(
  'battle/start',
  async ({ pokemon1, pokemon2 }) => {
    const res = await fetch('/api/battle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pokemon1, pokemon2 })
    });
    const data = await res.json();
    return data;
  }
);

const battleSlice = createSlice({
  name: 'battle',
  initialState: {
    log: [],
    winner: null,
    status: 'idle'
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(startBattle.pending, (state) => {
        state.status = 'loading';
        state.log = [];
        state.winner = null;
      })
      .addCase(startBattle.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.log = action.payload.log;
        state.winner = action.payload.winner;
      })
      .addCase(startBattle.rejected, (state) => {
        state.status = 'failed';
        state.log = ['Battle failed.'];
      });
  }
});

export default battleSlice.reducer;
