export enum DBStoreNameV1 {
  stockStore = "stockStore",
}

export interface StockListItemV1 {
  id: string,
  name: string,
  price: number,
  position: number,
}