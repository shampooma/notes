import { createSlice } from '@reduxjs/toolkit'

export const editDialogSlice = createSlice({
  name: 'editDialog',
  initialState: {
    name: "",
    price: "",
    position: "",
    index: -1,
    showDialog: false
  } as {
    name: string,
    price: string,
    position: string,
    index: number,
    showDialog: boolean,
  },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setPrice: (state, action) => {
      state.price = action.payload;
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    setEditDialogContent: (state, action) => {
      state.name = action.payload.name;
      state.price = action.payload.price;
      state.position = action.payload.position;
    },
    setEditDialogIndex: (state, action) => {
      state.index = action.payload;
    },
    setShowEditDialog: (state, action) => {
      state.showDialog = action.payload;
    }
  },
})

export const {
  setName,
  setPrice,
  setPosition,
  setEditDialogContent,
  setEditDialogIndex,
  setShowEditDialog
} = editDialogSlice.actions

export const editDialogReducer = editDialogSlice.reducer