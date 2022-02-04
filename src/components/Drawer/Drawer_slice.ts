import { DBDocumentV2 } from "indexeddb/type";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const DrawerSlice = createSlice({
  name: 'Drawer',
  initialState: {
    documentArray: [],
  } as {
    documentArray: DBDocumentV2[],
  },
  reducers: {
    setDrawerList: (state, action: PayloadAction<DBDocumentV2[]>) => {
      state.documentArray = action.payload;
    },
  },
});

export const { setDrawerList } = DrawerSlice.actions;

export const DrawerReducer = DrawerSlice.reducer;