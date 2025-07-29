import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
import { TParams } from 'src/types/order'

export const getListOrders = async (data: { params: TParams; paramsSerializer?: (params: any) => string }) => {
  try {
    const res = await instanceAxios.get(`${CONFIG_API.ORDER.INDEX}/get-orders`, {
      params: data.params,
      paramsSerializer: data.paramsSerializer
    })

    return res.data
  } catch (error) {
    return error
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
