import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'

export const getBrands = async () => {
  try {
    const res = await axios.get(`${CONFIG_API.BRAND.INDEX}/get-brands`)

    return res.data
  } catch (error) {
    return error
  }
}
