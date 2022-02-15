import { DBDocumentStoreItemV2 } from "indexeddb/type";
import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { editDrawerArraySlice } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice";


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

export const DrawerReducer = combineReducers({ // Return combined reducers, if not the head of directory, just return a reducer is ok
  editDrawerArray: editDrawerArraySlice.reducer,
  drawer: DrawerSlice.reducer
});
