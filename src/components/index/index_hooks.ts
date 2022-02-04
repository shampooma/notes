import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, IndexDispatch } from "components/index/index_store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useIndexDispatch = () => useDispatch<IndexDispatch>();
export const useIndexSelector: TypedUseSelectorHook<RootState> = useSelector;