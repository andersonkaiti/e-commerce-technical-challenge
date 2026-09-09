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
    product: {
      id: string
      priceInCents: number
      createdAt: Date
      updatedAt: Date
      name: string
      description: string
      imageUrl: string
    }
  }[]
}
