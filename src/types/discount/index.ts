export interface TDiscount {
  id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  code: string
  name: string
  description: string
  discount_value: string
  discount_type: 'PERCENTAGE' | 'FIXED'
  valid_from: string
  valid_until: string
  minimum_order_value: number
  max_discount_amount: number | null
}

export interface DiscountResponse {
  status: string
  statusCode: number
  message: string
  data: TDiscount[]
  error: null | string
  meta: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
  }
}

export interface NewDiscount {
  code: string
  name: string
  description: string
  discount_value: string
  discount_type: 'PERCENTAGE' | 'FIXED'
  valid_from: string
  valid_until: string
  minimum_order_value: number
  max_discount_amount: number | null
} 