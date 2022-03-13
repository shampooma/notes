import * as React from "react";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import List from "@mui/material/List";
import IconButton from '@mui/material/IconButton';

import { LoadingString } from "components/Loading/Loading_type";
import EditDialog from "./EditDialog/EditDialog";
import { setStockList } from "components/StockList/StockList_slice"
import CustomListItem from './CustomListItem/CustomListItem';
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { db } from "database/db";

const StockList = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch()
  const { stockRecordArray, documentIndex, documentArray } = useIndexSelector((state) => {
    return {
      stockRecordArray: state.stockList.stockList.stockRecordArray,
      documentIndex: state.index.documentIndex,
      documentArray: state.Drawer.drawer.documentArray,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |
  // Get stockRecordArray
  React.useEffect(() => {
    (async () => {
      dispatch(pushLoading(LoadingString.components_StockList_StockList_getStockRecords));

      try {
        const stockRecord = await db.stockRecordStore.get(documentArray[documentIndex].recordId)

        if (stockRecord === undefined) return;

        dispatch(setStockList(stockRecord.stockRecordArray));
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(deleteLoading(LoadingString.components_StockList_StockList_getStockRecords));
      }
    })()
  }, [documentIndex]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const centerAddButtonOnclick = React.useCallback(async () => {
    dispatch(pushLoading(LoadingString.components_StockList_StockList_add));
    
    try {
      // Read stockStoreItem
      let stockRecord = await db.stockRecordStore.get(documentArray[documentIndex].recordId);

      if (stockRecord === undefined) return;

      // Push stockRecordArray of stockStoreItem
      const newStockItem = {
        name: "newStock",
        position: 0,
        price: 0,
      }

      stockRecord.stockRecordArray.push(newStockItem);

      await db.stockRecordStore.put(stockRecord);

      // Update stockRecordArray global state
      stockRecord = await db.stockRecordStore.get(documentArray[documentIndex].recordId);

      if (stockRecord === undefined) return;

      dispatch(setStockList(stockRecord.stockRecordArray));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_StockList_StockList_add))
    }
  }, [documentArray, documentIndex]);

  return (
    <main>
      <title>Home Page</title>
      <EditDialog></EditDialog>

      <List>
        {stockRecordArray.map((stockRecord, i) => {

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
