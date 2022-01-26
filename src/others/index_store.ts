import { configureStore } from '@reduxjs/toolkit'
import appReducer from "others/App_slice"
import stockListReducer from "./StockList/StockList_slice"

const configureStoreArgument = {
  reducer: {
    app: appReducer,
    stockList: stockListReducer,
  },
}

export const createStore = () => configureStore(configureStoreArgument);

const store = configureStore(configureStoreArgument);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
