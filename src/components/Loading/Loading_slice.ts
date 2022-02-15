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
      const index = state.loading.indexOf(action.payload);
      if (index > -1) {
        state.loading.splice(index, 1);
      }
    },
  },
});

export const { pushLoading, deleteLoading } = LoadingSlice.actions;

export const LoadingReducer = LoadingSlice.reducer;