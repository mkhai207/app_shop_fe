import { useCallback } from 'react'
import { getOrders, createOrder, GetOrdersResponse, CreateOrderResponse } from 'src/services/order'
import { TCreateOrder } from 'src/types/order'

export const useOrder = () => {
  const fetchOrders = useCallback(async (): Promise<GetOrdersResponse> => {
    return await getOrders()
  }, [])

  const createNewOrder = useCallback(async (orderData: TCreateOrder): Promise<CreateOrderResponse> => {
    return await createOrder(orderData)
  }, [])

  return {
    fetchOrders,
    createNewOrder
  }
} 