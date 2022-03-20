import * as React from "react";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import List from "@mui/material/List";
import IconButton from '@mui/material/IconButton';
import { LoadingString } from "components/Loading/Loading_type";
import EditDialog from "./EditDialog/EditDialog";
import StockListItem from './StockListItem/StockListItem';
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { db } from "database/db";
import { useLiveQuery } from "dexie-react-hooks";
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";

const StockList = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch()
  const { interactingDocumentId } = useIndexSelector((state) => {
    return {
      interactingDocumentId: state.index.interactingDocumentId,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  const stockRecordArray = useLiveQuery(
    () => db.stockRecordStore
      .where("documentId")
      .equals(interactingDocumentId)
      .toArray(),
    [interactingDocumentId]
  )

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const centerAddButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_StockList_add));

      // New stock record values
      const newStockRecord = {
        documentId: interactingDocumentId,
        name: "newStock",
        position: 0,
        price: 0,
      }

      // Add stock record
      await db.stockRecordStore.add(newStockRecord);

      // Success stackbar
      dispatch(pushNotificationArray({ message: "Success to add stock record", variant: "success"}))
      return
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to add stock record", variant: "error"}))
    } finally {
      dispatch(deleteLoading(LoadingString.components_StockList_StockList_add))
    }
  }, [interactingDocumentId]);

  return (<>
    <EditDialog />
    <List>
      {stockRecordArray && stockRecordArray.map((stockRecord) => {
        return (<StockListItem
          key={stockRecord.id}
          stockRecord={stockRecord}
        ></StockListItem>)
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
  </>)
}

export default StockList;
