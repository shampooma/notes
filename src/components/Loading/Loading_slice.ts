import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const LoadingSlice = createSlice({
  name: 'Loading',
  initialState: {
    loading: [],
  } as {
    loading: number[],
  },
  reducers: {
    pushLoading: (state, action: PayloadAction<number>) => {
      state.loading.push(action.payload);
    },
    deleteLoading: (state, action: PayloadAction<number>) => {
      state.loading = state.loading.filter(s => s !== action.payload);
    },
  },
});

export const { pushLoading, deleteLoading } = LoadingSlice.actions;

export const LoadingReducer = LoadingSlice.reducer;