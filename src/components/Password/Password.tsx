import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db, DBPasswordRecord } from "database/db";
import { useLiveQuery } from "dexie-react-hooks";
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { LoadingString } from "components/Loading/Loading_type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import EditDialog from "components/Password/EditDialog/EditDialog";
import DeleteDialog from "components/Password/DeleteDialog/DeleteDialog";
import Item from "components/Password/Item/Item";
import List from "@mui/material/List";

const Password = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { documentIndex, documentArray, isEditing, editingItemId } = useIndexSelector((state) => {
    return {
      documentIndex: state.index.documentIndex,
      documentArray: state.Drawer.drawer.documentArray,
      isEditing: state.Password.EditDialog.EditDialog.isEditing,
      editingItemId: state.Password.EditDialog.EditDialog.editingId,
    }
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  const passwordArray = useLiveQuery<DBPasswordRecord[]>(
    () => {
      return db.passwordRecordStore
        .where('documentId')
        .equals(documentArray[documentIndex].id as number)
        .toArray()
    },
    [documentIndex, documentArray,]
  );

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const centerAddButtonOnclick = React.useCallback(async () => {
    dispatch(pushLoading(LoadingString.components_Password_Password_add));

    try {
      // Push stockRecordArray of stockStoreItem
      const newPasswordItem = {
        documentId: documentArray[documentIndex].id as number,
        description: "description",
        name: "name",
        password: "password",
      }

      await db.passwordRecordStore.put(newPasswordItem);
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_Password_Password_add))
    }
  }, [documentArray, documentIndex]);

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  if (passwordArray === undefined) {
    return <></>;
  } else {
    return (<>
      <EditDialog />
      <DeleteDialog />
      <List
        sx={{ px: "10%" }}
      >
        {passwordArray.map((item, i) => <Item
          item={item}
          key={item.id}
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