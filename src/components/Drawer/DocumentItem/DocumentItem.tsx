import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { setArrayIndex, setEditingDocumentItem } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice";

import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { setDocumentIndex } from "components/index/index_slice";
import * as React from 'react';
import { Button } from "@mui/material";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { LoadingString } from 'components/Loading/Loading_type';
import { setDrawerArray } from "components/Drawer/Drawer_slice";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { db, DBDocumentStoreItem, DBDocumentTypeEnum } from "database/db";

const DocumentItem = ({
  item,
  i
}: {
  item: DBDocumentStoreItem,
  i: number
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { editingDocumentArray, documentArray, interactingDocumentIndex } = useIndexSelector((state) => {
    return {
      editingDocumentArray: state.Drawer.editDrawerArray.editingDocumentArray,
      documentArray: state.Drawer.drawer.documentArray,
      interactingDocumentIndex: state.index.documentIndex
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
      await db.documentStore.delete(documentArray[i].id as number);

      const documents = await db.documentStore.toArray();

      dispatch(setDocumentIndex(-1));
      dispatch(setDrawerArray(documents));
    } catch (e) {
      console.log(e);
    } finally {
      setShowDeleteWarning(false);
      dispatch(deleteLoading(LoadingString.components_Drawer_DocumentItem_deleteDocument));
    }
  }, [documentArray]);

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
        style={{
          backgroundColor: interactingDocumentIndex === i ? "#efe" : "#fff"
        }}
      >

        <DeleteButtonElement />
        <ListItemButton
          alignItems="flex-start"
          onClick={itemOnclick}
        >
          <ListItemText
            primary={item.name}
            secondary={DBDocumentTypeEnum[item.type]}
          />
        </ListItemButton>
      </Box>
    </>
  );
}

export default DocumentItem;
