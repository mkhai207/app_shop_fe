export type TBrand = {
  id: string
  name: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
}

export type TParamsGetBrands = {
  page?: number
  limit?: number
  sort?: string
  search?: string
}

export type TCreateBrand = {
  name: string
}

export type TUpdateBrand = {
  id: string
  name: string
} 