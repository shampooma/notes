import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { EditDialogReducer } from "components/Password/EditDialog/EditDialog_slice"; // Import reducers in same directory
import { DeleteDialogReducer } from "components/Password/DeleteDialog/DeleteDialog_slice";
import { DBPasswordRecordData } from 'database/db';

export const PasswordSlice = createSlice({ // Slice copntains reducers and actions
  name: 'Password',
  initialState: {
    passwordRecordArray: undefined,
    documentPassword: "",
    settedDetectIdle: false,
  } as {
    passwordRecordArray: DBPasswordRecordData[] | undefined,
    documentPassword: string,
    settedDetectIdle: boolean,
  },
  reducers: {
    setPasswordRecordArray: (state, action: PayloadAction<DBPasswordRecordData[]  | undefined>) => {
      state.passwordRecordArray = action.payload;
    },
    setDocumentPassword: (state, action: PayloadAction<string>) => {
      state.documentPassword = action.payload;
    },
    setSettedDetectIdle: (state, action: PayloadAction<boolean>) => {
      state.settedDetectIdle = action.payload;
    },
  },
});

export const { setPasswordRecordArray, setDocumentPassword, setSettedDetectIdle } = PasswordSlice.actions;

export const PasswordReducer = combineReducers({
  Password: PasswordSlice.reducer,
  EditDialog: EditDialogReducer,
  DeleteDialog: DeleteDialogReducer,
});