export type TParamsGetProducts = {}

export type TBrand = {
  id: string
  name: string
}

export type TCategory = {
  id: string
  code: string
  name: string
}

export type TProduct = {
  id: string
  name: string
  description: string
  price: number
  gender: 'MALE' | 'FEMALE' | 'UNISEX'
  rating: number
  sold: number
  status: boolean
  thumbnail: string | ''
  slider: string[] | null
  created_at: string // ISO date string
  updated_at: string
  created_by: string
  updated_by: string
  brand_id: string
  category_id: string
  brand: TBrand
  category: TCategory
}
