import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const editDrawerArraySlice = createSlice({ // Slice copntains reducers and actions
  name: 'EditDrawerArray',
  initialState: {
    editingDocumentId: -1, // State how to use
    isEditingDocumentArray: false,
    isEditingDocumentItem: false,
  } as {
    editingDocumentId: number,
    isEditingDocumentArray: boolean,
    isEditingDocumentItem: boolean,
  },
  reducers: {
    setEditingDocumentId: (state, action: PayloadAction<number>) => {
      state.editingDocumentId = action.payload;
    },
    setIsEditingDocumentArray: (state, action: PayloadAction<boolean>) => {
      state.isEditingDocumentArray = action.payload;
    },
    setIsEditingDocumentItem: (state, action: PayloadAction<boolean>) => {
      state.isEditingDocumentItem = action.payload;
    },
  },
});

export const { // Return actions
  setEditingDocumentId,
  setIsEditingDocumentArray,
  setIsEditingDocumentItem,
} = editDrawerArraySlice.actions
