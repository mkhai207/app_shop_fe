import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'
import { TLoginAuth, TRegisterAuth } from 'src/types/auth'

export const loginAuth = async (data: TLoginAuth) => {
  try {
    const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/login`, data)

    return res.data
  } catch (error) {
    return null
  }
}

export const registerAuth = async (data: TRegisterAuth) => {
  try {
    console.log('registerAuth', data)
    const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/register`, data)

    return res.data
  } catch (error) {
    return error
  }
}
