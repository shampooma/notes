
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

export interface DBStockRecordStoreItem {
  id?: number,
  stockRecordArray: DBStockRecord[]
}

export interface DBDocumentStoreItem {
  id?: number,
  name: string,
  type: string,
  recordId: number
}

// export class NoteDb extends Dexie {
//   stockRecordStore!: Table<DBStockRecordStoreItem>;
//   documentStore!: Table<DBDocumentStoreItem>;

//   constructor() {
//     super('NoteDb');
//     this.version(5).stores({
//       stockRecordStore: '++id',
//       documentStore: '++id, name, recordId'
//     });
//   }
// }


export const db = new Dexie("NoteDb");
db.version(1).stores({
  stockRecordStore: '++id',
  documentStore: '++id, name, recordId'
});;
