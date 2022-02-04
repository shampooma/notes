export enum DBStoreNameV2 {
  documentStore = "document",
  stockRecordStore = "stock",
  canvasRecordStore = "canvas",
}

export interface DBStockRecordV2 {
  name: string,
  price: number,
  position: number,
}

export interface DBStockStoreItemV2 {
  id: string,
  stockRecordArray: DBStockRecordV2[]
}

export type DBDocumentTypeV2 = 'canvas' | 'stock';

export interface DBDocumentStoreItemV2 {
  id: string,
  name: string,
  type: DBDocumentTypeV2,
  recordId: number
}
