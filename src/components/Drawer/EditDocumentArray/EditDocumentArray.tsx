import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { setEditingDocumentItem } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice"; // Import redux actions
import Dialog from "@mui/material/Dialog";
import Box from '@mui/material/Box';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { setDrawerArray } from "../Drawer_slice";
import { setArrayIndex } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice";
import { db } from "database/db";

const EditDrawerArray = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { editDrawerArrayIndex, editingDocumentItem, documentArray } = useIndexSelector((state) => { // Get global state that needed
    return {
      editDrawerArrayIndex: state.Drawer.editDrawerArray.arrayIndex,
      editingDocumentItem: state.Drawer.editDrawerArray.editingDocumentItem,
      documentArray: state.Drawer.drawer.documentArray,
    }
  });

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
    dispatch(pushLoading(LoadingString.components_Drawer_EditDocumentArray_EditDocumentArray_save));

    try {
      // Update
      await db.documentStore.update(documentArray[editDrawerArrayIndex].id, {
        "name": editingDocumentItemName
      });

      const documents = await db.documentStore.toArray();

      if (documents === undefined) return;

      dispatch(setDrawerArray(documents));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_Drawer_EditDocumentArray_EditDocumentArray_save))
    }
  }, [editingDocumentItemName]); // use Callback to reduce computation when re-render

  const dialogOnclose = React.useCallback(() => {
    dispatch(setEditingDocumentItem(false));
    dispatch(setArrayIndex(-1));
  }, [])

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<>
    <Dialog
      open={editingDocumentItem}
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