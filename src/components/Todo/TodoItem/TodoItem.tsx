import * as React from "react";
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import FindReplaceOutlinedIcon from '@mui/icons-material/FindReplaceOutlined';
import SmsFailedOutlinedIcon from '@mui/icons-material/SmsFailedOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";

import { deleteLoading, pushLoading } from "components/Loading/Loading_slice";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import {
  setEditDialogId,
  setShowEditDialog,
} from "components/Todo/EditDialog/EditDialog_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { db, DBTodoRecord, DBTodoRecordStatus } from "database/db";
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";

const TodoItem = ({
  todoRecord
}: {
  todoRecord: DBTodoRecord
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { } = useIndexSelector((state) => {
    return {
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [showDeleteWarning, setShowDeleteWarning] = React.useState(false);

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const deleteWarningConfirmOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Todo_TodoItem_delete));

      if (todoRecord.id === undefined) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Haven't select todo record to be delete", variant: "error" }))
        return;
      } else {
        // Delete stock record
        await db.todoRecordStore.delete(todoRecord.id);

        // Close dialog
        setShowDeleteWarning(false);

        // Success stackbar
        dispatch(pushNotificationArray({ message: "Success to delete todo record", variant: "success" }))
        return;
      }
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to delete todo record", variant: "error" }))
    } finally {
      dispatch(deleteLoading(LoadingString.components_Todo_TodoItem_delete));
    }
  }, []);

  const todoItemDeleteButtonOnclick = React.useCallback(() => {
    setShowDeleteWarning(true);
  }, []);

  const todoItemButtonOnclick = React.useCallback(() => {
    dispatch(setEditDialogId(todoRecord.id));
    dispatch(setShowEditDialog(true));
  }, []);

  const ItemListIcon = React.useCallback(() => {
    let Icon;

    switch (todoRecord.status) {
      case DBTodoRecordStatus.done:
        Icon = <DoneOutlinedIcon color="success" />;
        break;
      case DBTodoRecordStatus.progress:
        Icon = <FindReplaceOutlinedIcon />;
        break;
      case DBTodoRecordStatus.pending:
        Icon = <PendingOutlinedIcon color="disabled"/>;
        break;
      case DBTodoRecordStatus.failed:
        Icon = <SmsFailedOutlinedIcon color="error" />;
        break;
    }

    return Icon;
  }, [todoRecord.status])

  return (<>
    <Dialog
      open={showDeleteWarning}
      onClose={() => setShowDeleteWarning(false)}

    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Confirm to delete todo record?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Box
          display="flex"
          justifyContent="center"
          style={{
            width: "100%"
          }}
        >
          <Button
            onClick={deleteWarningConfirmOnclick}
            color="error"
          >
            Confirm
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={todoItemDeleteButtonOnclick}
        >
          <DeleteIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton
        onClick={todoItemButtonOnclick}
      >
        <ListItemAvatar>
          <ItemListIcon />
        </ListItemAvatar>
        <ListItemText
          primary={todoRecord['thing']}
        />
      </ListItemButton>
    </ListItem>
  </>);
}

export default TodoItem;