import type { IOrder } from '@entities/order'
import { httpClient } from './http-client'

interface ICreateOrderResponse {
  orderId: string
}

export function createOrder(data: IOrder) {
  return httpClient.post<ICreateOrderResponse>('/carrinho', data)
}
