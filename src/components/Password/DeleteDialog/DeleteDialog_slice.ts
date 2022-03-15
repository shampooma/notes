import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';

export const DeleteDialogSlice = createSlice({ // Slice copntains reducers and actions
  name: 'DeleteDialog',
  initialState: {
    isDeleting: false,
    deletingId: -1,
  } as {
    isDeleting: boolean,
    deletingId: number,
  },
  reducers: {
    setIsDeleting: (state, action: PayloadAction<boolean>) => {
      state.isDeleting = action.payload;
    },
    setDeletingId: (state, action: PayloadAction<number>) => {
      state.deletingId = action.payload;
    }
  },
});

export const { setIsDeleting, setDeletingId } = DeleteDialogSlice.actions;

export const DeleteDialogReducer = combineReducers({
  DeleteDialog: DeleteDialogSlice.reducer,
});