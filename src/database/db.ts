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

export enum DBTodoRecordStatus {
  "pending",
  "done",
  "failed",
  "progress"
}

export interface DBTodoRecord {
  id?: number,
  documentId: number,
  thing: string,
  status: DBTodoRecordStatus
}

export enum DBDocumentTypeEnum {
  "stock",
  "password",
  "todo"
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
//   todoRecordStore!: Table<DBTodoRecord>;

//   constructor() {
//     super('NoteDb');
//     this.version(1).stores({
//       stockRecordStore: '++id, documentId',
//       passwordRecordStore: 'documentId',
//       documentStore: '++id',
//     });

//     this.version(2).stores({
//       todoRecordStore: '++id, documentId'
//     })

//   }
// }

// export const db = new NoteDb();

export const db = new Dexie("NoteDb");

db.version(1).stores({
  stockRecordStore: '++id, documentId',
  passwordRecordStore: 'documentId',
  documentStore: '++id',
});

db.version(2).stores({
  todoRecordStore: '++id, documentId'
})
