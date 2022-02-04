import { configureStore } from "@reduxjs/toolkit";
import { indexReducer } from "components/index/index_slice";
import { stockListReducer } from "components/StockList/StockList_slice";
import { DrawerReducer } from "components/Drawer/Drawer_slice";
import { LoadingReducer } from "components/Loading/Loading_slice";

const configureStoreArgument = {
  reducer: {
    index: indexReducer,
    stockList: stockListReducer,
    Drawer: DrawerReducer,
    Loading: LoadingReducer,
  },
  // type of getDefaultMiddleware any as I don't know how to set
  middleware: (getDefaultMiddleware: any) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['index/setDb'],
      ignoredPaths: ['index.db'],
    },
  }),
}

export const createStore = () => configureStore(configureStoreArgument);

const store = configureStore(configureStoreArgument);
export type RootState = ReturnType<typeof store.getState>
export type IndexDispatch = typeof store.dispatch
