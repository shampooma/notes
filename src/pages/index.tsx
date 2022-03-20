import Drawer from "components/Drawer/Drawer";
import Loading from "components/Loading/Loading";
import StockList from "components/StockList/StockList";
import Password from "components/Password/Password";
import { db, DBDocumentTypeEnum } from "database/db";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { setDocumentIndex, } from "components/index/index_slice";
import * as React from "react";
import Box from '@mui/material/Box';

const IndexPage = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { documentIndex, documentArray } = useIndexSelector((state) => {
    return {
      documentIndex: state.index.documentIndex,
      documentArray: state.Drawer.drawer.documentArray,
    }
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    _  _ ____ ____ _  _ ____
  // |  | [__  |___    |__| |  | |  | |_/  [__
  // |__| ___] |___    |  | |__| |__| | \_ ___]
  React.useEffect(() => {
    if (documentArray.length > 0 && documentIndex === -1) {
      dispatch(setDocumentIndex(0));
    }
  }, [documentArray]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]
  const PageContent = React.useCallback(() => {
    let Component;

    switch (documentArray[documentIndex].type) {
      case DBDocumentTypeEnum.stock:
        Component = <StockList />
        break;
      case DBDocumentTypeEnum.password:
        Component = <Password />
        break;
      default:
        Component = <></>
    }

    return Component;
  }, [documentArray, documentIndex]);

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<>
    <Loading></Loading>
    {
      db != null &&
      <>
        <Drawer></Drawer>
        {
          documentIndex === -1 ?
            <Box
              display="flex"
              justifyContent="center"
            >
              <h1>No document have been created</h1>
            </Box> :
            <PageContent />
        }
      </>
    }
  </>);
}

export default IndexPage