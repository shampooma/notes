import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { editDialogReducer } from "components/Todo/EditDialog/EditDialog_slice";

export const TodoSlice = createSlice({
  name: 'todo',
  initialState: {
  } as {
  },
  reducers: {
  },
});

export const {} = TodoSlice.actions;

export const TodoReducer = combineReducers({
  todo: TodoSlice.reducer,
  editDialog: editDialogReducer,
});