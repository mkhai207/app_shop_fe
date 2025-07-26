// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { TCartItem } from 'src/types/cart'
import { addToCartAsync, getCartItemsAsync, serviceName, updateCartItemAsync } from './action'

interface CartState {
  items: TCartItem[]
  isLoading: boolean
  isSuccess: boolean
  isError: boolean
  message: string
  error: string
}

const initialState: CartState = {
  items: [],
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
    // ** add to cart
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

    // ** get cart items
    builder
      .addCase(getCartItemsAsync.pending, state => {
        state.items = []
        state.isLoading = true
        state.isSuccess = false
        state.isError = false
        state.message = ''
        state.error = ''
      })
      .addCase(getCartItemsAsync.fulfilled, (state, action) => {
        state.items = action.payload?.data
        state.isLoading = false
        state.isSuccess = action.payload.status === 'success'
        state.isError = action.payload.status !== 'success'
        state.message = action.payload?.message
        state.error = action.payload?.error
      })
      .addCase(getCartItemsAsync.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.isError = true
        state.message = ''
        state.error = action.error.message || 'Failed to get cart items'
      })

    // updateCartItemAsync
    builder
      .addCase(updateCartItemAsync.pending, state => {
        state.isLoading = true
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = action.payload.status === 'success'
        state.isError = action.payload.status !== 'success'
        state.message = action.payload?.message
      })
      .addCase(updateCartItemAsync.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.error = action.error.message || 'Failed to update cart item'
      })
  }
})

export const { resetCart } = cartSlice.actions
export default cartSlice.reducer
