// import { DBDocumentItemV2 } from "indexeddb/type";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const indexSlice = createSlice({
  name: 'index',
  initialState: {
    interactingDocumentId: -1,
  } as {
    interactingDocumentId: number,
  },
  reducers: {
    setInteractingDocumentId: (state, action: PayloadAction<number>) => {
      state.interactingDocumentId = action.payload;
    },
  },
});

export const { setInteractingDocumentId } = indexSlice.actions;

export const indexReducer = indexSlice.reducer;