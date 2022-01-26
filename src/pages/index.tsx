import * as React from "react"

import * as indexEnum from "others/App_enum";
import StockList from "components/StockList/StockList";
import Loading from "components/Loading";
import { useAppSelector, useAppDispatch } from "others/index_hooks"
import { setDb, setLoading } from "others/App_slice";

const IndexPage = () => {
  // ____ _    ____ ___  ____ _       ____ ___ ____ ___ ____
  // | __ |    |  | |__] |__| |       [__   |  |__|  |  |___
  // |__] |___ |__| |__] |  | |___    ___]  |  |  |  |  |___
  const dispatch = useAppDispatch();
  const db = useAppSelector((state) => {
    return state.app.db
  })

  // _    ____ ____ ____ _       ____ ___ ____ ___ ____
  // |    |  | |    |__| |       [__   |  |__|  |  |___
  // |___ |__| |___ |  | |___    ___]  |  |  |  |  |___

  // _  _ ____ ____    ____ ____ ____ ____ ____ ___
  // |  | [__  |___    |___ |___ |___ |___ |     |
  // |__| ___] |___    |___ |    |    |___ |___  |
  React.useEffect(() => {
    dispatch(setLoading(true))
    const openDBReq = self.indexedDB.open('Testing', 1);

    // Error for connecting to db
    openDBReq.onerror = () => {
      console.log(`db error | ${openDBReq.error}`);

      dispatch(setLoading(false));
    }

    // Success for connecting to db
    openDBReq.onsuccess = () => {
      console.log('connect to db success')
      dispatch(setDb(openDBReq.result));

      dispatch(setLoading(false))
    }

    // Upgrade db
    openDBReq.onupgradeneeded = () => {
      const db = openDBReq.result;

      db.createObjectStore(indexEnum.DBStoreName.stockStore, { keyPath: 'id', autoIncrement: true });
    }
  }, []);

  // ____ _  _ _  _ ____ ___ _ ____ _  _ ____
  // |___ |  | |\ | |     |  | |  | |\ | [__
  // |    |__| | \| |___  |  | |__| | \| ___]

  // ____ ____ ___ _  _ ____ _  _
  // |__/ |___  |  |  | |__/ |\ |
  // |  \ |___  |  |__| |  \ | \|
  return (
    <>
      {
        (() => {
          if (db === null) {
            return <></>
          } else {
            return (<>
              <Loading></Loading>
              <StockList></StockList>
            </>)
          }
        })()
      }

    </>
  )
}

export default IndexPage