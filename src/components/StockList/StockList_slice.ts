import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { editDialogReducer } from "components/StockList/EditDialog/EditDialog_slice";

export const stockListSlice = createSlice({
  name: 'stockList',
  initialState: {
  } as {
  },
  reducers: {
  },
});

export const {} = stockListSlice.actions;

export const stockListReducer = combineReducers({
  stockList: stockListSlice.reducer,
  editDialog: editDialogReducer,
});