import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { EditDialogReducer } from "components/Password/EditDialog/EditDialog_slice"; // Import reducers in same directory
import { DeleteDialogReducer } from "components/Password/DeleteDialog/DeleteDialog_slice";
import { DBPasswordRecordData } from 'database/db';

export const PasswordSlice = createSlice({ // Slice copntains reducers and actions
  name: 'Password',
  initialState: {
    passwordRecordArray: undefined,
    documentPassword: "",
  } as {
    passwordRecordArray: DBPasswordRecordData[] | undefined,
    documentPassword: string,
  },
  reducers: {
    setPasswordRecordArray: (state, action: PayloadAction<DBPasswordRecordData[]  | undefined>) => {
      state.passwordRecordArray = action.payload;
    },
    setDocumentPassword: (state, action: PayloadAction<string>) => {
      state.documentPassword = action.payload;
    },
  },
});

export const { setPasswordRecordArray, setDocumentPassword } = PasswordSlice.actions;

export const PasswordReducer = combineReducers({
  Password: PasswordSlice.reducer,
  EditDialog: EditDialogReducer,
  DeleteDialog: DeleteDialogReducer,
});