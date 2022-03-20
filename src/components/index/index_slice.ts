// import { DBDocumentItemV2 } from "indexeddb/type";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const indexSlice = createSlice({
  name: 'index',
  initialState: {
    documentIndex: -1,
  } as {
    documentIndex: number,
  },
  reducers: {
    setDocumentIndex: (state, action: PayloadAction<number>) => {
      state.documentIndex = action.payload;
    },
  },
});

export const { setDocumentIndex } = indexSlice.actions;

export const indexReducer = indexSlice.reducer;