import Dexie, { Table } from 'dexie';

export interface DBStockRecord {
  id?: number,
  documentId: number,
  name: string,
  price: number,
  position: number,
}

export interface DBPasswordRecordData {
  description: string,
  name: string,
  password: string
}

export interface DBPasswordRecordItem {
  documentId: number,
  encryptedData: string
  HMAC: string,
}

export enum DBDocumentTypeEnum {
  "stock",
  "password",
}

export interface DBDocumentStoreItem {
  id?: number,
  name: string,
  type: DBDocumentTypeEnum,
}

// class NoteDb extends Dexie {
//   stockRecordStore!: Table<DBStockRecord>;
//   passwordRecordStore!: Table<DBPasswordRecordItem>;
//   documentStore!: Table<DBDocumentStoreItem>;

//   constructor() {
//     super('NoteDb');
//     this.version(1).stores({
//       stockRecordStore: '++id, documentId',
//       passwordRecordStore: 'documentId',
//       documentStore: '++id',
//     });
//   }
// }

// export const db = new NoteDb();

export const db = new Dexie("NoteDb");

db.version(1).stores({
  stockRecordStore: '++id, documentId',
  passwordRecordStore: 'documentId',
  documentStore: '++id',
});
