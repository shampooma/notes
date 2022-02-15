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
import { setDrawerList } from 'components/Drawer/Drawer_slice';
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { DBStoreNameV2 } from 'indexeddb/type';
import { LoadingString } from 'components/Loading/Loading_type';
import CachedIcon from '@mui/icons-material/Cached';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import DocumentItem from "components/Drawer/DocumentItem/DocumentItem";
import { setEditingDocumentArray } from 'components/Drawer/EditDocumentArray/EditDocumentArray_slice';
import EditDrawerArray from 'components/Drawer/EditDocumentArray/EditDocumentArray';

const SwipeableTemporaryDrawer = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { db, list, editingDocumentArray } = useIndexSelector((state) => {
    return {
      db: state.index.db as IDBDatabase,
      list: state.Drawer.drawer.documentArray,
      editingDocumentArray: state.Drawer.editDrawerArray.editingDocumentArray,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [showDrawer, setShowDrawer] = React.useState(false);

  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |
  React.useEffect(() => {
    (async () => {
      // Read all document
      try {
        dispatch(pushLoading(LoadingString.components_Drawer_Drawer_loadDocument));

        await new Promise((res, rej) => {
          const request = db.transaction(DBStoreNameV2.documentStore, "readonly").objectStore(DBStoreNameV2.documentStore).getAll();

          request.onerror = (e) => {
            rej(e);
          }

          request.onsuccess = () => {
            dispatch(setDrawerList(request.result));
            res(0);
          }
        })
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

  const drawerAddDocumentButton = async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Drawer_Drawer_addDocument));

      const newStockRecord = {
        stockRecordArray: []
      }

      // Add new stockRecord
      const newStockRecordId = await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.stockRecordStore, "readwrite").objectStore(DBStoreNameV2.stockRecordStore).add(newStockRecord);

        request.onerror = (e) => {
          rej(e);
        }

        request.onsuccess = () => {
          res(request.result);
        }
      })

      const newDocument = {
        name: "newDocument",
        recordId: newStockRecordId,
        type: "stock",
      }

      // Add new document
      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.documentStore, "readwrite").objectStore(DBStoreNameV2.documentStore).add(newDocument);

        request.onerror = (e) => {
          rej(e);
        }

        request.onsuccess = () => {
          res(0);
        }
      })

      // Read all document
      await new Promise((res, rej) => {
        const request = db.transaction(DBStoreNameV2.documentStore, "readonly").objectStore(DBStoreNameV2.documentStore).getAll();

        request.onerror = (e) => {
          rej(e);
        }

        request.onsuccess = () => {
          dispatch(setDrawerList(request.result));
          res(0);
        }
      })

      dispatch(deleteLoading(LoadingString.components_Drawer_Drawer_addDocument));
    } catch (e) {
      console.log(e);
      dispatch(deleteLoading(LoadingString.components_Drawer_Drawer_addDocument));
    }
  }

  const editDrawerOnclick = React.useCallback((editingDocumentArray) => {
    dispatch(setEditingDocumentArray(!editingDocumentArray));
  }, []);

  return (
    <div>
      {
        <>
          <EditDrawerArray />
          <React.Fragment key={'left'}>
            <IconButton
              onClick={toggleDrawer(true)}
              style={{
                backgroundColor: '#ddffdd',
                boxShadow: '0 0 10px 0 #ccffcc',
                position: 'fixed',
                zIndex: '1',
                left: '15px',
                bottom: '15px',
              }}>
              <LibraryBooksIcon />
            </IconButton>
            <SwipeableDrawer
              anchor={'left'}
              open={showDrawer}
              onClose={toggleDrawer(false)}
              onOpen={toggleDrawer(true)}
            >
              <Box
                style={{
                  // width: "100px",
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
        </>
      }
    </div>
  );
}

export default SwipeableTemporaryDrawer;
