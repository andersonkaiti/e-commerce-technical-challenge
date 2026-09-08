'use client'

import type { IProduct } from '@entities/product'

export const CART_STORAGE_KEY = '@e-commerce:cart'

export function loadStoredItems(): IProduct[] {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY)

    return stored ? (JSON.parse(stored) as IProduct[]) : []
  } catch {
    return []
  }
}

export function saveStoredItems(items: IProduct[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
}
