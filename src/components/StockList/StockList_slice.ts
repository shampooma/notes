import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { DBStockStoreItemV2, DBStockRecordV2 } from "indexeddb/type";
import { editDialogReducer } from "components/StockList/EditDialog/EditDialog_slice";

export const stockListSlice = createSlice({
  name: 'stockList',
  initialState: {
    stockRecordArray: [],
    stockRecordIndex: -1,
  } as {
    stockRecordArray: DBStockRecordV2[],
    stockRecordIndex: number,
  },
  reducers: {
    pushItems: (state, action: PayloadAction<DBStockRecordV2>) => {
      state.stockRecordArray.push(action.payload);
    },
    deleteItems: (state, action: PayloadAction<number>) => {
      state.stockRecordArray.splice(action.payload, 1);
    },
    setStockList: (state, action: PayloadAction<DBStockRecordV2[]>) => {
      state.stockRecordArray = action.payload;
    },
    setStockRecordIndex: (state, action: PayloadAction<number>) => {
      state.stockRecordIndex = action.payload;
    },
  },
});

export const {
  pushItems,
  deleteItems,
  setStockList,
} = stockListSlice.actions;

export const stockListReducer = combineReducers({
  stockList: stockListSlice.reducer,
  editDialog: editDialogReducer,
});