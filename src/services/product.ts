import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
import { TParamsGetProducts } from 'src/types/product'

export const getAllProductsPublic = async (data: {
  params: TParamsGetProducts
  paramsSerializer?: (params: any) => string
}) => {
  try {
    const res = await axios.get(CONFIG_API.MANAGE_PRODUCT.PRODUCT.GET_ALL_PRODUCTS_PUBLIC, {
      params: data.params,
      paramsSerializer: data.paramsSerializer
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

export const searchProducts = async (data: {
  params: TParamsGetProducts
  paramsSerializer?: (params: any) => string
}) => {
  try {
    const res = await axios.get(`${CONFIG_API.MANAGE_PRODUCT.PRODUCT.INDEX}/search`, {
      params: data.params,
      paramsSerializer: data.paramsSerializer
    })

    return res.data
  } catch (error) {
    return error
  }
}

export const getProductRecommend = async (id: string) => {
  try {
    const res = await instanceAxios.get(`${CONFIG_API.AI_RECOMMEND.INDEX}/${id}`)

    return res.data
  } catch (error) {
    return error
  }
}
