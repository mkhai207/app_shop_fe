import { useState, useCallback } from 'react'
import { categoryService } from 'src/services/category'
import { TCategory } from 'src/types/category'

export const useCategory = () => {
  const [categories, setCategories] = useState<TCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await categoryService.getCategories()
      setCategories(response.data)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải danh sách phân loại'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateCategories = useCallback((newCategories: TCategory[]) => {
    setCategories(newCategories)
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    updateCategories
  }
} 