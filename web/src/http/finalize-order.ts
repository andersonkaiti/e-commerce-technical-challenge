import { httpClient } from './http-client'

export function finalizeOrder(orderId: string) {
  return httpClient.post('/order/finalize', { orderId })
}
