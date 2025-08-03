import instanceAxios from 'src/helpers/axios'
import { TReview, NewReview, ReviewFilter, ReviewResponse } from 'src/types/review'

export const reviewService = {
  // Lấy danh sách đánh giá
  getReviews: async (filter?: ReviewFilter): Promise<ReviewResponse> => {
    console.log('🔄 Calling API getReviews with params:', filter)
    try {
      const response = await instanceAxios.get('/reviews/get-reviews', { params: filter })
      console.log('✅ API Response:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ API Error:', error)
      throw error
    }
  },

  // Lấy đánh giá theo ID
  getReviewById: async (id: number) => {
    const response = await instanceAxios.get(`/reviews/${id}`)
    return response.data
  },

  // Tạo đánh giá mới
  createReview: async (review: NewReview) => {
    console.log('🔄 Calling API createReview with data:', review)
    try {
      const response = await instanceAxios.post('/reviews/create-review', review)
      console.log('✅ Create review successful:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ Create review failed:', error)
      throw error
    }
  },

  // Cập nhật đánh giá
  updateReview: async (id: number, review: Partial<TReview>) => {
    const response = await instanceAxios.put(`/reviews/${id}`, review)
    return response.data
  },

  // Xóa đánh giá
  deleteReview: async (id: number) => {
    const response = await instanceAxios.delete(`/reviews/${id}`)
    return response.data
  },

  // Lấy đánh giá theo sản phẩm
  getReviewsByProduct: async (productId: number, filter?: ReviewFilter) => {
    const response = await instanceAxios.get(`/products/${productId}/reviews`, { params: filter })
    return response.data
  },

  // Lấy đánh giá theo người dùng
  getReviewsByUser: async (userId: number, filter?: ReviewFilter) => {
    const response = await instanceAxios.get(`/users/${userId}/reviews`, { params: filter })
    return response.data
  },


} 