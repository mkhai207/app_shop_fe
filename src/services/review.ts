import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'

export const createReview = async (reviewData: any) => {
  try {
    const res = await instanceAxios.post(`${CONFIG_API.REVIEW.INDEX}/create-review`, reviewData)

    return res.data
  } catch (error) {
    return error
  }
}

export const getReviewsByProductId = async (productId: string) => {
  try {
    const res = await axios.get(`${CONFIG_API.REVIEW.INDEX}/get-reviews/${productId}`)

    return res.data
  } catch (error) {
    return error
  }
}

export const fetchReviewsByProductId = async (query: any) => {
  try {
    const res = await axios.get(`${CONFIG_API.REVIEW.INDEX}/get-reviews`, query)

    return res.data
  } catch (error) {
    return error
  }
}
