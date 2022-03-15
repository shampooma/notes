import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db, DBDocumentTypeEnum } from "database/db";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import { setCreatingDocument } from "components/Drawer/NewDocument/NewDocument_slice";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { LoadingString } from 'components/Loading/Loading_type';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import KeyIcon from '@mui/icons-material/Key';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import { setDrawerArray } from 'components/Drawer/Drawer_slice';


const documentList = [
  {
    icon: ShowChartIcon,
    title: 'Stock Record',
  },
  {
    icon: KeyIcon,
    title: "Password Record",
  }
]

const NewDocument = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { creatingDocument } = useIndexSelector((state) => { // Get global state that needed
    return {
      creatingDocument: state.Drawer.newDocument.creatingDocument,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [documentType, setDocumentType] = React.useState<DBDocumentTypeEnum>(DBDocumentTypeEnum.stock);

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const closeDialog = React.useCallback(() => {
    dispatch(setCreatingDocument(false));
  }, []);

  const documentCardOnClick = React.useCallback((index: number) => {
    setDocumentType(index);
  }, []);

  const createDocumentButtonOnClick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Drawer_Drawer_addDocument));

      let recordId;

      switch (documentType) {
        case DBDocumentTypeEnum.stock:
          const newStockRecord = {
            stockRecordArray: []
          }

          // Add new stockRecord
          recordId = await db.stockRecordStore.add(newStockRecord) as number;
          break;
        case DBDocumentTypeEnum.password:
          const newPasswordMetaData = {
          }

          // Add new passwordMetaData
          recordId = await db.passwordMetaDataStore.add(newPasswordMetaData) as number;
          break;
      }

      const newDocument = {
        name: "newDocument",
        recordId: recordId,
        type: documentType,
      }

      // Add new document
      await db.documentStore.add(newDocument);

      // Read all document
      const documents = await db.documentStore.toArray();

      dispatch(setDrawerArray(documents));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_Drawer_Drawer_addDocument));
    }
  }, [documentType]);

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<Dialog
    open={creatingDocument}
    onClose={closeDialog}
  >
    <DialogTitle>
      {"Create new document"}
    </DialogTitle>
    <DialogContent>
      <ImageList sx={{ width: 500, height: 450 }}>
        {documentList.map((item, i) => (
          <ImageListItem key={i}>
            <Card sx={{ maxWidth: 345 }}>
              <CardActionArea
                style={{backgroundColor: documentType==i ? "#efe" : "#fff"}}
                onClick={() => documentCardOnClick(i)}
              >
                <CardMedia>
                  <Box
                    display="flex"
                    width="100%"
                    justifyContent="center"
                  >
                    <item.icon style={{ fontSize: 100 }} />
                  </Box>
                </CardMedia>
                <CardContent>
                  <ImageListItemBar
                    align="center"
                    title={item.title}
                    position="below"
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </ImageListItem>
        ))}
      </ImageList>
    </DialogContent>
    <DialogActions>
      <Box
        display="flex"
        width="100%"
        justifyContent="center"
      >
        <Button onClick={createDocumentButtonOnClick} autoFocus>
          Create
        </Button>
      </Box>
    </DialogActions>
  </Dialog>);
}

export default NewDocument;