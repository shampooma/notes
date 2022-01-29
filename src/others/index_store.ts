import { configureStore } from '@reduxjs/toolkit'
import { appReducer } from "others/App_slice"
import { stockListReducer } from "./StockList/StockList_slice"

const configureStoreArgument = {
  reducer: {
    app: appReducer,
    stockList: stockListReducer,
  },
  // type of getDefaultMiddleware any as I don't know how to set
  middleware: (getDefaultMiddleware: any) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['app/setDb'],
      ignoredPaths: ['app.db'],
    },
  }),
}

export const createStore = () => configureStore(configureStoreArgument);

const store = configureStore(configureStoreArgument);
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
