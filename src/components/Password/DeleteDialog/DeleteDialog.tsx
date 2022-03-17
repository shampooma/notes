import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db, DBPasswordItemStoreItem } from "database/db";
import { useLiveQuery } from "dexie-react-hooks";
import { LoadingString } from "components/Loading/Loading_type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { setIsDeleting } from "components/Password/DeleteDialog/DeleteDialog_slice";
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import Box from "@mui/material/Box";


const DeleteDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { isDeleting, deletingId } = useIndexSelector((state) => { // Get global state that needed
    return {
      isDeleting: state.Password.DeleteDialog.DeleteDialog.isDeleting,
      deletingId: state.Password.DeleteDialog.DeleteDialog.deletingId,
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
  const passwordItem = useLiveQuery<DBPasswordItemStoreItem>(
    () => db.passwordItemStore.get(deletingId),
    [deletingId]
  );

  const confirmOnClick = React.useCallback(() => {
    (async () => {
      console.log(deletingId)
      await db.passwordItemStore.delete(deletingId)
      dispatch(setIsDeleting(false))
    })()
  }, [deletingId])

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  if (passwordItem === undefined) {
    return <></>;
  } else {
    return (<>
      <Dialog
        open={isDeleting}
        onClose={() => dispatch(setIsDeleting(false))}
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Confirm to delete password with name {passwordItem.name}?
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
    </>);
  }
}

export default DeleteDialog;