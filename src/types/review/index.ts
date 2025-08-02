export interface TReview {
  id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  rating: number
  comment: string
  user_id: number
  product_id: string
  images: string
}

export interface NewReview {
  rating: number
  comment: string
  user_id: number
  product_id: string
  images?: string
}

export interface ReviewFilter {
  search?: string
  rating?: number
  user_id?: number
  product_id?: string
  page?: number
  limit?: number
}

export interface ReviewResponse {
  status: string
  statusCode: number
  message: string
  data: TReview[]
  error: any
  meta: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
  }
} 