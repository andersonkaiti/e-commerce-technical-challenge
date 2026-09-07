export interface IOrder {
  id: string
  customerEmail: string
  items: {
    productId: string
    quantity: number
    priceInCents: number
  }[]
}

export interface IOrderDetails {
  id: string
  customerEmail: string
  items: {
    productId: string
    productName: string
    quantity: number
    priceInCents: number
  }[]
}
