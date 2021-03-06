import * as React from "react"
import { useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { DBPasswordRecordData } from "database/db";
import { setIsEditing, setEditingIndex } from "components/Password/EditDialog/EditDialog_slice";
import { setIsDeleting, setDeletingIndex } from "components/Password/DeleteDialog/DeleteDialog_slice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { pushNotificationArray } from "components/Stackbar/Stackbar_slice";

const Item = ({ // Define parameters and corresponding data type
  item,
  index
}: {
  item: DBPasswordRecordData,
  index: number
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const copyToClipboard = React.useCallback((str: string) => {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    // Success stackbar
    dispatch(pushNotificationArray({ message: `Copied ${str}`, variant: "success"}))
  }, []);

  const editIconButtonOnclick = React.useCallback(() => {
    dispatch(setIsEditing(true));
    dispatch(setEditingIndex(index));
  }, []);

  const deleteIconButtonOnclick = React.useCallback(() => {
    dispatch(setIsDeleting(true));
    dispatch(setDeletingIndex(index));
  }, []);

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (
    <Box
      sx={{
        my: 1,
        py: 0,
      }}
    >
      <p>{item.description}</p>
      <Box
        sx={{
          boxShadow: 2,

          borderRadius: "7px",
          display: 'flex',
        }}
      >
        <Box
          style={{
            width: '100%'

          }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}

        >
          <Button
            style={{
              height: "50%",
              backgroundColor: "#fff",
              borderRadius: "7px 0 0 0",
              textTransform: 'none'
            }}
            onClick={() => copyToClipboard(item.name)}
          >
            {item.name}
          </Button>
          <Button
            style={{
              height: "50%",
              backgroundColor: "#eee",
              borderRadius: "0 0 0 7px",
              textTransform: 'none'
            }}
            onClick={() => copyToClipboard(item.password)}
          >
            {item.password}
          </Button>
        </Box>


        <Button
          onClick={editIconButtonOnclick}
        >
          <EditIcon />
        </Button>
        <Button
          onClick={deleteIconButtonOnclick}
        >
          <DeleteIcon />
        </Button>
      </Box>


    </Box>
  );
}

export default Item;