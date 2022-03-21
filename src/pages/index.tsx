import Drawer from "components/Drawer/Drawer";
import Loading from "components/Loading/Loading";
import StockList from "components/StockList/StockList";
import Password from "components/Password/Password";
import Todo from "components/Todo/Todo";
import { db, DBDocumentTypeEnum } from "database/db";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { setInteractingDocumentId, } from "components/index/index_slice";
import * as React from "react";
import Box from '@mui/material/Box';
import { LoadingString } from "components/Loading/Loading_type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";
import { useLiveQuery } from "dexie-react-hooks";
import Stackbar from "components/Stackbar/Stackbar";

const IndexPage = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { interactingDocumentId } = useIndexSelector((state) => {
    return {
      interactingDocumentId: state.index.interactingDocumentId,
    }
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  const documentRecord = useLiveQuery(
    () => db.documentStore.get(interactingDocumentId),
    [interactingDocumentId]
  )

  React.useEffect(() => {
    (async () => {
      try {
        dispatch(pushLoading(LoadingString.page_index_determineDocumentId))

        if (interactingDocumentId >= 0) {
          return
        } else {
          const documentArray = await db.documentStore.toArray();

          if (documentArray.length === 0 || documentArray[0].id === undefined) {
            return;
          } else {
            dispatch(setInteractingDocumentId(documentArray[0].id))
          }
        }
      } catch (e) {
        console.log(e);
      } finally {
        dispatch(deleteLoading(LoadingString.page_index_determineDocumentId))
      }
    })();

  }, [interactingDocumentId]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const PageContent = React.useCallback(() => {
    let Component;

    if (documentRecord === undefined) {
      Component = <Box
        display="flex"
        justifyContent="center"
      >
        <h1>No document have been created</h1>
      </Box>

    } else {
      switch (documentRecord.type) {
        case DBDocumentTypeEnum.stock:
          Component = <StockList />
          break;
        case DBDocumentTypeEnum.password:
          Component = <Password />
          break;
        case DBDocumentTypeEnum.todo:
          Component = <Todo />
          break;
        default:
          Component = <></>
      }
    }

    return Component;
  }, [documentRecord]);

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<>
    <Loading />
    <Drawer />
    <Stackbar />
    <PageContent />
  </>)
}

export default IndexPage