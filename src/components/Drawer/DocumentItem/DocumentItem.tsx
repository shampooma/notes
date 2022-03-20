import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { setEditingDocumentId, setIsEditingDocumentItem } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice";

import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { setInteractingDocumentId } from "components/index/index_slice";
import * as React from 'react';
import { Button } from "@mui/material";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { LoadingString } from 'components/Loading/Loading_type';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import { db, DBDocumentStoreItem, DBDocumentTypeEnum } from "database/db";
import { setDocumentArray } from 'components/Drawer/Drawer_slice';
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";

const DocumentItem = ({
  item,
}: {
  item: DBDocumentStoreItem,
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { isEditingDocumentArray, interactingDocumentId } = useIndexSelector((state) => {
    return {
      isEditingDocumentArray: state.Drawer.editDrawerArray.isEditingDocumentArray,
      interactingDocumentId: state.index.interactingDocumentId
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
    if (item.id === undefined) {
      return;
    } else if (isEditingDocumentArray) {
      dispatch(setEditingDocumentId(item.id));
      dispatch(setIsEditingDocumentItem(true));
    } else {
      dispatch(setInteractingDocumentId(item.id));
    }
  }, [isEditingDocumentArray]);

  /**
   * Depends on documentArray
   */
  const deleteButtonOnclick = React.useCallback(async () => {
    setShowDeleteWarning(true);
  }, [])

  const DeleteButtonElement = React.useCallback(() => {
    if (isEditingDocumentArray) {
      return (<Button
        color="error"
        onClick={deleteButtonOnclick}
      >
        <DeleteOutlineIcon />
      </Button>)
    } else {
      return (<></>)
    }
  }, [isEditingDocumentArray]);

  const deleteWarningConfirmOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Drawer_DocumentItem_deleteDocument));

      if (item.id === undefined) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Haven't select document to be delete", variant: "error" }))
        return;
      } else {
        // Delete data
        switch (item.type) {
          case DBDocumentTypeEnum.stock:
            await db.stockRecordStore
              .where("documentId")
              .equals(item.id)
              .delete();
            break;
          case DBDocumentTypeEnum.password:
            await db.passwordRecordStore.delete(item.id)
            break;
        }

        // Delete document record
        await db.documentStore.delete(item.id);

        // Set interacting document id if the current interacting document have been delete
        if (item.id === interactingDocumentId) {
          dispatch(setInteractingDocumentId(-1));
        }

        // Set document array
        const documentArray = await db.documentStore.toArray();
        dispatch(setDocumentArray(documentArray))

        // Success stackbar
        dispatch(pushNotificationArray({ message: "Success to delete document record", variant: "success" }))
        return
      }
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to delete document record", variant: "error"}))
    } finally {
      setShowDeleteWarning(false);
      dispatch(deleteLoading(LoadingString.components_Drawer_DocumentItem_deleteDocument));
    }
  }, [interactingDocumentId]);

  return (
    <>
      <Dialog
        open={showDeleteWarning}
        onClose={() => setShowDeleteWarning(false)}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm to delete {item.name}?
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
        style={{
          backgroundColor: interactingDocumentId === item.id ? "#efe" : "#fff"
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
