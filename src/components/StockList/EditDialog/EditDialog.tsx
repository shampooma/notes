import * as React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { setStockList } from "components/StockList/StockList_slice";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import {
  setName,
  setPrice,
  setPosition,
  setShowEditDialog
} from "components/StockList/EditDialog/EditDialog_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { DBStoreNameV2, DBStockStoreItemV2 } from "indexeddb/type";

const EditDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch()
  const {
    db,
    showEditDialog,
    editDialogName,
    editDialogPrice,
    editDialogPosition,
    editDialogIndex,
    documentIndex,
    documentArray,
  } = useIndexSelector((state) => {
    return {
      db: state.index.db as IDBDatabase, //Checked in index.tsx
      showEditDialog: state.stockList.editDialog.showDialog,
      editDialogName: state.stockList.editDialog.name,
      editDialogPrice: state.stockList.editDialog.price,
      editDialogPosition: state.stockList.editDialog.position,
      editDialogIndex: state.stockList.editDialog.index,
      documentIndex: state.index.documentIndex,
      documentArray: state.Drawer.documentArray,
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
  const updateButtonOnclick = React.useCallback(async() => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_EditDialog_update));

      // Read stockStoreItem
      const stockStoreItem = await new Promise<DBStockStoreItemV2>((res, rej) => {
        const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readwrite').objectStore(DBStoreNameV2.stockRecordStore).get(documentArray[documentIndex].recordId);

        request.onerror = (e) => {
          rej(e);
        }

        request.onsuccess = () => {
          res(request.result);
        }
      });

      // Put stockRecord
      stockStoreItem.stockRecordArray[editDialogIndex] = {
        name: editDialogName,
        price: Number(editDialogPrice),
        position: Number(editDialogPosition),
      }

      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readwrite').objectStore(DBStoreNameV2.stockRecordStore).put(stockStoreItem);

        request.onerror = (e) => {
          rej(e);
        }

        request.onsuccess = () => {
          res(0);
        }
      })

      // Read stockArray
      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readonly').objectStore(DBStoreNameV2.stockRecordStore).get(documentArray[documentIndex].recordId);

        request.onerror = (e) => {
          rej(e);
        }

        request.onsuccess = () => {
          dispatch(setStockList(request.result.stockRecordArray));

          res(0);
        }
      });

      dispatch(deleteLoading(LoadingString.components_StockList_EditDialog_update));
    } catch (e) {
      console.log(e);
      dispatch(deleteLoading(LoadingString.components_StockList_EditDialog_update));
    }
  }, [
    db,
    editDialogName,
    editDialogPrice,
    editDialogPosition,
    editDialogIndex,
    documentIndex,
    documentArray,
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
