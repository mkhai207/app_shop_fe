import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'

export const getCategories = async () => {
  try {
    const res = await axios.get(`${CONFIG_API.CATEGORY.INDEX}/get-categories`)

    return res.data
  } catch (error) {
    return error
  }
}
