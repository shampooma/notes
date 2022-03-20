import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';

export const EditDialogSlice = createSlice({ // Slice copntains reducers and actions
  name: 'EditDialog',
  initialState: {
    isEditing: false,
    editingIndex: -1,
  } as {
    isEditing: boolean,
    editingIndex: number,
  },
  reducers: {
    setIsEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setEditingIndex: (state, action: PayloadAction<number>) => {
      state.editingIndex = action.payload;
    },
  },
});

export const { setIsEditing, setEditingIndex } = EditDialogSlice.actions;

export const EditDialogReducer = combineReducers({
  EditDialog: EditDialogSlice.reducer,
});