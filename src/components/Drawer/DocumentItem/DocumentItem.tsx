import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { DBDocumentStoreItemV2 } from "indexeddb/type";
import { setArrayIndex, setEditingDocumentArray, setEditingDocumentItem } from "components/Drawer/EditDocumentArray/EditDocumentArray_slice";

import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import { setDocumentIndex } from "components/index/index_slice";
import * as React from 'react';

const DocumentItem = ({
  item, 
  i
}: {
  item: DBDocumentStoreItemV2,
  i: number
}) => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { editingDocumentArray } = useIndexSelector((state) => {
    return {
      editingDocumentArray: state.Drawer.editDrawerArray.editingDocumentArray,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]

  const itemOnclick = React.useCallback(() => {
    if (editingDocumentArray) {
      
      console.log('hi')
      dispatch(setArrayIndex(i));
      dispatch(setEditingDocumentItem(true));
    } else {
      dispatch(setDocumentIndex(i));
    }
  }, [editingDocumentArray]);

  return (
    <ListItemButton
      alignItems="flex-start"
      key={i}
      onClick={itemOnclick}
    >
      <ListItemText
        primary={item.name}
        secondary={item.type}
      />
    </ListItemButton>
  );
}

export default DocumentItem;
