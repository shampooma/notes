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
import { setPasswordRecordArray, setDocumentPassword } from "components/Password/Password_slice";
import { encryptPasswordRecord, decryptPasswordRecord } from "components/Password/Password_tools";


const Password = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { interactingDocumentId, passwordRecordArray, documentPassword } = useIndexSelector((state) => {
    return {
      interactingDocumentId: state.index.interactingDocumentId,
      passwordRecordArray: state.Password.Password.passwordRecordArray,
      documentPassword: state.Password.Password.documentPassword,
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
    () => {
      return db.passwordRecordStore.get(interactingDocumentId);
    },
    [interactingDocumentId]
  );

  React.useEffect(() => {
    dispatch(setPasswordRecordArray(undefined));
  }, [interactingDocumentId])

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const centerAddButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Password_Password_add));
      if (passwordRecordArray === undefined) {
        return;
      }

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

      await db.passwordRecordStore.update(interactingDocumentId, updateValue)
      dispatch(setPasswordRecordArray(newPasswordRecordArray))
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_Password_Password_add))
    }
  }, [interactingDocumentId, documentPassword, passwordRecordArray]);

  const setPasswordDialogButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(deleteLoading(LoadingString.components_Password_Password_setPassword))


      if (confirmPassword !== targetPassword || targetPassword === "" || interactingDocumentId === undefined) {
        return;
      } else {
        const { encryptedData, HMAC } = encryptPasswordRecord(JSON.stringify([]), targetPassword);

        await db.passwordRecordStore.add({
          documentId: interactingDocumentId,
          encryptedData: encryptedData,
          HMAC: HMAC,
        })
      }
    } catch (e) {
      console.log(e)
    } finally {
      dispatch(deleteLoading(LoadingString.components_Password_Password_setPassword))
    }
  }, [confirmPassword, targetPassword, interactingDocumentId])

  const decryptPasswordRecordDialogButtonOnclick = React.useCallback(async () => {
    try {
      dispatch(deleteLoading(LoadingString.components_Password_Password_decrypt))

      const passwordRecord = await db.passwordRecordStore.get(interactingDocumentId);

      if (passwordRecord === undefined) {
        return;
      } else {
        const { error, data } = decryptPasswordRecord(
          passwordRecord.encryptedData,
          passwordRecord.HMAC,
          decryptPassword
        )

        if (error) {
          setDecryptPasswordError(true);
        } else {
          dispatch(setDocumentPassword(decryptPassword));
          dispatch(setPasswordRecordArray(JSON.parse(data)));
        }
      }
    } catch (e) {
      console.log(e)
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