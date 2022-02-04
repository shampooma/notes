import { DBStockRecordV2, DBPutStockRecordV2, DBStoreNameV2, DBStockStoreItemV2 } from "../../type";

export const putStockStockRecord = async ({
  db,
  stockRecordArrayIndex,
  newStockRecord,
  stockItemId,
}: { // Parameters type
  db: IDBDatabase,
  stockRecordArrayIndex: number,
  newStockRecord: DBPutStockRecordV2,
  stockItemId: number,
}): Promise<{
  error: null | unknown,
  resolve: null | DBStockRecordV2[],
}> => { // Function start
  const returnObj: {
    error: null | unknown,
    resolve: null | DBStockRecordV2[],
  } = {
    error: null,
    resolve: null,
  }

  try {
    // Read stockStoreItem
    const stockStoreItem = await new Promise<DBStockStoreItemV2>((res, rej) => {
      const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readonly').objectStore(DBStoreNameV2.stockRecordStore).get(stockItemId);

      request.onerror = (e) => {
        rej(e);
      }

      request.onsuccess = () => {
        console.log(request.result);
        res(request.result);
      }
    });

    // Put stockRecord
    stockStoreItem.stockRecordArray[stockRecordArrayIndex] = {
      ...stockStoreItem.stockRecordArray[stockRecordArrayIndex],
      ...newStockRecord
    }

    await new Promise((res, rej) => {
      const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readwrite').objectStore(DBStoreNameV2.stockRecordStore).put(stockStoreItem);

      request.onerror = (e) => {
        rej(e);
      }

      request.onsuccess = () => {
        res(0);
      }
    })

    returnObj["resolve"] = await new Promise<DBStockRecordV2[]>((res, rej) => {
      const request = db.transaction(DBStoreNameV2.stockRecordStore, 'readonly').objectStore(DBStoreNameV2.stockRecordStore).get(stockItemId);

      request.onerror = (e) => {
        rej(e);
      }

      request.onsuccess = () => {
        res(request.result.stockRecordArray);
      }
    })
  } catch (e) {
    returnObj["error"] = e;
  }

  return new Promise(res => res(returnObj))
}