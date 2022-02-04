import { DBStoreNameV1 } from "indexeddb/versions/v1/type";
import { DBStoreNameV2, DBStockRecordV2 } from "indexeddb/versions/v2/type";

export const upgradeV2 = (e: IDBVersionChangeEvent, request: IDBOpenDBRequest) => {
  const db = request.result;

  // Create new store
  db.createObjectStore(DBStoreNameV2.documentStore, { keyPath: 'id', autoIncrement: true }),
  db.createObjectStore(DBStoreNameV2.stockRecordStore, { keyPath: 'id', autoIncrement: true })
  db.createObjectStore(DBStoreNameV2.canvasRecordStore, { keyPath: 'id', autoIncrement: true })

  // Delete stockStore (v1)
  db.deleteObjectStore(DBStoreNameV1.stockStore);
}
