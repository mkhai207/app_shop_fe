import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'

export interface TDiscount {
  id: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string | null
  code: string
  name: string | null
  description: string | null
  discount_value: string
  discount_type: 'PERCENTAGE' | 'FIXED'
  valid_from: string
  valid_until: string
  minimum_order_value: number
  max_discount_amount: number
}

export const getDiscountByCode = async (code: string) => {
  try {
    const res = await axios.get(`${CONFIG_API.DISCOUNT.INDEX}/get-discount/${code}`)

    return res.data
  } catch (error) {
    return error
  }
}
