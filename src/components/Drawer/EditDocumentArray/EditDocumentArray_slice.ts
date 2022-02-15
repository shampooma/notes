import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export const editDrawerArraySlice = createSlice({ // Slice copntains reducers and actions
  name: 'EditDrawerArray',
  initialState: {
    arrayIndex: -1, // State how to use
    editingDocumentArray: false,
    editingDocumentItem: false,
  } as {
    arrayIndex: number,
    editingDocumentArray: boolean,
    editingDocumentItem: boolean,
  },
  reducers: {
    setArrayIndex: (state, action: PayloadAction<number>) => {
      state.arrayIndex = action.payload;
    },
    setEditingDocumentArray: (state, action: PayloadAction<boolean>) => {
      state.editingDocumentArray = action.payload;
    },
    setEditingDocumentItem: (state, action: PayloadAction<boolean>) => {
      state.editingDocumentItem = action.payload;
    },
  },
});

export const { // Return actions
  setArrayIndex,
  setEditingDocumentArray,
  setEditingDocumentItem,
} = editDrawerArraySlice.actions
