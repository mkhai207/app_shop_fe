import { useState, useCallback } from 'react'
import { categoryService } from 'src/services/category'
import { TCategory, CategoryResponse } from 'src/types/category'

export const useCategory = () => {
  const [categories, setCategories] = useState<TCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response: CategoryResponse = await categoryService.getCategories()
      
      if (response.status === 'success' && response.data) {
        setCategories(response.data)
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải danh sách phân loại')
      }
      
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

  const createCategory = useCallback(async (categoryData: { code: string; name: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Hook: Creating category with data:', categoryData)
      
      const response = await categoryService.createCategory(categoryData)
      
      console.log('Hook: API response:', response)
      
      if (response.status === 'success') {
        // Refresh danh sách categories sau khi tạo thành công
        await fetchCategories()
        return response
      } else {
        const errorMessage = response.message || 'Có lỗi xảy ra khi tạo phân loại'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (err: any) {
      console.error('Hook: Create category error:', err)
      
      // Sử dụng error message từ service đã được xử lý
      const errorMessage = err.message || 'Có lỗi xảy ra khi tạo phân loại'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [fetchCategories])

  const updateCategory = useCallback(async (id: number, categoryData: { code?: string; name?: string }) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Hook: Updating category with ID:', id)
      console.log('Hook: Update data:', categoryData)
      
      const response = await categoryService.updateCategory(id, categoryData)
      
      console.log('Hook: Update API response:', response)
      
      if (response.status === 'success') {
        // Refresh danh sách categories sau khi cập nhật thành công
        await fetchCategories()
        return response
      } else {
        const errorMessage = response.message || 'Có lỗi xảy ra khi cập nhật phân loại'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (err: any) {
      console.error('Hook: Update category error:', err)
      
      // Sử dụng error message từ service đã được xử lý
      const errorMessage = err.message || 'Có lỗi xảy ra khi cập nhật phân loại'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [fetchCategories])

  const deleteCategory = useCallback(async (id: number) => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('Hook: Deleting category with ID:', id)
      
      const response = await categoryService.deleteCategory(id)
      
      console.log('Hook: Delete API response:', response)
      
      if (response.status === 'success') {
        // Refresh danh sách categories sau khi xóa thành công
        await fetchCategories()
        return response
      } else {
        const errorMessage = response.message || 'Có lỗi xảy ra khi xóa phân loại'
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    } catch (err: any) {
      console.error('Hook: Delete category error:', err)
      
      // Sử dụng error message từ service đã được xử lý
      const errorMessage = err.message || 'Có lỗi xảy ra khi xóa phân loại'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    fetchCategories,
    updateCategories,
    createCategory,
    updateCategory,
    deleteCategory
  }
} 