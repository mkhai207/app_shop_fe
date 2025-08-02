import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from 'src/stores'
import {
  getReviewsAsync,
  getReviewByIdAsync,
  createReviewAsync,
  updateReviewAsync,
  deleteReviewAsync,
  getReviewsByProductAsync,
  getReviewsByUserAsync
} from 'src/stores/apps/review/action'
import { ReviewFilter, NewReview, TReview } from 'src/types/review'

export const useReview = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { reviews, currentReview, isLoading, isSuccess, isError, message, error } = useSelector(
    (state: RootState) => state.review
  )

  const getReviews = (filter?: ReviewFilter) => {
    dispatch(getReviewsAsync(filter))
  }

  const getReviewById = (id: number) => {
    dispatch(getReviewByIdAsync(id))
  }

  const createReview = (review: NewReview) => {
    dispatch(createReviewAsync(review))
  }

  const updateReview = (id: number, review: Partial<TReview>) => {
    dispatch(updateReviewAsync({ id, review }))
  }

  const deleteReview = (id: number) => {
    dispatch(deleteReviewAsync(id))
  }



  const getReviewsByProduct = (productId: number, filter?: ReviewFilter) => {
    dispatch(getReviewsByProductAsync({ productId, filter }))
  }

  const getReviewsByUser = (userId: number, filter?: ReviewFilter) => {
    dispatch(getReviewsByUserAsync({ userId, filter }))
  }

  return {
    // State
    reviews,
    currentReview,
    isLoading,
    isSuccess,
    isError,
    message,
    error,
    // Actions
    getReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getReviewsByProduct,
    getReviewsByUser
  }
} 