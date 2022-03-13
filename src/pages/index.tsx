import Drawer from "components/Drawer/Drawer";
import Loading from "components/Loading/Loading";
import StockList from "components/StockList/StockList";
import { db } from "database/db";
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
      documentArray: state.Drawer.drawer.documentArray
    }
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |

  React.useEffect(() => {
    if (documentArray.length > 0 && documentIndex === -1) {
      dispatch(setDocumentIndex(0));
    }
  }, [documentArray]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]

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
              <h1>No document have been selected</h1>
            </Box> :
            <>
              <StockList></StockList>
            </>
        }
      </>
    }
  </>);
}

export default IndexPage