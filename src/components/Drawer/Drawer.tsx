import * as React from 'react';
import AddIcon from '@mui/icons-material/Add';
import GitHubIcon from '@mui/icons-material/GitHub';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CachedIcon from '@mui/icons-material/Cached';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DocumentItem from "components/Drawer/DocumentItem/DocumentItem";
import NewDocumentDialog from "components/Drawer/NewDocumentDialog/NewDocumentDialog";
import EditDrawerArray from 'components/Drawer/EditDocumentArray/EditDocumentArray';

import { db } from "database/db";
import { useLiveQuery } from "dexie-react-hooks";
import { setCreatingDocument } from 'components/Drawer/NewDocumentDialog/NewDocumentDialog_slice';
import { setIsEditingDocumentArray } from 'components/Drawer/EditDocumentArray/EditDocumentArray_slice';
import { setDocumentArray } from 'components/Drawer/Drawer_slice';

const Drawer = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { isEditingDocumentArray, documentArray } = useIndexSelector((state) => {
    return {
      isEditingDocumentArray: state.Drawer.editDrawerArray.isEditingDocumentArray,
      documentArray: state.Drawer.drawer.documentArray,
    }
  });

  // // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // // |    |  | |    |__| |       [__   |  |__|  |  |___
  // // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [showDrawer, setShowDrawer] = React.useState(false);
  // const [documentArray, setDocumentArray] = React.useState([]);

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  React.useEffect(() => {
    (async() => {
      const documentArray = await db.documentStore.toArray();
      dispatch(setDocumentArray(documentArray))
    })()
  },[])

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const toggleDrawer = React.useCallback(
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
      }, [])

  const drawerOnClose = React.useCallback(() => {
    dispatch(setIsEditingDocumentArray(false));
    setShowDrawer(false);
  }, [])

  const drawerAddDocumentButton = React.useCallback(() => {
    dispatch(setCreatingDocument(true));
  }, []);

  const editDrawerOnclick = React.useCallback((isEditingDocumentArray) => {
    dispatch(setIsEditingDocumentArray(!isEditingDocumentArray));
  }, []);

  if (documentArray === undefined) {
    return <></>
  } else {
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
                  onClick={() => editDrawerOnclick(isEditingDocumentArray)}
                >
                  {isEditingDocumentArray ? <DoneIcon /> : <EditIcon />}

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
                  {documentArray.map((item, i) => <DocumentItem
                    item={item}
                    key={item.id}
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
}

export default Drawer;
