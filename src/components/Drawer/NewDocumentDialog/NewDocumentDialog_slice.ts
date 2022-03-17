import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';

export const newDocumentSlice = createSlice({ // Slice copntains reducers and actions
  name: 'NewDocument',
  initialState: {
    creatingDocument: false, // State how to use
  } as {
    creatingDocument: boolean,
  },
  reducers: {
    setCreatingDocument: (state, action: PayloadAction<boolean>) => {
      state.creatingDocument = action.payload;
    }
  },
});

export const { setCreatingDocument } = newDocumentSlice.actions;

export const newDocumentDialogReducer = combineReducers({
  newDocument: newDocumentSlice.reducer,
});