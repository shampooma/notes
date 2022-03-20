import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db } from "database/db";
import { setIsDeleting } from "components/Password/DeleteDialog/DeleteDialog_slice";
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";
import { encryptPasswordRecord } from "components/Password/Password_tools";
import { setPasswordRecordArray } from "components/Password/Password_slice";
import { setDeletingIndex } from "components/Password/DeleteDialog/DeleteDialog_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";

const DeleteDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { interactingDocumentId, isDeleting, deletingIndex, passwordRecordArray, documentPassword } = useIndexSelector((state) => { // Get global state that needed
    return {
      interactingDocumentId: state.index.interactingDocumentId,
      isDeleting: state.Password.DeleteDialog.DeleteDialog.isDeleting,
      deletingIndex: state.Password.DeleteDialog.DeleteDialog.deletingIndex,
      passwordRecordArray: state.Password.Password.passwordRecordArray,
      documentPassword: state.Password.Password.documentPassword,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const confirmOnClick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Password_DeleteDialog_deleteData))

      if (passwordRecordArray === undefined || deletingIndex < 0) {
        return;
      } else {
        let frontArray = []
        let backArray = [] as any

        frontArray = passwordRecordArray.slice(0, deletingIndex);

        if (passwordRecordArray.length > deletingIndex + 1) {
          backArray = passwordRecordArray.slice(deletingIndex + 1, passwordRecordArray.length)
        }

        const newPasswordRecordArray = [...frontArray, ...backArray];

        const { encryptedData, HMAC } = encryptPasswordRecord(JSON.stringify(newPasswordRecordArray), documentPassword)

        const updateValue = {
          encryptedData: encryptedData,
          HMAC: HMAC
        }

        await db.passwordRecordStore.update(interactingDocumentId, updateValue)
        dispatch(setDeletingIndex(-1))
        dispatch(setPasswordRecordArray(newPasswordRecordArray))
        dispatch(setIsDeleting(false))
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_Password_DeleteDialog_deleteData))
    }
  }, [interactingDocumentId, passwordRecordArray, deletingIndex])

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  if (passwordRecordArray === undefined || deletingIndex < 0) {
    return <></>;
  } else {
    console.log(deletingIndex)
    return (
      <>
        <Dialog
          open={isDeleting}
          onClose={() => dispatch(setIsDeleting(false))}
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Confirm to delete password with name {passwordRecordArray[deletingIndex].name}?
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
              <Button onClick={confirmOnClick} color="error">
                Confirm
              </Button>
            </Box>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default DeleteDialog;