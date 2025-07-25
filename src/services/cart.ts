import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
import { TAddToCart } from 'src/types/cart'

export const addToCart = async (data: TAddToCart) => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.CART.INDEX}/create`, data)

    return res.data
  } catch (error) {
    return error
  }
}
