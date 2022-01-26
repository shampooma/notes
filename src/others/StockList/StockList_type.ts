interface BaseItem {
  name: string
  price: number
  position: number
}

export interface AddItem extends BaseItem {
}

export interface UpdateItem extends BaseItem {
  id: number
}

export interface GeneralItem extends BaseItem {
  id: number
}
