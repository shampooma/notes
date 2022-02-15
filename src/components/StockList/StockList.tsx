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
import { DBStockStoreItemV2, DBStockRecordV2, DBStoreNameV2 } from "indexeddb/type";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"

const StockList = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch()
  const { db, stockRecordArray, documentIndex, documentArray } = useIndexSelector((state) => {
    return {
      db: state.index.db as IDBDatabase, //Checked in index.tsx
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
  React.useEffect(() => {
    (async () => {
      try {
        // Get stockRecordArray
        dispatch(pushLoading(LoadingString.components_StockList_StockList_getStockRecords))

        await new Promise((res, rej) => {
          const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readonly').objectStore(DBStoreNameV2.stockRecordStore).get(documentArray[documentIndex].recordId);

          request.onerror = (e) => {
            rej(e);
          }

          request.onsuccess = () => {
            dispatch(setStockList(request.result.stockRecordArray));

            res(0);
          }
        })

        dispatch(deleteLoading(LoadingString.components_StockList_StockList_getStockRecords));
      } catch (e) {
        console.log(e);
        dispatch(deleteLoading(LoadingString.components_StockList_StockList_getStockRecords));
      }
    })()
  }, [db, documentIndex]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const centerAddButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_StockList_add));

      // Read stockStoreItem
      const stockStoreItem = await new Promise<DBStockStoreItemV2>((res, rej) => {
        const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readonly').objectStore(DBStoreNameV2.stockRecordStore).get(documentArray[documentIndex].recordId);

        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }

        request.onsuccess = () => {
          res(request.result);
        }
      });

      // Push stockRecordArray of stockStoreItem
      const newStockItem = {
        name: "newStock",
        position: 0,
        price: 0,
      }

      stockStoreItem.stockRecordArray.push(newStockItem);

      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readwrite').objectStore(DBStoreNameV2.stockRecordStore).put(stockStoreItem);

        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }

        request.onsuccess = () => {
          res(0);
        }
      });

      // Read stockStoreItem
      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readonly').objectStore(DBStoreNameV2.stockRecordStore).get(documentArray[documentIndex].recordId);

        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }

        request.onsuccess = () => {
          dispatch(setStockList(request.result.stockRecordArray));

          res(0);
        }
      });

      // End
      dispatch(deleteLoading(LoadingString.components_StockList_StockList_add))
    } catch (e) {
      console.log(e);
      dispatch(deleteLoading(LoadingString.components_StockList_StockList_add))
    }
  }, [db]);

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
