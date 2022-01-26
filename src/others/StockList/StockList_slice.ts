import { createSlice, combineReducers } from '@reduxjs/toolkit'
import {GeneralItem} from "./StockList_type";
import editDialogReducer from "./EditDialog_slice";

export const stockListSlice = createSlice({
  name: 'stockList',
  initialState: {
    // value
    items: []
  } as {
    // type
    items: GeneralItem[]
  },
  reducers: {
    pushItems: (state, action) => {
      state.items.push(action.payload)
    },
    deleteItems: (state, action) => {
      state.items.splice(action.payload.index, 1);
    },
    setItems: (state, action) => {
      state.items = action.payload;
    }
  },
})

export const {
  pushItems,
  deleteItems,
  setItems
} = stockListSlice.actions

export default combineReducers({
  stockList: stockListSlice.reducer,
  editDialog: editDialogReducer
});