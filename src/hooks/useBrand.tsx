import { useCallback } from 'react'
import { getBrands, GetBrandsResponse } from 'src/services/brand'

export const useBrand = () => {
  const fetchBrands = useCallback(async (): Promise<GetBrandsResponse> => {
    return await getBrands()
  }, [])

  return {
    fetchBrands
  }
} 