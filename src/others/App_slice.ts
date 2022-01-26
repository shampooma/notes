import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    db: null,
    loading: false
  } as {
    db: null | IDBDatabase,
    loading: boolean
  },
  reducers: {
    setDb: (state, action) => {
      state.db = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    },
  },
});

export const { setDb, setLoading } = appSlice.actions;

export default appSlice.reducer;