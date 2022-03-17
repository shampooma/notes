import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db, DBPasswordItemStoreItem } from "database/db";
import { LoadingString } from "components/Loading/Loading_type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { setIsEditing, setEditingId } from "components/Password/EditDialog/EditDialog_slice";
import { setIsDeleting, setDeletingId } from "components/Password/DeleteDialog/DeleteDialog_slice";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Item = ({ // Define parameters and corresponding data type
  item
}: {
  item: DBPasswordItemStoreItem
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
  }, []);

  const editIconButtonOnclick = React.useCallback(() => {
    dispatch(setIsEditing(true));
    dispatch(setEditingId(item.id as number));
  }, []);

  const deleteIconButtonOnclick = React.useCallback(() => {
    console.log(item.id)
    dispatch(setIsDeleting(true));
    dispatch(setDeletingId(item.id as number));
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
            }}
            onClick={() => copyToClipboard(item.name)}
          >
            {item.name}
          </Button>
          <Button
            style={{
              height: "50%",
              backgroundColor: "#eee",
              borderRadius: "0 0 0 7px"
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