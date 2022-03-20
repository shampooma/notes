import "components/StockList/EditDialog/EditDialog.css";

import * as React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import {
  setShowEditDialog
} from "components/StockList/EditDialog/EditDialog_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { IconButton } from "@mui/material";
import { db } from "database/db";
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";
import { useLiveQuery } from "dexie-react-hooks";

const EditDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch()
  const {
    showEditDialog,
    editDialogId,
  } = useIndexSelector((state) => {
    return {
      showEditDialog: state.stockList.editDialog.showDialog,
      editDialogId: state.stockList.editDialog.id,
    }
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [editingName, setEditingName] = React.useState(false);
  const [editAction, setEditAction] = React.useState(0); // 0 = add, 1 = delete
  const [deletePosition, setDeletePosition] = React.useState("0");
  const [addPosition, setAddPosition] = React.useState("0");
  const [addPrice, setAddPrice] = React.useState("0");
  const [updateName, setUpdateName] = React.useState("");

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  const editingStockRecord = useLiveQuery(
    () => db.stockRecordStore.get(editDialogId),
    [editDialogId]
  )

  React.useEffect(() => {
    (async () => {
      if (editingStockRecord === undefined) {
        return;
      } else {
        setDeletePosition("0");
        setAddPrice("0");
        setAddPosition("0");
        setUpdateName(editingStockRecord["name"]);
      }
    })()
  }, [editingStockRecord]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const addStockButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_EditDialog_addStock));

      if (Number(addPosition) === 0) {
        // Warning stackbar
        dispatch(pushNotificationArray({ message: "Position to be add equals 0", variant: "warning"}))
        return
      } else if (editingStockRecord === undefined) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Haven't select stock record to be edit", variant: "error"}))
        return;
      } else {
        // Calculate update values
        const { price: oldPrice, position: oldPosition } = editingStockRecord;

        const updateValues = {
          price: (oldPrice * oldPosition + Number(addPrice) * Number(addPosition)) / (oldPosition + Number(addPosition)),
          position: (oldPosition + Number(addPosition))
        }

        // Update stock record
        await db.stockRecordStore.update(editDialogId, updateValues);

        // Success stackbar
        dispatch(pushNotificationArray({ message: `Success to add stock data with price ${addPrice} and position ${addPosition}`, variant: "success"}))
        return
      }
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to add stock data", variant: "error"}))
    } finally {
      dispatch(deleteLoading(LoadingString.components_StockList_EditDialog_addStock));
    }
  }, [
    addPosition,
    addPrice,
    editDialogId,
    editingStockRecord,
  ]);

  const deleteStockButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_EditDialog_deleteStock))

      if (editingStockRecord === undefined) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Haven't select stock record to be edit", variant: "error"}))
        return;
      } else {
        // Calculate update values
        const updateValues = {} as {
          price: number,
          position: number,
        }

        if (editingStockRecord.position - Number(deletePosition) <= 0) {
          updateValues.price = 0;
          updateValues.position = 0;
        } else {
          updateValues.position = editingStockRecord.position - Number(deletePosition)
        }

        // Update stock record
        await db.stockRecordStore.update(editDialogId, updateValues);

        // Success stackbar
        dispatch(pushNotificationArray({ message: `Success to delete ${deletePosition} position`, variant: "success"}))
        return;
      }
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to delete position", variant: "error"}))
    } finally {
      dispatch(deleteLoading(LoadingString.components_StockList_EditDialog_deleteStock))
    }
  }, [
    deletePosition,
    editDialogId,
    editingStockRecord
  ]);

  const closeDialog = React.useCallback(() => {
    dispatch(setShowEditDialog(false));
    setEditingName(false);
  }, []);

  const editNameIconButtonOnclick = React.useCallback(() => {
    setEditingName(true);
  }, []);

  const updateNameIconButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_EditDialog_updateName))

      // Calculate update values
      const updateValues = {
        name: updateName
      }

      // Update stock record
      await db.stockRecordStore.update(editDialogId, updateValues);

      // Set editing name false
      setEditingName(false);

      // Success stackbar
      dispatch(pushNotificationArray({ message: "Success to update name", variant: "success"}))
      return
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to update name", variant: "error"}))
    } finally {
      dispatch(deleteLoading(LoadingString.components_StockList_EditDialog_updateName))
    }
  }, [editDialogId, updateName]);

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (
    <Dialog
      open={showEditDialog}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Box
        display="flex"
        justifyContent="center"
      >
        <DialogTitle id="alert-dialog-title">
          <TextField
            disabled={!editingName}
            InputProps={{
              disableUnderline: !editingName,
              inputProps: {
                style: {
                  textAlign: "center"
                }
              }
            }}
            margin="dense"
            id="name"
            type="text"
            value={updateName}
            variant="standard"
            onChange={(e) => {
              setUpdateName(e.target.value);
            }}
          />
          <IconButton
            onClick={editingName ? updateNameIconButtonOnclick : editNameIconButtonOnclick}
          >
            {
              editingName ?
                <DoneIcon></DoneIcon> :
                <EditIcon></EditIcon>
            }
          </IconButton>
        </DialogTitle>
      </Box>
      <DialogContent
        style={{
          height: "200px"
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={editAction} onChange={(e, v) => setEditAction(v)} aria-label="basic tabs example">
            <Tab label="Add" />
            <Tab label="Delete" />
          </Tabs>
        </Box>
        {
          editAction === 0 ?
            <>
              <div>
                <TextField
                  margin="dense"
                  id="price"
                  label="Price"
                  type="text"
                  value={addPrice}
                  variant="standard"
                  inputProps={{ inputMode: 'numeric' }}
                  onChange={(e) => {
                    if (/^[0-9]*$/.test(e.target.value)) {
                      setAddPrice(e.target.value);
                    }
                  }}
                />
              </div>
              <div>
                <TextField
                  margin="dense"
                  id="position"
                  label="position"
                  type="text"
                  value={addPosition}
                  variant="standard"
                  inputProps={{ inputMode: 'numeric' }}
                  onChange={(e) => {
                    if (/^[0-9]*$/.test(e.target.value)) {
                      setAddPosition(e.target.value);
                    }
                  }}
                />
              </div>
            </> :
            <>
              <div>
                <TextField
                  margin="dense"
                  id="position"
                  label="position"
                  type="text"
                  value={deletePosition}
                  variant="standard"
                  inputProps={{ inputMode: 'numeric' }}
                  onChange={(e) => {
                    if (/^[0-9]*$/.test(e.target.value)) {
                      setDeletePosition(e.target.value);
                    }
                  }}
                />
              </div>
            </>
        }

      </DialogContent>
      <Box
        display="flex"
        justifyContent="center"
      >
        <DialogActions>
          {
            editAction === 0 ?
              <Button onClick={addStockButtonOnclick}>Add</Button> :
              <Button onClick={deleteStockButtonOnclick}>Delete</Button>
          }
        </DialogActions>
      </Box>
    </Dialog>

  );
}

export default EditDialog
