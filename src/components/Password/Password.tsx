import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db } from "database/db";
import { useLiveQuery } from "dexie-react-hooks";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { LoadingString } from "components/Loading/Loading_type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EditDialog from "components/Password/EditDialog/EditDialog";
import DeleteDialog from "components/Password/DeleteDialog/DeleteDialog";
import Item from "components/Password/Item/Item";
import List from "@mui/material/List";
import { setPasswordRecordArray, setDocumentPassword, setSettedDetectIdle } from "components/Password/Password_slice";
import { encryptPasswordRecord, decryptPasswordRecord } from "components/Password/Password_tools";
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";
import { useIdleTimer } from 'react-idle-timer';

const Password = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { interactingDocumentId, passwordRecordArray, documentPassword, settedDetectIdle } = useIndexSelector((state) => {
    return {
      interactingDocumentId: state.index.interactingDocumentId,
      passwordRecordArray: state.Password.Password.passwordRecordArray,
      documentPassword: state.Password.Password.documentPassword,
      settedDetectIdle: state.Password.Password.settedDetectIdle,
    }
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [targetPassword, setTargetPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [decryptPassword, setDecryptPassword] = React.useState("");
  const [decryptPasswordError, setDecryptPasswordError] = React.useState(false);

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  const passwordRecordItem = useLiveQuery(
    () => db.passwordRecordStore.get(interactingDocumentId),
    [interactingDocumentId]
  );

  React.useEffect(() => {
    dispatch(setDocumentPassword(""));
    dispatch(setPasswordRecordArray(undefined));
  }, [interactingDocumentId])

  useIdleTimer({
    timeout: 1000 * 60,
    onIdle: () => {
      dispatch(setDocumentPassword(""));
      dispatch(setPasswordRecordArray(undefined));
      dispatch(pushNotificationArray({ message: "Encrypted password record due to inactive", variant: "info" }))
    },
    debounce: 500
  })

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const centerAddButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Password_Password_add));

      if (passwordRecordArray === undefined) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Haven't decrypt password record", variant: "error" }))
        return;
      } else {
        // Calculate update values
        const newPasswordItem = {
          description: "description",
          name: "name",
          password: "password",
        }

        const newPasswordRecordArray = [...passwordRecordArray, newPasswordItem]

        const { encryptedData, HMAC } = encryptPasswordRecord(JSON.stringify(newPasswordRecordArray), documentPassword)

        const updateValue = {
          encryptedData: encryptedData,
          HMAC: HMAC
        }

        // Update password record
        await db.passwordRecordStore.update(interactingDocumentId, updateValue)
        dispatch(setPasswordRecordArray(newPasswordRecordArray))

        // Success stackbar
        dispatch(pushNotificationArray({ message: "Success to add password record", variant: "success" }))
        return
      }
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to add password record", variant: "error" }))
    } finally {
      dispatch(deleteLoading(LoadingString.components_Password_Password_add))
    }
  }, [interactingDocumentId, documentPassword, passwordRecordArray]);

  const setPasswordDialogButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(deleteLoading(LoadingString.components_Password_Password_setPassword))

      if (confirmPassword !== targetPassword) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Password mismatch", variant: "error" }))
        return
      } else if (targetPassword === "") {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Password cannot be empty", variant: "error" }))
        return
      } else if (interactingDocumentId === undefined) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Not interacting with a document", variant: "error" }))
        return
      } else {
        // Encrypt password record data
        const { encryptedData, HMAC } = encryptPasswordRecord(JSON.stringify([]), targetPassword);

        // Add password record
        await db.passwordRecordStore.add({
          documentId: interactingDocumentId,
          encryptedData: encryptedData,
          HMAC: HMAC,
        })

        setTargetPassword("");
        setConfirmPassword("");

        // Success stackbar
        dispatch(pushNotificationArray({ message: "Success to set password", variant: "success" }))
        return
      }
    } catch (e) {
      console.log(e);

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to set password", variant: "error" }))
    } finally {
      dispatch(deleteLoading(LoadingString.components_Password_Password_setPassword))
    }
  }, [confirmPassword, targetPassword, interactingDocumentId])

  const decryptPasswordRecordDialogButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(deleteLoading(LoadingString.components_Password_Password_decrypt))

      const passwordRecord = await db.passwordRecordStore.get(interactingDocumentId);

      if (passwordRecord === undefined) {
        // Error stackbar
        dispatch(pushNotificationArray({ message: "Don't have this password record", variant: "error" }))
        return
      } else {
        // Try to decrypt password record
        const { error, data } = decryptPasswordRecord(
          passwordRecord.encryptedData,
          passwordRecord.HMAC,
          decryptPassword
        )

        if (error) {
          setDecryptPasswordError(true);

          // Error stackbar
          dispatch(pushNotificationArray({ message: "Failed to decrypt password record", variant: "error" }))
          return;
        } else {
          dispatch(setDocumentPassword(decryptPassword));
          dispatch(setPasswordRecordArray(JSON.parse(data)));
          setDecryptPassword("");

          // Success stackbar
          dispatch(pushNotificationArray({ message: "Success to decrypt password record", variant: "success" }))
          return
        }
      }
    } catch (e) {
      console.log(e)

      // Error stackbar
      dispatch(pushNotificationArray({ message: "Failed to decrypt password record", variant: "error" }))
    } finally {
      dispatch(deleteLoading(LoadingString.components_Password_Password_decrypt))
    }
  }, [decryptPassword, interactingDocumentId])

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  if (passwordRecordItem === undefined) { // Haven't set password || password have been deleted
    return <>
      <Box
        sx={{
          px: 3
        }}
      >
        <Box>
          <h1>Enter password for 1st creation</h1>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: 'column'
          }}
        >

          <TextField
            label="Target password"
            value={targetPassword}
            variant="standard"
            type="password"
            onChange={(e) => setTargetPassword(e.target.value)}
          />
          <TextField
            error={confirmPassword !== targetPassword}
            label="Confirm password"
            value={confirmPassword}
            variant="standard"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>
        <Box
          display="flex"
          justifyContent="center"
          style={{
            width: "100%"
          }}
        >
          <Button onClick={setPasswordDialogButtonOnclick}>
            Confirm
          </Button>
        </Box>
      </Box>
    </>
  } else if (passwordRecordArray === undefined) { // Cannot decrypt password record data
    return <>
      <Box
        sx={{
          px: 3
        }}
      >
        <Box>
          <h1>Enter password for this document</h1>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: 'column'
          }}
        >
          <TextField
            error={decryptPasswordError}
            label="Password"
            value={decryptPassword}
            variant="standard"
            type="password"
            onChange={(e) => setDecryptPassword(e.target.value)}
          />
        </Box>

        <Box
          display="flex"
          justifyContent="center"
          style={{
            width: "100%"
          }}
        >
          <Button onClick={decryptPasswordRecordDialogButtonOnclick}>
            Confirm
          </Button>
        </Box>
      </Box>
    </>
  } else { // Successfully logged in
    return (<>
      <EditDialog />
      <DeleteDialog />
      <List
        sx={{ px: "10%" }}
      >
        {passwordRecordArray.map((item, i) => <Item
          item={item}
          index={i}
          key={i}
        />
        )}
      </List>
      <Box
        display="flex"
        justifyContent="center"
      >
        <IconButton
          edge="end"
          aria-label="add"
          onClick={centerAddButtonOnclick}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </>);
  }
}

export default Password;