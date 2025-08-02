import axios from 'src/helpers/axios'
import { CategoryResponse } from 'src/types/category'
import { CONFIG_API } from 'src/configs/api'

export const categoryService = {
  getCategories: async (): Promise<CategoryResponse> => {
    const response = await axios.get(CONFIG_API.CATEGORY.GET_CATEGORIES)
    
    return response.data
  }
} 