import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import * as React from 'react';
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { setDrawerArray } from 'components/Drawer/Drawer_slice';
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { LoadingString } from 'components/Loading/Loading_type';
import CachedIcon from '@mui/icons-material/Cached';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DocumentItem from "components/Drawer/DocumentItem/DocumentItem";
import { setEditingDocumentArray } from 'components/Drawer/EditDocumentArray/EditDocumentArray_slice';
import EditDrawerArray from 'components/Drawer/EditDocumentArray/EditDocumentArray';
import { db } from "database/db";
import { setCreatingDocument } from 'components/Drawer/NewDocumentDialog/NewDocumentDialog_slice';
import NewDocumentDialog from "components/Drawer/NewDocumentDialog/NewDocumentDialog";

const SwipeableTemporaryDrawer = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { list, editingDocumentArray } = useIndexSelector((state) => {
    return {
      list: state.Drawer.drawer.documentArray,
      editingDocumentArray: state.Drawer.editDrawerArray.editingDocumentArray,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [showDrawer, setShowDrawer] = React.useState(false);

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  // Read all document
  React.useEffect(() => {
    (async () => {
      dispatch(pushLoading(LoadingString.components_Drawer_Drawer_loadDocument));
      try {
        const documents = await db.documentStore.toArray();

        dispatch(setDrawerArray(documents));

        dispatch(deleteLoading(LoadingString.components_Drawer_Drawer_loadDocument));
      } catch (e) {
        console.log(e);
        dispatch(deleteLoading(LoadingString.components_Drawer_Drawer_loadDocument));
      }
    })()
  }, []);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const toggleDrawer =
    (open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event &&
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

        setShowDrawer(open);
      };

  const drawerOnClose = React.useCallback(() => {
    dispatch(setEditingDocumentArray(false));
    setShowDrawer(false);
  }, [])

  const drawerAddDocumentButton = React.useCallback(() => {
    dispatch(setCreatingDocument(true));
  }, []);

  const editDrawerOnclick = React.useCallback((editingDocumentArray) => {
    dispatch(setEditingDocumentArray(!editingDocumentArray));
  }, []);

  return (
    <div>
      <EditDrawerArray />
      <NewDocumentDialog />
      <React.Fragment key={'left'}>
        <IconButton
          onClick={toggleDrawer(true)}
          style={{
            backgroundColor: '#ddffdd',
            boxShadow: '0 0 10px 0 #ccffcc',
            position: 'fixed',
            zIndex: '1',
            left: '15px',
            bottom: '30px',
          }}>
          <LibraryBooksIcon />
        </IconButton>
        <SwipeableDrawer
          anchor={'left'}
          open={showDrawer}
          onClose={drawerOnClose}
          onOpen={toggleDrawer(true)}
        >
          <Box
            style={{
              height: "100%",
            }}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <Box
              style={{
                height: "50px"
              }}
            >
              <IconButton href="https://github.com/shampooma/notes" target="_blank">
                <GitHubIcon />
              </IconButton>
              <IconButton
                onClick={() => location.reload()}
              >
                <CachedIcon />
              </IconButton>
              <IconButton
                onClick={() => editDrawerOnclick(editingDocumentArray)}
              >
                {editingDocumentArray ? <DoneIcon /> : <EditIcon />}

              </IconButton>
            </Box>
            <Box
              style={{
                height: "90%",
                width: "300px",
                overflowY: "scroll",
                overflowX: "hidden",
              }}
            >

              <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {list.map((item, i) => <DocumentItem
                  item={item}
                  i={i}
                  key={i}
                />)}
                <ListItem key={-1}>
                  <Box
                    style={{
                      width: "100%",
                    }}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <IconButton onClick={drawerAddDocumentButton}>
                      <AddIcon></AddIcon>
                    </IconButton>
                  </Box>
                </ListItem>
              </List>
            </Box>

          </Box>
        </SwipeableDrawer>
      </React.Fragment>
    </div>
  );
}

export default SwipeableTemporaryDrawer;
