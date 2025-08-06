import { useCallback } from 'react'
import { getBrands, createBrand, updateBrand, deleteBrand } from 'src/services/brand'
import { TCreateBrand, TUpdateBrand, GetBrandsResponse } from 'src/types/brand'

export const useBrand = () => {
  const fetchBrands = useCallback(async (): Promise<GetBrandsResponse> => {
    return await getBrands()
  }, [])

  const createNewBrand = useCallback(async (data: TCreateBrand) => {
    return await createBrand(data)
  }, [])

  const updateExistingBrand = useCallback(async (id: string, data: TUpdateBrand) => {
    return await updateBrand(id, data)
  }, [])

  const deleteExistingBrand = useCallback(async (id: string) => {
    return await deleteBrand(id)
  }, [])

  return {
    fetchBrands,
    createNewBrand,
    updateExistingBrand,
    deleteExistingBrand
  }
} 