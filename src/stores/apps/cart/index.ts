// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { addToCartAsync, serviceName } from './action'

interface CartState {
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  message: string
  error: string
}

const initialState: CartState = {
  isLoading: false,
  isSuccess: true,
  isError: false,
  message: '',
  error: ''
}

export const cartSlice = createSlice({
  name: serviceName,
  initialState,
  reducers: {
    resetCart: state => {
      state.isLoading = false
      state.isSuccess = true
      state.isError = false
      state.message = ''
      state.error = ''
    }
  },
  extraReducers: builder => {
    builder.addCase(addToCartAsync.pending, state => {
      state.isLoading = true
      state.isSuccess = false
      state.isError = false
      state.message = ''
      state.error = ''
    })
    builder.addCase(addToCartAsync.fulfilled, (state, action) => {
      console.log('action.payload', action)
      state.isLoading = false
      state.isSuccess = !!action.payload?.data?.id
      state.isError = !action.payload?.data?.id
      state.message = action.payload?.message
      state.error = action.payload?.error
    })
    builder.addCase(addToCartAsync.rejected, (state, action) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = true
      state.message = ''
      state.error = action.error.message || 'Failed to add to cart'
    })
  }
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
