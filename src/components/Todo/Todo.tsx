import * as React from "react";
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import List from "@mui/material/List";
import IconButton from '@mui/material/IconButton';
import { LoadingString } from "components/Loading/Loading_type";
import EditDialog from "components/Todo/EditDialog/EditDialog";
import TodoItem from 'components/Todo/TodoItem/TodoItem';
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { db, DBTodoRecordStatus } from "database/db";
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
  const todoRecordArray = useLiveQuery(
    () => db.todoRecordStore
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
      dispatch(pushLoading(LoadingString.components_Todo_Todo_add));

      // New stock record values
      const newTodoRecord = {
        documentId: interactingDocumentId,
        thing: "new todo",
        status: DBTodoRecordStatus.pending,
      }

      // Add stock record
      await db.todoRecordStore.add(newTodoRecord);

      // Success stackbar
      dispatch(pushNotificationArray({ message: "Success to add todo record", variant: "success"}))
      return
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to add todo record", variant: "error"}))
    } finally {
      dispatch(deleteLoading(LoadingString.components_Todo_Todo_add))
    }
  }, [interactingDocumentId]);

  return (<>
    <EditDialog />
    <List>
      {todoRecordArray && todoRecordArray.map((todoRecord) => {
        return (<TodoItem
          key={todoRecord.id}
          todoRecord={todoRecord}
        />)
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
