import { DBStoreNameV1 } from "indexeddb/versions/v1/type";

export const upgradeV1 = (e: IDBVersionChangeEvent, request: IDBOpenDBRequest) => {
    const db = request.result;

    db.createObjectStore(DBStoreNameV1.stockStore, { keyPath: 'id', autoIncrement: true });
}
