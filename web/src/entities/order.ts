export interface IOrderItem {
  productId: string
  quantity: number
  priceInCents: number
}

export interface IOrder {
  customerEmail: string
  items: IOrderItem[]
}
