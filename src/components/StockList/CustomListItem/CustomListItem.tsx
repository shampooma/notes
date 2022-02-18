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
  setEditDialogIndex,
  setShowEditDialog,
} from "components/StockList/EditDialog/EditDialog_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { DBStockStoreItemV2, DBStoreNameV2 } from "indexeddb/type";
import { setStockList } from "../StockList_slice";

const CustomListItem = ({
  index,
}: {
  index: number,
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { db, stockRecordArray, documentIndex, documentArray } = useIndexSelector((state) => {
    return {
      db: state.index.db as IDBDatabase, //Checked in index.tsx
      stockRecordArray: state.stockList.stockList.stockRecordArray,
      documentIndex: state.index.documentIndex,
      documentArray: state.Drawer.drawer.documentArray,
    }
  });

  if (db === null) return <></>;

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [showDeleteWarning, setShowDeleteWarning] = React.useState(false);


  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const deleteWarningConfirmOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_StockList_CustomListItem_deleteItem));

      // Read stockStoreItem
      const stockStoreItem = await new Promise<DBStockStoreItemV2>((res, rej) => {
        const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readwrite').objectStore(DBStoreNameV2.stockRecordStore).get(documentArray[documentIndex].recordId);

        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }

        request.onsuccess = () => {
          res(request.result);
        }
      });

      // Delete stockRecord
      stockStoreItem.stockRecordArray.splice(index, 1);

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
        const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readwrite').objectStore(DBStoreNameV2.stockRecordStore).get(documentArray[documentIndex].recordId);

        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }

        request.onsuccess = () => {
          dispatch(setStockList(request.result.stockRecordArray))
          res(0);
        }
      });

    } catch (e) {
      console.log(e);
    } finally {
      setShowDeleteWarning(false);
      dispatch(deleteLoading(LoadingString.components_StockList_CustomListItem_deleteItem));
    }
  }, [documentArray, documentIndex]);

  const customListItemDeleteButtonOnclick = React.useCallback(() => {
    setShowDeleteWarning(true);
  }, []);

  const customListItemButtonOnclick = () => {
    dispatch(setEditDialogIndex(index));
    dispatch(setShowEditDialog(true));
  }


  return (<>
    <Dialog
      open={showDeleteWarning}
      onClose={() => setShowDeleteWarning(false)}
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Confirm to delete {stockRecordArray[index].name}?
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
          onClick={customListItemDeleteButtonOnclick}
        >
          <DeleteIcon />
        </IconButton>
      }
      disablePadding
    >
      <ListItemButton
        onClick={customListItemButtonOnclick}
      >
        <ListItemAvatar>
          <Avatar>
            <FolderIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={stockRecordArray[index]['name']}
          secondary={`Price: ${stockRecordArray[index]['price']} | Position: ${stockRecordArray[index]['position']}`}
        />
      </ListItemButton>
    </ListItem>
  </>);
}

export default CustomListItem;