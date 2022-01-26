import * as React from "react";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import List from "@mui/material/List";
import IconButton from '@mui/material/IconButton';

import * as indexEnum from "others/App_enum";
import * as StockListType from "others/StockList/StockList_type";
import EditDialog from "./EditDialog";
import { setItems } from "others/StockList/StockList_slice"
import CustomListItem from './CustomListItem';
import { setLoading } from "others/App_slice";
import { useAppSelector, useAppDispatch } from "others/index_hooks"

const StockList = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useAppDispatch()
  const {db, items} = useAppSelector((state) => {
    return {
      db: state.app.db as IDBDatabase, //Checked in index.tsx
      items: state.stockList.stockList.items
    }
  });

  // Local state

  // useEffect
  React.useEffect(() => {
    dispatch(setLoading(true))

    const getAllRequest = db.transaction(indexEnum.DBStoreName.stockStore, 'readwrite').objectStore(indexEnum.DBStoreName.stockStore).getAll();

    getAllRequest.onsuccess = () => {
      dispatch(setItems(getAllRequest.result))

      dispatch(setLoading(false));
    }

    getAllRequest.onerror = (e) => {
      console.log(e)
      dispatch(setLoading(false));
    }
  }, [db]);

  // Functions
  const centerAddButtonOnclick = React.useCallback(() => {
    dispatch(setLoading(true));

    const newItem: StockListType.AddItem = {
      name: "newItem",
      price: 0,
      position: 0
    }

    const addItemRequest = db.transaction(indexEnum.DBStoreName.stockStore, 'readwrite').objectStore(indexEnum.DBStoreName.stockStore).add(newItem);

    addItemRequest.onsuccess = () => {
      const getAllRequest = db.transaction(indexEnum.DBStoreName.stockStore, 'readwrite').objectStore(indexEnum.DBStoreName.stockStore).getAll();

      getAllRequest.onsuccess = () => {
        dispatch(setItems(getAllRequest.result));

        dispatch(setLoading(false));
      }

      getAllRequest.onerror = (e) => {
        console.log(e);
        dispatch(setLoading(false));
      }
    }

    addItemRequest.onerror = (e) => {
      console.log(e);
      dispatch(setLoading(false));
    }
  }, [db]);

  return (
    <main>
      <title>Home Page</title>
      <EditDialog></EditDialog>

      <List>
        {items.map((item, i) => {

          return (<CustomListItem
            key={i}
            index={i}
          ></CustomListItem>)
        })}
      </List>
      <Box
        display="flex"
        justifyContent="center"
      >
        <IconButton
          edge="end"
          aria-label="add"
          onClick={centerAddButtonOnclick}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </main>
  )
}

export default StockList
