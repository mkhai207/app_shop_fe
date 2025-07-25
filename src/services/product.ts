import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'
import { TParamsGetProducts } from 'src/types/product'

export const getAllProductsPublic = async (data: { params: TParamsGetProducts }) => {
  try {
    const res = await axios.get(CONFIG_API.MANAGE_PRODUCT.PRODUCT.GET_ALL_PRODUCTS_PUBLIC, {
      params: data.params
    })

    return res.data
  } catch (error) {
    return error
  }
}

export const getDetailsProductPublic = async (id: string) => {
  try {
    const res = await axios.get(`${CONFIG_API.MANAGE_PRODUCT.PRODUCT.GET_DETAIL_PRODUCT_PUBLIC}/${id}`)

    return res.data
  } catch (error) {
    return error
  }
}
