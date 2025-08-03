import instanceAxios from 'src/helpers/axios'
import { CONFIG_API } from 'src/configs/api'
import { TOrder, TCreateOrder } from 'src/types/order'

export type Order = TOrder

export interface GetOrdersResponse {
  status: string
  statusCode: number
  message: string
  data: Order[]
  error: null
  meta: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

export interface CreateOrderResponse {
  status: string
  statusCode: number
  message: string
  data: Order
  error: null
}

export const getOrders = async (): Promise<GetOrdersResponse> => {
  try {
    const res = await instanceAxios.get(CONFIG_API.ORDER.GET_ORDERS)
    return res.data
  } catch (error) {
    throw error
  }
}

export const createOrder = async (orderData: TCreateOrder): Promise<CreateOrderResponse> => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.ORDER.INDEX}/create`, orderData)
    return res.data
  } catch (error) {
    throw error
  }
}

export const retryPayOrder = async (id: string) => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.ORDER.INDEX}/${id}/retry-payment`)

    return res.data
  } catch (error) {
    return error
  }
}

export const getOrderDetail = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${CONFIG_API.ORDER.INDEX}/get-orders/${id}`)

    return res.data
  } catch (error) {
    return error
  }
}
