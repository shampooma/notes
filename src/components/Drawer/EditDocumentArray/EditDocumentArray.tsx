import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { setEditingDocumentItem } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice"; // Import redux actions
import Dialog from "@mui/material/Dialog";
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DBDocumentStoreItemV2, DBDocumentTypeV2, DBStoreNameV2} from "indexeddb/type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { setDrawerList } from "../Drawer_slice";

const EditDrawerArray = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { db, editDrawerArrayIndex, editingDocumentItem, documentArray } = useIndexSelector((state) => { // Get global state that needed
    return {
      db: state.index.db as IDBDatabase,
      editDrawerArrayIndex: state.Drawer.editDrawerArray.arrayIndex,
      editingDocumentItem: state.Drawer.editDrawerArray.editingDocumentItem,
      documentArray: state.Drawer.drawer.documentArray,
    }
  });

  // dispatch(setState0("payload")); // Use Global state

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [editingDocumentItemName, setEditingDocumentItemName] = React.useState("");

  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |
  React.useEffect(() => {
    (async () => {
      if (editDrawerArrayIndex > -1) {
        setEditingDocumentItemName(documentArray[editDrawerArrayIndex].name)
      }
    })();
  }, [editDrawerArrayIndex, documentArray]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const saveButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Drawer_EditDocumentArray_EditDocumentArray_save));

      const item = await new Promise<DBDocumentStoreItemV2>((res, rej) => {
        const request = db.transaction(DBStoreNameV2.documentStore, "readonly").objectStore(DBStoreNameV2.documentStore).get(documentArray[editDrawerArrayIndex].id);
      
        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }
      
        request.onsuccess = () => {
          res(request.result);
        }
      });

      item["name"] = editingDocumentItemName
      console.log(item)

      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.documentStore, "readwrite").objectStore(DBStoreNameV2.documentStore).put(item);
      
        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }
      
        request.onsuccess = () => {
          res(0);
        }
      });

      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.documentStore, "readonly").objectStore(DBStoreNameV2.documentStore).getAll();
      
        request.onerror = (e) => {
          console.log(e);
          rej(e);
        }
      
        request.onsuccess = () => {
          dispatch(setDrawerList(request.result));
          res(0);
        }
      });

      dispatch(deleteLoading(LoadingString.components_Drawer_EditDocumentArray_EditDocumentArray_save))
    } catch (e) {
      console.log(e);
      dispatch(deleteLoading(LoadingString.components_Drawer_EditDocumentArray_EditDocumentArray_save))
    } finally {
    }
  }, [editingDocumentItemName]); // use Callback to reduce computation when re-render

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<>
    <Dialog
      open={editingDocumentItem}
      onClose={() => dispatch(setEditingDocumentItem(false))}
    >
      <Box
        display="flex"
        justifyContent="center"
      >
        <DialogTitle id="alert-dialog-title">
          <TextField
            margin="dense"
            id="name"
            type="text"
            value={editingDocumentItemName}
            variant="standard"
            onChange={(e) => {
              setEditingDocumentItemName(e.target.value);
            }}
          />
        </DialogTitle>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
      >
        <DialogActions>
          <Button onClick={saveButtonOnclick}>Save</Button>
        </DialogActions>
      </Box>
    </Dialog>
  </>);
}

export default EditDrawerArray;