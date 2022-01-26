import * as React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import * as indexEnum from "others/App_enum";
import * as StockListClass from "others/StockList/StockList_type";
import { setItems } from "others/StockList/StockList_slice";
import { setLoading } from "others/App_slice";
import { useAppSelector, useAppDispatch } from "others/index_hooks";
import {
  setName,
  setPrice,
  setPosition,
  setShowEditDialog
} from "others/StockList/EditDialog_slice";

const EditDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useAppDispatch()
  const {
    db,
    items,
    showEditDialog,
    editDialogName,
    editDialogPrice,
    editDialogPosition,
    editDialogIndex,
  } = useAppSelector((state) => {
    return {
      db: state.app.db as IDBDatabase, //Checked in index.tsx
      items: state.stockList.stockList.items,
      showEditDialog: state.stockList.editDialog.showDialog,
      editDialogName: state.stockList.editDialog.name,
      editDialogPrice: state.stockList.editDialog.price,
      editDialogPosition: state.stockList.editDialog.position,
      editDialogIndex: state.stockList.editDialog.index,
    }
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const updateButtonOnclick = React.useCallback(() => {
    dispatch(setLoading(true));

    const updateItem: StockListClass.UpdateItem = {
      name: editDialogName,
      price: Number(editDialogPrice),
      position: Number(editDialogPosition),
      id: items[editDialogIndex]['id']
    }

    // putRequest start
    const putRequest = db.transaction(indexEnum.DBStoreName.stockStore, 'readwrite').objectStore(indexEnum.DBStoreName.stockStore).put(updateItem);

    // putRequest error
    putRequest.onerror = (e) => {
      console.log(e);
      dispatch(setLoading(true));
    }

    putRequest.onsuccess = () => {
      // getAllRequest start
      const getAllRequest = db.transaction(indexEnum.DBStoreName.stockStore, 'readwrite').objectStore(indexEnum.DBStoreName.stockStore).getAll();

      // getAllRequest error
      getAllRequest.onerror = (e) => {
        console.log(e);
        dispatch(setLoading(false));
      }

      // getAllRequest success
      getAllRequest.onsuccess = () => {
        dispatch(setItems(getAllRequest.result));
        dispatch(setShowEditDialog(false));
        dispatch(setLoading(false));
      }
    }
  }, [
    db,
    editDialogName,
    editDialogPrice,
    editDialogPosition,
    editDialogIndex
  ]);

  const closeDialog = React.useCallback(() => {
    dispatch(setShowEditDialog(false));
  }, []);

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
          Update
        </DialogTitle>
      </Box>
      <DialogContent>
        <div>
          <TextField
            margin="dense"
            id="name"
            label="Name"
            type="text"
            value={editDialogName}
            variant="standard"
            onChange={(e) => {
              dispatch(setName(e.target.value));
            }}
          />
        </div>
        <div>
          <TextField
            margin="dense"
            id="price"
            label="Price"
            type="text"
            value={editDialogPrice}
            variant="standard"
            inputProps={{ inputMode: 'numeric' }}
            onChange={(e) => {
              if (/^[0-9]*$/.test(e.target.value)) {
                dispatch(setPrice(e.target.value));
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
            value={editDialogPosition}
            variant="standard"
            inputProps={{ inputMode: 'numeric' }}
            onChange={(e) => {
              if (/^[0-9]*$/.test(e.target.value)) {
                dispatch(setPosition(e.target.value));
              }
            }}
          />
        </div>
      </DialogContent>
      <Box
        display="flex"
        justifyContent="center"
      >
        <DialogActions>
          <Button onClick={updateButtonOnclick}>Update</Button>
        </DialogActions>
      </Box>
    </Dialog>

  );
}

export default EditDialog
