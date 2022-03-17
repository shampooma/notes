
import Dexie, { Table } from 'dexie';

export enum DBStoreNameV2 {
  documentStore = "document",
  stockRecordStore = "stock",
  canvasRecordStore = "canvas",
}

export interface DBStockRecord {
  name: string,
  price: number,
  position: number,
}

export interface DBPutStockRecord {
  name?: string,
  price?: number,
  position?: number,
}

export interface DBPasswordMetaDataStoreItem {
  id?: number,
}

export interface DBPasswordItemStoreItem {
  id?: number,
  passwordMetaDataStoreId: number,
  description: string,
  name: string,
  password: string
}

export interface DBStockRecordStoreItem {
  id?: number,
  stockRecordArray: DBStockRecord[]
}

export enum DBDocumentTypeEnum {
  "stock",
  "password",
}

export interface DBDocumentStoreItem {
  id?: number,
  name: string,
  type: DBDocumentTypeEnum,
  recordId: number
}

// class NoteDb extends Dexie {
//   stockRecordStore!: Table<DBStockRecordStoreItem>;
//   passwordStore!: Table<DBPasswordStoreItem>;
//   documentStore!: Table<DBDocumentStoreItem>;


//   constructor() {
//     super('NoteDb');
//     this.version(5).stores({
//       stockRecordStore: '++id',
//       passwordStore: '++id',
//       documentStore: '++id, name, recordId',
//     });
//   }
// }

// export const db = new NoteDb();


export const db = new Dexie("NoteDb");

db.version(1).stores({
  stockRecordStore: '++id',
  passwordMetaDataStore: '++id',
  documentStore: '++id, name, recordId',
  passwordItemStore: '++id, passwordMetaDataStoreId',
});
