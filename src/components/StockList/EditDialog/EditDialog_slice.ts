import { createSlice } from '@reduxjs/toolkit'

export const editDialogSlice = createSlice({
  name: "EditDialog",
  initialState: {
    index: -1,
    showDialog: false
  } as {
    index: number,
    showDialog: boolean,
  },
  reducers: {
    setEditDialogIndex: (state, action) => {
      state.index = action.payload;
    },
    setShowEditDialog: (state, action) => {
      state.showDialog = action.payload;
    }
  },
})

export const {
  setEditDialogIndex,
  setShowEditDialog
} = editDialogSlice.actions

export const editDialogReducer = editDialogSlice.reducer