import type { IProduct } from '@entities/product'
import { httpClient } from './http-client'

export async function getProducts() {
  return httpClient.get<IProduct[]>('/products')
}
