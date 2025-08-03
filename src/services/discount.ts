import { axiosInstance } from 'src/helpers/axios'
import { CONFIG_API } from 'src/configs/api'
import { TDiscount, DiscountResponse, NewDiscount } from 'src/types/discount'

export const discountService = {
  // Lấy danh sách tất cả khuyến mãi
  getDiscounts: async (): Promise<DiscountResponse> => {
    const response = await axiosInstance.get(CONFIG_API.DISCOUNT.GET_DISCOUNTS)
    return response.data
  },

  // Lấy thông tin một khuyến mãi theo ID
  getDiscountById: async (id: number): Promise<{ data: TDiscount }> => {
    const response = await axiosInstance.get(`${CONFIG_API.DISCOUNT.INDEX}/${id}`)
    return response.data
  },

  // Tạo khuyến mãi mới
  createDiscount: async (discount: NewDiscount): Promise<{ data: TDiscount }> => {
    const response = await axiosInstance.post(CONFIG_API.DISCOUNT.CREATE_DISCOUNT, discount)
    return response.data
  },

  // Cập nhật khuyến mãi
  updateDiscount: async (id: number, discount: Partial<NewDiscount>): Promise<{ data: TDiscount }> => {
    const response = await axiosInstance.put(`${CONFIG_API.DISCOUNT.INDEX}/${id}`, discount)
    return response.data
  },

  // Xóa khuyến mãi
  deleteDiscount: async (id: number): Promise<{ message: string }> => {
    const response = await axiosInstance.delete(`${CONFIG_API.DISCOUNT.INDEX}/${id}`)
    return response.data
  }
} 