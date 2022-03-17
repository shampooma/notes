import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';

export const EditDialogSlice = createSlice({ // Slice copntains reducers and actions
  name: 'EditDialog',
  initialState: {
    isEditing: false,
    editingId: -1,
  } as {
    isEditing: boolean,
    editingId: number,
  },
  reducers: {
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setEditingId: (state, action: PayloadAction<number>) => {
      state.editingId = action.payload;
    },
  },
});

export const { setIsEditing, setEditingId } = EditDialogSlice.actions;

export const EditDialogReducer = combineReducers({
  EditDialog: EditDialogSlice.reducer,
});