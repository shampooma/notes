import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db } from "database/db";
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
import { encryptPasswordRecord } from "components/Password/Password_tools";
import { setPasswordRecordArray, setDocumentPassword } from "components/Password/Password_slice";

const EditDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { interactingDocumentId, isEditing, editingIndex, passwordRecordArray, documentPassword } = useIndexSelector((state) => { // Get global state that needed
    return {
      interactingDocumentId: state.index.interactingDocumentId,
      isEditing: state.Password.EditDialog.EditDialog.isEditing,
      editingIndex: state.Password.EditDialog.EditDialog.editingIndex,
      passwordRecordArray: state.Password.Password.passwordRecordArray,
      documentPassword: state.Password.Password.documentPassword,
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
    if (passwordRecordArray === undefined || editingIndex < 0 || passwordRecordArray[editingIndex] === undefined) {
      setDescription("")
      setName("")
      setPassword("")
      return;
    } else {
      setDescription(passwordRecordArray[editingIndex].description)
      setName(passwordRecordArray[editingIndex].name)
      setPassword(passwordRecordArray[editingIndex].password)
    }
  }, [passwordRecordArray, editingIndex])


  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const updateButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Password_EditDialog_updateData));

      if (passwordRecordArray === undefined || documentPassword === "" || editingIndex < 0) {
        return;
      } else {
        const newValue = {
          description: description,
          name: name,
          password: password
        }

        const newPasswordRecordArray = passwordRecordArray.slice();

        newPasswordRecordArray[editingIndex] = newValue;

        const { encryptedData, HMAC } = encryptPasswordRecord(JSON.stringify(newPasswordRecordArray), documentPassword)

        const updateValue = {
          encryptedData: encryptedData,
          HMAC: HMAC
        }

        await db.passwordRecordStore.update(interactingDocumentId, updateValue)
        dispatch(setPasswordRecordArray(newPasswordRecordArray))
      }
    } catch (e) {

    } finally {
      dispatch(deleteLoading(LoadingString.components_Password_EditDialog_updateData))
    }
  }, [interactingDocumentId, passwordRecordArray, description, name, password, editingIndex, documentPassword]);

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