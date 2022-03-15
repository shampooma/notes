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

import { setStockList } from "components/StockList/StockList_slice";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import {
  setShowEditDialog
} from "components/StockList/EditDialog/EditDialog_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { IconButton } from "@mui/material";
import { db } from "database/db";

const EditDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch()
  const {
    showEditDialog,
    editDialogIndex,
    documentIndex,
    documentArray,
    stockRecordArray,
  } = useIndexSelector((state) => {
    return {
      showEditDialog: state.stockList.editDialog.showDialog,
      editDialogIndex: state.stockList.editDialog.index,
      documentIndex: state.index.documentIndex,
      documentArray: state.Drawer.drawer.documentArray,
      stockRecordArray: state.stockList.stockList.stockRecordArray,
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
  React.useEffect(() => {
    if (editDialogIndex > -1 && showEditDialog) {
      setDeletePosition("0");
      setAddPrice("0");
      setAddPosition("0");
      setUpdateName(stockRecordArray[editDialogIndex]["name"]);
    }
  }, [showEditDialog]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const addStockButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_EditDialog_update));

      if (Number(addPosition) == 0) {
        return;
      }

      // Read stockRecord
      let stockRecord = await db.stockRecordStore.get(documentArray[documentIndex].recordId);

      if (stockRecord === undefined) return;

      // Put stockRecord
      const { price: oldPrice, position: oldPosition } = stockRecord.stockRecordArray[editDialogIndex];

      stockRecord.stockRecordArray[editDialogIndex]["price"] = (oldPrice * oldPosition + Number(addPrice) * Number(addPosition)) / (oldPosition + Number(addPosition));
      stockRecord.stockRecordArray[editDialogIndex]["position"] = (oldPosition + Number(addPosition))

      await db.stockRecordStore.put(stockRecord);

      // Read stockArray
      stockRecord = await db.stockRecordStore.get(documentArray[documentIndex].recordId);

      if (stockRecord === undefined) return;

      dispatch(setStockList(stockRecord.stockRecordArray));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_StockList_EditDialog_update));
    }
  }, [
    addPosition,
    addPrice,
    editDialogIndex,
    documentIndex,
    documentArray,
  ]);

  const deleteStockButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_EditDialog_deleteStock))

      // Read stockRecord
      let stockRecord = await db.stockRecordStore.get(documentArray[documentIndex].recordId);

      if (stockRecord === undefined) return;

      // Delete stock
      stockRecord.stockRecordArray[editDialogIndex].position -= Number(deletePosition);

      const request = db.stockRecordStore.put(stockRecord);

      // Read stockRecordArray
      stockRecord = await db.stockRecordStore.get(documentArray[documentIndex].recordId);

      if (stockRecord === undefined) return;

      dispatch(setStockList(stockRecord.stockRecordArray));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_StockList_EditDialog_deleteStock))
    }
  }, [deletePosition, editDialogIndex]);

  const closeDialog = React.useCallback(() => {
    dispatch(setShowEditDialog(false));
    setEditingName(false);
  }, []);

  const editNameIconButtonOnclick = React.useCallback(() => {
    setEditingName(true);
  }, []);

  const updateNameIconButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_EditDialog_update))

      // Read stockRecord
      let stockRecord = await db.stockRecordStore.get(documentArray[documentIndex].recordId);

      if (stockRecord === undefined) return;

      // Update stock
      stockRecord.stockRecordArray[editDialogIndex].name = updateName

      const request = db.stockRecordStore.put(stockRecord);

      // Read stockRecordArray
      stockRecord = await db.stockRecordStore.get(documentArray[documentIndex].recordId);

      if (stockRecord === undefined) return;

      setEditingName(false);
      dispatch(setStockList(stockRecord.stockRecordArray));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_StockList_EditDialog_update))
    }
  }, [editDialogIndex, updateName, documentIndex]);

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
