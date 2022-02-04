import Drawer from "components/Drawer/Drawer";
import Loading from "components/Loading/Loading";
import StockList from "components/StockList/StockList";
import { DBChangeVersion } from "indexeddb/changeVersion";
import { DBName, DBCurrentVersion } from "indexeddb/config";
import { DBStoreNameV2 } from "indexeddb/type";
import { useIndexSelector, useIndexDispatch } from "components/index/index_hooks";
import { setDb, } from "components/index/index_slice";
import * as React from "react";
import { LoadingString } from "components/Loading/Loading_type";
import { pushLoading, deleteLoading } from "components/Loading/Loading_slice";

const IndexPage = () => {
  console.log("index.tsx");
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useIndexDispatch();
  const { db, documentIndex } = useIndexSelector((state) => {
    return {
      db: state.index.db,
      documentIndex: state.index.documentIndex,
    }
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |
  React.useEffect(() => {
    (async () => {
      await new Promise((res, rej) => {
        const loadingString = LoadingString.page_index_openDB;
        
        dispatch(pushLoading(loadingString))
        

        const request = self.indexedDB.open(DBName, DBCurrentVersion);

        // Error for connecting to db
        request.onerror = () => {
          dispatch(deleteLoading(loadingString));
          rej(1);
        }

        // Upgrade db
        request.onupgradeneeded = async (e) => {
          DBChangeVersion(e, request);
        }

        // Success for connecting to db
        request.onsuccess = () => {
          
          dispatch(setDb(request.result));

          dispatch(deleteLoading(loadingString));
          res(0);
        }
      })
    })()
  }, []);

  React.useEffect(() => {
    (async () => {
      if (db === null) {
        return;
      }

      await new Promise((res, rej) => {
        dispatch(pushLoading(LoadingString.components_index_loadDocument));

        const request = db.transaction(DBStoreNameV2.documentStore, "readwrite").objectStore(DBStoreNameV2.documentStore).getAll();

        request.onerror = () => {
          dispatch(deleteLoading(LoadingString.components_index_loadDocument));
          rej(1);
        }
        request.onsuccess = () => {
          dispatch(deleteLoading(LoadingString.components_index_loadDocument));
          res(0);
        }
      })
    })();
  }, [db]);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (<>
    <Loading></Loading>
    {
      db !== null && 
      <>
        <Drawer></Drawer>
        {
          documentIndex === -1 ?
            <h1>Please create new document</h1> :
            <>
              <StockList></StockList>
            </>
        }
      </>
    }
  </>);
}

export default IndexPage