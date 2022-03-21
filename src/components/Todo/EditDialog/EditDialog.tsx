import "components/StockList/EditDialog/EditDialog.css";

import * as React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined';
import FindReplaceOutlinedIcon from '@mui/icons-material/FindReplaceOutlined';
import SmsFailedOutlinedIcon from '@mui/icons-material/SmsFailedOutlined';
import PendingOutlinedIcon from '@mui/icons-material/PendingOutlined';

import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import {
  setShowEditDialog
} from "components/Todo/EditDialog/EditDialog_slice";
import { LoadingString } from "components/Loading/Loading_type";
import { IconButton } from "@mui/material";
import { db, DBTodoRecordStatus } from "database/db";
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";
import { useLiveQuery } from "dexie-react-hooks";

const EditDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch()
  const {
    showEditDialog,
    editDialogId,
  } = useIndexSelector((state) => {
    return {
      showEditDialog: state.Todo.editDialog.showDialog,
      editDialogId: state.Todo.editDialog.id,
    }
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [editThing, setEditThing] = React.useState("");
  const [editStatus, setEditStatus] = React.useState<DBTodoRecordStatus>(DBTodoRecordStatus.pending)

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  const editingTodoRecord = useLiveQuery(
    () => db.todoRecordStore.get(editDialogId),
    [editDialogId]
  )

  React.useEffect(() => {
    (async () => {
      if (editingTodoRecord === undefined) {
        return;
      } else {
        setEditThing(editingTodoRecord["thing"]);
        setEditStatus(editingTodoRecord["status"]);
      }
    })()
  }, [editingTodoRecord]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const updateButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Todo_EditDialog_editThing))

      if (editingTodoRecord === undefined) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Haven't select todo record to be edit", variant: "error" }))
        return;
      } else {
        // Calculate update values
        const updateValues = {
          thing: editThing,
          status: editStatus
        }

        // Update todo record
        await db.todoRecordStore.update(editDialogId, updateValues);

        // Success stackbar
        dispatch(pushNotificationArray({ message: `Success to edit todo record`, variant: "success" }))
        return;
      }
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to edit todo record", variant: "error" }))
    } finally {
      dispatch(deleteLoading(LoadingString.components_Todo_EditDialog_editThing))
    }
  }, [
    editingTodoRecord,
    editDialogId,
    editThing,
    editStatus
  ]);

  const closeDialog = React.useCallback(() => {
    dispatch(setShowEditDialog(false));
  }, []);

  const ItemListIcon = React.useCallback(() => {
    let Icon;

    switch (editStatus) {
      case DBTodoRecordStatus.done:
        Icon = <DoneOutlinedIcon color="success" />;
        break;
      case DBTodoRecordStatus.progress:
        Icon = <FindReplaceOutlinedIcon />;
        break;
      case DBTodoRecordStatus.pending:
        Icon = <PendingOutlinedIcon color="disabled" />;
        break;
      case DBTodoRecordStatus.failed:
        Icon = <SmsFailedOutlinedIcon color="error" />;
        break;
    }

    return Icon;
  }, [editStatus])

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (
    <Dialog
      open={showEditDialog}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      fullWidth
      maxWidth="xl"
    >
      <Box
        display="flex"
        justifyContent="center"
      >
        <DialogTitle id="alert-dialog-title"
          style={{
            width: "90%"
          }}
        >
          <TextField
            style={{
              width: "100%"
            }}
            margin="dense"
            id="name"
            type="text"
            value={editThing}
            variant="standard"
            onChange={(e) => setEditThing(e.target.value)}
            onKeyDown={e => e.key === "Enter" && updateButtonOnclick()}
          />
        </DialogTitle>
      </Box>
      <Box
        display="flex"
        justifyContent="center"
      >
        <ItemListIcon />
      </Box>
      <Box
        display="flex"
        justifyContent="center"
      >
        <Box>
          <FormControlLabel
            labelPlacement="bottom"
            label={DBTodoRecordStatus[DBTodoRecordStatus.done]}
            control={<Checkbox
              checked={editStatus === DBTodoRecordStatus.done}
              onClick={() => setEditStatus(DBTodoRecordStatus.done)}
            />}
          />
          <FormControlLabel
            labelPlacement="bottom"
            label={DBTodoRecordStatus[DBTodoRecordStatus.failed]}
            control={<Checkbox
              checked={editStatus === DBTodoRecordStatus.failed}
              onClick={() => setEditStatus(DBTodoRecordStatus.failed)}
            />}
          />
          <FormControlLabel
            labelPlacement="bottom"
            label={DBTodoRecordStatus[DBTodoRecordStatus.pending]}
            control={<Checkbox
              checked={editStatus === DBTodoRecordStatus.pending}
              onClick={() => setEditStatus(DBTodoRecordStatus.pending)}
            />}
          />
          <FormControlLabel
            labelPlacement="bottom"
            label={DBTodoRecordStatus[DBTodoRecordStatus.progress]}
            control={<Checkbox
              checked={editStatus === DBTodoRecordStatus.progress}
              onClick={() => setEditStatus(DBTodoRecordStatus.progress)}
            />}
          />
        </Box>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
      >
        <DialogActions>
          <Button onClick={updateButtonOnclick}>Save</Button>
        </DialogActions>
      </Box>
    </Dialog>

  );
}

export default EditDialog
