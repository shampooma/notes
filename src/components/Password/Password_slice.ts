import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { EditDialogReducer } from "components/Password/EditDialog/EditDialog_slice"; // Import reducers in same directory

export const PasswordSlice = createSlice({ // Slice copntains reducers and actions
  name: 'Password',
  initialState: {
  } as {
  },
  reducers: {
  },
});

export const { } = PasswordSlice.actions;

export const PasswordReducer = combineReducers({
  Password: PasswordSlice.reducer,
  EditDialog: EditDialogReducer,
});