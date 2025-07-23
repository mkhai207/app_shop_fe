import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'
import instanceAxios from 'src/helpers/axios'
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
    const res = await axios.post(`${CONFIG_API.AUTH.INDEX}/register`, data)

    return res.data
  } catch (error) {
    return error
  }
}

export const updateAuthMe = async (data: TRegisterAuth) => {
  try {
    const res = await instanceAxios.put(`${CONFIG_API.AUTH.INDEX}/me`, data)

    return res.data
  } catch (error) {
    return error
  }
}
