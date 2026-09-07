import type { IOrder } from '../entities/order.entity.ts'

export interface IOrdersRepository {
  createOrder(data: Omit<IOrder, 'id'>): Promise<void>
}
