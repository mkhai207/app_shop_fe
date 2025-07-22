import { createAsyncThunk } from '@reduxjs/toolkit'
import { registerAuth } from 'src/services/auth'

// ** Add User
export const registerAuthAsync = createAsyncThunk('auth/register', async (data: any) => {
  const response = await registerAuth(data)
  console.log('registerResponse', response)

  if (response?.data) {
    return response
  }

  return {
    data: null,
    message: response?.response.data.message,
    error: response?.response.data.error
  }
})
