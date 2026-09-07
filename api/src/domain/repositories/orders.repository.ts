import type { IOrder, IOrderDetails } from '../entities/order.entity.ts'

export interface IUpdateOrderItem {
  orderId: string
  productId: string
  quantity: number
}

export interface IRemoveOrderItem {
  orderId: string
  productId: string
}

export interface IOrdersRepository {
  createOrder(data: Omit<IOrder, 'id'>): Promise<void>
  getOrderById(orderId: string): Promise<IOrderDetails | undefined>
  updateItemQuantity(data: IUpdateOrderItem): Promise<void>
  removeItem(data: IRemoveOrderItem): Promise<void>
}
