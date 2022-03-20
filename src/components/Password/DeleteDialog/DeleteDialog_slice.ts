import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';

export const DeleteDialogSlice = createSlice({ // Slice copntains reducers and actions
  name: 'DeleteDialog',
  initialState: {
    isDeleting: false,
    deletingIndex: -1,
  } as {
    isDeleting: boolean,
    deletingIndex: number,
  },
  reducers: {
    setIsDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },
    setDeletingIndex: (state, action: PayloadAction<number>) => {
      state.deletingIndex = action.payload;
    }
  },
});

export const { setIsDeleting, setDeletingIndex } = DeleteDialogSlice.actions;

export const DeleteDialogReducer = combineReducers({
  DeleteDialog: DeleteDialogSlice.reducer,
});