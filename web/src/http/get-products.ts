import type { IProduct } from '@entities/product'
import { httpClient } from './http-client'

export function getProducts() {
  return httpClient.get<IProduct[]>('/products')
}
