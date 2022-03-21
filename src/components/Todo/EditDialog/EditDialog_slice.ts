import { createSlice } from '@reduxjs/toolkit'

export const editDialogSlice = createSlice({
  name: "EditDialog",
  initialState: {
    id: -1,
    showDialog: false
  } as {
    id: number,
    showDialog: boolean,
  },
  reducers: {
    setEditDialogId: (state, action) => {
      state.id = action.payload;
    },
    setShowEditDialog: (state, action) => {
      state.showDialog = action.payload;
    }
  },
})

export const {
  setEditDialogId,
  setShowEditDialog
} = editDialogSlice.actions

export const editDialogReducer = editDialogSlice.reducer