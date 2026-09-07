export interface IProduct {
  id: string
  name: string
  description: string
  imageUrl: string
  priceInCents: number
  createdAt: string | Date
  updatedAt: string | Date
}
