import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db, DBPasswordItemStoreItem } from "database/db";
import { useLiveQuery } from "dexie-react-hooks";
import { LoadingString } from "components/Loading/Loading_type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { setIsEditing } from "components/Password/EditDialog/EditDialog_slice";
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

const EditDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { isEditing, editingId } = useIndexSelector((state) => { // Get global state that needed
    return {
      isEditing: state.Password.EditDialog.EditDialog.isEditing,
      editingId: state.Password.EditDialog.EditDialog.editingId,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [description, setDescription] = React.useState("");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  React.useEffect(() => {
    (async () => {
      const passwordItem = await db.passwordItemStore.get(editingId);

      if (passwordItem === undefined) {
        return;
      }

      setDescription(passwordItem.description)
      setName(passwordItem.name)
      setPassword(passwordItem.password)
    })()
  }, [editingId, isEditing])


  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const updateButtonOnclick = React.useCallback(() => {
    db.passwordItemStore.update(editingId, {
      description: description,
      name: name,
      password: password,
    })
  }, [description, name, password, editingId]);

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<Dialog
    open={isEditing}
    onClose={() => dispatch(setIsEditing(false))}
  >
    <DialogContent>
      <div>
        <TextField
          margin="dense"
          label="Description"
          variant="standard"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div><TextField
        margin="dense"
        label="Name"
        variant="standard"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      </div>
      <div><TextField
        margin="dense"
        label="Password"
        variant="standard"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      </div>
    </DialogContent>
    <Box
      display="flex"
      justifyContent="center"
    >
      <DialogActions>
        <Button onClick={updateButtonOnclick}>Update</Button>
      </DialogActions>
    </Box>
  </Dialog>);
}

export default EditDialog;