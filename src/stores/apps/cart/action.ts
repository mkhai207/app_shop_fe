import { createAsyncThunk } from '@reduxjs/toolkit'
import { addToCart } from 'src/services/cart'

export const serviceName = 'cart'

// ** Add to cart
export const addToCartAsync = createAsyncThunk('auth/addToCart', async (data: any) => {
  const response = await addToCart(data)
  console.log('addToCart', response)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response.data.message,
    error: response?.response.data.error
  }
})
