export interface TUser {
  id: string
  full_name: string
  email: string
  avatar: string | null
}

export interface TReview {
  id: string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  rating: number
  comment: string
  images: string | null
  user_id: string
  product_id: string
  order_id: string | null
  user: TUser
}

export interface TReviewResponse {
  status: string
  message: string
  error: string | null
  data: TReview[]
}
