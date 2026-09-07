export interface IOrder {
  id: string
  customerEmail: string
  items: {
    productId: string
    quantity: number
    priceInCents: number
  }[]
}
