import { createSlice, combineReducers, PayloadAction } from '@reduxjs/toolkit';
import { VariantType } from 'notistack';


export interface stackbarInterface {
  message: string,
  variant: VariantType
}

export const StackbarSlice = createSlice({ // Slice copntains reducers and actions
  name: 'Stackbar',
  initialState: {
    notificationArray: [],
  } as {
    notificationArray: stackbarInterface[],
  },
  reducers: {
    pushNotificationArray: (state, action: PayloadAction<stackbarInterface>) => {
      state.notificationArray.push(action.payload);
    },
    shiftNotificationArray: (state) => {
      state.notificationArray.shift();
    },
  },
});

export const { pushNotificationArray, shiftNotificationArray } = StackbarSlice.actions;

export const StackbarReducer = combineReducers({
  Stackbar: StackbarSlice.reducer,
});