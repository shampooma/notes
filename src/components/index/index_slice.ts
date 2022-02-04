// import { DBDocumentItemV2 } from "indexeddb/type";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const indexSlice = createSlice({
  name: 'index',
  initialState: {
    db: null,
    documentIndex: -1, 
  } as {
    db: null | IDBDatabase,
    documentIndex: number,
  },
  reducers: {
    setDb: (state, action: PayloadAction<IDBDatabase>) => {
      state.db = action.payload;
    },
    setDocumentIndex: (state, action: PayloadAction<number>) => {
      state.documentIndex = action.payload;
    },
  },
});

export const { setDb, setDocumentIndex } = indexSlice.actions;

export const indexReducer = indexSlice.reducer;