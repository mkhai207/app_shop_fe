import { useCallback } from 'react'
import { getOrders, GetOrdersResponse } from 'src/services/order'

export const useOrder = () => {
  const fetchOrders = useCallback(async (): Promise<GetOrdersResponse> => {
    return await getOrders()
  }, [])

  return {
    fetchOrders
  }
} 