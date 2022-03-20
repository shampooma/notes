import * as React from "react"
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks"; // Import hooks for redux, just added typing for useSelector and useDispatch
import { db, DBDocumentTypeEnum } from "database/db";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from "@mui/material/Box";
import { setCreatingDocument } from "components/Drawer/NewDocumentDialog/NewDocumentDialog_slice";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { setInteractingDocumentId } from "components/index/index_slice";
import { LoadingString } from 'components/Loading/Loading_type';
import { setDocumentArray } from 'components/Drawer/Drawer_slice';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import KeyIcon from '@mui/icons-material/Key';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';

const documentArray = [
  {
    icon: ShowChartIcon,
    title: 'Stock Record',
  },
  {
    icon: KeyIcon,
    title: "Password Record",
  }
]

const NewDocumentDialog = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { creatingDocument, interactingDocumentId } = useIndexSelector((state) => { // Get global state that needed
    return {
      creatingDocument: state.Drawer.newDocument.creatingDocument,
      interactingDocumentId: state.index.interactingDocumentId,
    }
  });

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___
  const [documentType, setDocumentType] = React.useState<DBDocumentTypeEnum>(DBDocumentTypeEnum.stock);
  const [documentName, setDocumentName] = React.useState<string>("");


  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  React.useEffect(() => {
    setDocumentName("new document")
  }, [creatingDocument])

  const closeDialog = React.useCallback(() => {
    dispatch(setCreatingDocument(false));
  }, []);

  const documentCardOnClick = React.useCallback((index: number) => {
    setDocumentType(index);
  }, []);

  const createDocumentButtonOnClick = React.useCallback(async () => {
    try {
      dispatch(pushLoading(LoadingString.components_Drawer_Drawer_addDocument));

      const newDocument = {
        name: documentName,
        type: documentType,
      }

      // Add new document
      const newDocumentId = await db.documentStore.add(newDocument);

      if (interactingDocumentId === -1) {
        dispatch(setInteractingDocumentId(Number(newDocumentId)));
      }

      const documentArray = await db.documentStore.toArray();
      dispatch(setDocumentArray(documentArray))

      dispatch(setCreatingDocument(false));
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(deleteLoading(LoadingString.components_Drawer_Drawer_addDocument));
    }
  }, [documentType, documentName]);

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<Dialog
    open={creatingDocument}
    onClose={closeDialog}
    fullWidth
    maxWidth="sm"
  >
    <DialogTitle>
      <TextField
        id="standard-basic"
        label="Document name"
        variant="standard"
        value={documentName}
        onChange={(e) => setDocumentName(e.target.value)}
        style={{ width: "100%" }}
      />
    </DialogTitle>
    <DialogContent

    >
      <h5>Type:</h5>
      <Box
        display="flex"
        justifyContent="center"
      >
        {documentArray.map((item, i) => (
          <Card
            key={i}
            style={{
              width: "300px",
              margin: "10px",
              display: 'inline-block'
            }}
          >
            <CardActionArea
              style={{ backgroundColor: documentType == i ? "#efe" : "#fff" }}
              onClick={() => documentCardOnClick(i)}
            >
              <CardMedia>
                <Box
                  display="flex"
                  // width="100%"
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
        ))}
      </Box>
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

export default NewDocumentDialog;