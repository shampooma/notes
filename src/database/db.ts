import Dexie, { Table } from 'dexie';

export interface DBStockRecord {
  id?: number,
  documentId: number,
  name: string,
  price: number,
  position: number,
}

export interface DBPasswordRecord {
  id?: number,
  documentId: number,
  description: string,
  name: string,
  password: string
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
//   passwordRecordStore!: Table<DBPasswordRecord>;
//   documentStore!: Table<DBDocumentStoreItem>;


//   constructor() {
//     super('NoteDb');
//     this.version(5).stores({
//       stockRecordStore: '++id, documentId',
//       passwordRecordStore: '++id, documentId',
//       documentStore: '++id',
//     });
//   }
// }

// export const db = new NoteDb();


export const db = new Dexie("NoteDb");

db.version(1).stores({
  stockRecordStore: '++id, documentId',
  passwordRecordStore: '++id, documentId',
  documentStore: '++id',
});
