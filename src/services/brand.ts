import instanceAxios from 'src/helpers/axios'

export interface Brand {
  id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  name: string
}

export interface GetBrandsResponse {
  status: string
  statusCode: number
  message: string
  data: Brand[]
  error: null | string
  meta: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

export const getBrands = async (): Promise<GetBrandsResponse> => {
  try {
    const res = await instanceAxios.get('/brands/get-brands')
    return res.data
  } catch (error) {
    throw error
  }
} 