import { useState, useEffect } from 'react'
import { discountService } from 'src/services/discount'
import { TDiscount, NewDiscount } from 'src/types/discount'

export const useDiscount = () => {
  const [discounts, setDiscounts] = useState<TDiscount[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchDiscounts = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await discountService.getDiscounts()
      setDiscounts(response.data)
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tải danh sách khuyến mãi'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createDiscount = async (discount: NewDiscount) => {
    setLoading(true)
    setError('')
    try {
      const response = await discountService.createDiscount(discount)
      setDiscounts(prev => [...prev, response.data])
      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tạo khuyến mãi'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateDiscount = async (id: number, discount: Partial<NewDiscount>) => {
    setLoading(true)
    setError('')
    try {
      const response = await discountService.updateDiscount(id, discount)
      setDiscounts(prev => prev.map(d => (d.id === id ? response.data : d)))

      return response.data
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể cập nhật khuyến mãi'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deleteDiscount = async (id: number) => {
    setLoading(true)
    setError('')
    try {
      await discountService.deleteDiscount(id)
      setDiscounts(prev => prev.filter(d => d.id !== id))
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Không thể xóa khuyến mãi'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDiscounts()
  }, [])

  return {
    discounts,
    loading,
    error,
    fetchDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount
  }
}
