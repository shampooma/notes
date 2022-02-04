import { DBDocumentStoreItemV2 } from "indexeddb/type";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const DrawerSlice = createSlice({
  name: 'Drawer',
  initialState: {
    documentArray: [],
  } as {
    documentArray: DBDocumentStoreItemV2[],
  },
  reducers: {
    setDrawerList: (state, action: PayloadAction<DBDocumentStoreItemV2[]>) => {
      state.documentArray = action.payload;
    },
  },
});

export const { setDrawerList } = DrawerSlice.actions;

export const DrawerReducer = DrawerSlice.reducer;