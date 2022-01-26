import * as React from "react";
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import FolderIcon from '@mui/icons-material/Folder';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';

import * as indexEnum from "others/App_enum";
import { setItems } from "others/StockList/StockList_slice";
import { setLoading } from "others/App_slice";
import { useAppSelector, useAppDispatch } from "others/index_hooks";
import {
  setEditDialogContent,
  setEditDialogIndex,
  setShowEditDialog,
} from "others/StockList/EditDialog_slice";

const CustomListItem = ({
  index
}: {
  index: number
}) => {
  // Global state
  console.log("render CustomListItem.tsx");
  const dispatch = useAppDispatch();
  const {db, items} = useAppSelector((state) => {
    return {
      db: state.app.db,
      items: state.stockList.stockList.items,
    }
  })

  if (db === null) return <></>;

  // Local state

  // Functions
  const customListItemDeleteButtonOnclick = () => {
    dispatch(setLoading(true));

    // deleteRequest start
    const deleteRequest = db.transaction(indexEnum.DBStoreName.stockStore, 'readwrite').objectStore(indexEnum.DBStoreName.stockStore).delete(items[index].id);

    // deleteRequest error
    deleteRequest.onerror = (e) => {
      console.log(e);
      dispatch(setLoading(false));
    }

    // deleteRequest success
    deleteRequest.onsuccess = () => {
      // getAllRequest start
      const getAllRequest = db.transaction(indexEnum.DBStoreName.stockStore, 'readwrite').objectStore(indexEnum.DBStoreName.stockStore).getAll();

      // getAllRequest error
      getAllRequest.onerror = (e) => {
        console.log(e);
        dispatch(setLoading(false));
      }

      // getAllRequest success
      getAllRequest.onsuccess = () => {
        dispatch(setItems(getAllRequest.result));
        dispatch(setLoading(false));
      }
    }
  }

  const customListItemButtonOnclick = () => {
    dispatch(setEditDialogContent({
      name: items[index].name,
      price: items[index].price,
      position: items[index].position
    }));
    dispatch(setEditDialogIndex(index));
    dispatch(setShowEditDialog(true));
  }


  return (<ListItem
    secondaryAction={
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={customListItemDeleteButtonOnclick}
      >
        <DeleteIcon />
      </IconButton>
    }
    disablePadding
  >
    <ListItemButton
      onClick={customListItemButtonOnclick}
    >
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={items[index]['name']}
        secondary={`Price: ${items[index]['price']} | Position: ${items[index]['position']}`}
      />
    </ListItemButton>
  </ListItem>);
}

export default CustomListItem