import * as React from "react";
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
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
} from "components/StockList/EditDialog/EditDialog_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { db, DBStockRecord } from "database/db";
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";

const StockListItem = ({
  stockRecord
}: {
  stockRecord: DBStockRecord
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
      dispatch(pushLoading(LoadingString.components_StockList_StockistItem_deleteItem));

      if (stockRecord.id === undefined) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Haven't select stock record to be delete", variant: "error"}))
        return;
      } else {
        // Delete stock record
        await db.stockRecordStore.delete(stockRecord.id);

        // Close dialog
        setShowDeleteWarning(false);

        // Success stackbar
        dispatch(pushNotificationArray({ message: "Success to delete stock record", variant: "success"}))
        return;
      }
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to delete stock record", variant: "error"}))
    } finally {
      dispatch(deleteLoading(LoadingString.components_StockList_StockistItem_deleteItem));
    }
  }, []);

  const stockListItemDeleteButtonOnclick = React.useCallback(() => {
    setShowDeleteWarning(true);
  }, []);

  const stockListItemButtonOnclick = React.useCallback(() => {
    dispatch(setEditDialogId(stockRecord.id));
    dispatch(setShowEditDialog(true));
  }, []);

  return (<>
    <Dialog
      open={showDeleteWarning}
      onClose={() => setShowDeleteWarning(false)}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Confirm to delete {stockRecord.name}?
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
          <Button onClick={deleteWarningConfirmOnclick} color="error">
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
          onClick={stockListItemDeleteButtonOnclick}
        >
          <DeleteIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton
        onClick={stockListItemButtonOnclick}
      >
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={stockRecord['name']}
          secondary={`Price: ${stockRecord['price']} | Position: ${stockRecord['position']}`}
        />
      </ListItemButton>
    </ListItem>
  </>);
}

export default StockListItem;