import { DBDocumentStoreItem } from "database/db";
import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { editDrawerArraySlice } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice";
import { newDocumentSlice } from "components/Drawer/NewDocumentDialog/NewDocumentDialog_slice";


export const DrawerSlice = createSlice({
  name: 'Drawer',
  initialState: {
    documentArray: []
  } as {
    documentArray: DBDocumentStoreItem[]
  },
  reducers: {
    setDocumentArray: (state, action: PayloadAction<DBDocumentStoreItem[]>) => {
      state.documentArray = action.payload;
    },
  },
});

export const { setDocumentArray } = DrawerSlice.actions;

export const DrawerReducer = combineReducers({ // Return combined reducers, if not the head of directory, just return a reducer is ok
  editDrawerArray: editDrawerArraySlice.reducer,
  newDocument: newDocumentSlice.reducer,
  drawer: DrawerSlice.reducer,
});
