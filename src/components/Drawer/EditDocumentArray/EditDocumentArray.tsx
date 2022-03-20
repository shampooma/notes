import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { setIsEditingDocumentItem, setEditingDocumentId } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice"; // Import redux actions
import Dialog from "@mui/material/Dialog";
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { db } from "database/db";
import { useLiveQuery } from "dexie-react-hooks";
import { setDocumentArray } from 'components/Drawer/Drawer_slice';
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";

const EditDrawerArray = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { editingDocumentId, isEditingDocumentItem } = useIndexSelector((state) => { // Get global state that needed
    return {
      editingDocumentId: state.Drawer.editDrawerArray.editingDocumentId,
      isEditingDocumentItem: state.Drawer.editDrawerArray.isEditingDocumentItem,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [editingDocumentItemName, setEditingDocumentItemName] = React.useState("");

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  const editingDocument = useLiveQuery(
    () => {
      return db.documentStore.get(editingDocumentId);
    },
    [editingDocumentId]
  );

  React.useEffect(() => {
    (async () => {
      if (editingDocument === undefined) {
        return;
      } else {
        setEditingDocumentItemName(editingDocument.name)
      }
    })();
  }, [editingDocument]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const saveButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Drawer_EditDocumentArray_EditDocumentArray_save));

      // Update
      await db.documentStore.update(editingDocumentId, {
        "name": editingDocumentItemName
      });

      // Set document array
      const documentArray = await db.documentStore.toArray();
      dispatch(setDocumentArray(documentArray))

      // Success stackbar
      dispatch(pushNotificationArray({ message: "Success to edit document name", variant: "success"}))
      return
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to edit document name", variant: "error"}))
    } finally {
      dispatch(deleteLoading(LoadingString.components_Drawer_EditDocumentArray_EditDocumentArray_save))
    }
  }, [editingDocumentItemName, editingDocumentId]); // use Callback to reduce computation when re-render

  const dialogOnclose = React.useCallback(() => {
    dispatch(setIsEditingDocumentItem(false));
    dispatch(setEditingDocumentId(-1));
  }, [])

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<>
    <Dialog
      open={isEditingDocumentItem}
      onClose={dialogOnclose}
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