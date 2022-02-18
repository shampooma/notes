import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { DBDocumentStoreItemV2 } from "indexeddb/type";
import { setArrayIndex, setEditingDocumentItem } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice";

import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { setDocumentIndex } from "components/index/index_slice";
import * as React from 'react';
import { Button } from "@mui/material";
import { DBStoreNameV2 } from "indexeddb/type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { LoadingString } from 'components/Loading/Loading_type';
import { setDrawerArray } from "components/Drawer/Drawer_slice";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";

const DocumentItem = ({
  item,
  i
}: {
  item: DBDocumentStoreItemV2,
  i: number
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { db, editingDocumentArray, documentArray } = useIndexSelector((state) => {
    return {
      db: state.index.db as IDBDatabase,
      editingDocumentArray: state.Drawer.editDrawerArray.editingDocumentArray,
      documentArray: state.Drawer.drawer.documentArray,
    }
  });

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
  const itemOnclick = React.useCallback(() => {
    if (editingDocumentArray) {
      dispatch(setArrayIndex(i));
      dispatch(setEditingDocumentItem(true));
    } else {
      dispatch(setDocumentIndex(i));
    }
  }, [editingDocumentArray]);

  /**
   * Depends on documentArray
   */
  const deleteButtonOnclick = React.useCallback(async () => {
    setShowDeleteWarning(true);
  }, [])

  const DeleteButtonElement = React.useCallback(() => {
    if (editingDocumentArray) {
      return (<Button
        color="error"
        onClick={deleteButtonOnclick}
      >
        <DeleteOutlineIcon />
      </Button>)
    } else {
      return (<></>)
    }
  }, [editingDocumentArray]);

  const deleteWarningConfirmOnclick = React.useCallback(async () => {
    dispatch(pushLoading(LoadingString.components_Drawer_DocumentItem_deleteDocument));

    try {
      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.documentStore, "readwrite").objectStore(DBStoreNameV2.documentStore).delete(documentArray[i].id);

        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }

        request.onsuccess = () => {
          res(0);
        }
      });

      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.documentStore, "readonly").objectStore(DBStoreNameV2.documentStore).getAll()

        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }

        request.onsuccess = () => {
          console.log(request.result)
          dispatch(setDocumentIndex(-1))
          dispatch(setDrawerArray(request.result));
          res(0);
        }
      });

    } catch (e) {
      console.log(e);
    } finally {
      setShowDeleteWarning(false);
      dispatch(deleteLoading(LoadingString.components_Drawer_DocumentItem_deleteDocument));
    }
  },  [documentArray]);

  return (
    <>
      <Dialog
        open={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm to delete {documentArray[i].name}?
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

      <Box
        sx={{ display: 'flex' }}
        key={i}
      >

        <DeleteButtonElement />
        <ListItemButton
          alignItems="flex-start"
          onClick={itemOnclick}
        >
          <ListItemText
            primary={item.name}
            secondary={item.type}
          />
        </ListItemButton>
      </Box>
    </>
  );
}

export default DocumentItem;
