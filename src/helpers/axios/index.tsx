import axios from 'axios'
import { BASE_URL, CONFIG_API } from 'src/configs/api'
import { clearLocalUserData, getLocalUserData } from '../storage'
import { jwtDecode } from 'jwt-decode'
import { FC } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { UserDataType } from 'src/contexts/types'
import { useAuth } from 'src/hooks/useAuth'

const instanceAxios = axios.create({ baseURL: BASE_URL })

type TAxiosInteceptor = {
  children: React.ReactNode
}

const handleRedirectLogin = (router: NextRouter, setUser: (data: UserDataType | null) => void) => {
  if (router.asPath !== '/') {
    router.replace({
      pathname: '/login',
      query: { returnUrl: router.asPath }
    })
  } else {
    router.replace('/login')
  }
  setUser(null)
  clearLocalUserData()
}

const AxiosInterceptor: FC<TAxiosInteceptor> = ({ children }) => {
  const router = useRouter()
  const { accessToken, refreshToken } = getLocalUserData()
  const { setUser } = useAuth()

  instanceAxios.interceptors.request.use(async config => {
    if (accessToken) {
      const decodedAccessToken: any = jwtDecode(accessToken)

      if (decodedAccessToken.exp < Date.now() / 1000) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
      } else {
        if (refreshToken) {
          const decodedRefreshToken: any = jwtDecode(refreshToken)

          if (decodedRefreshToken.exp > Date.now() / 1000) {
            // call api to refresh access token
            console.log('url', `${CONFIG_API.AUTH.INDEX}/auth/refresh`)
            await axios
              .get(`${CONFIG_API.AUTH.INDEX}/refresh`, {
                headers: {
                  Authorization: `Bearer ${refreshToken}`
                }
              })
              .then(response => {
                console.log('res', { response })
                const newAccessToken = response.data.data.accessToken
                if (newAccessToken) {
                  config.headers['Authorization'] = `Bearer ${newAccessToken}`
                } else {
                  handleRedirectLogin(router, setUser)
                }
              })
              .catch(() => {
                handleRedirectLogin(router, setUser)
              })
          } else {
            handleRedirectLogin(router, setUser)
          }
        } else {
          handleRedirectLogin(router, setUser)
        }
      }
    } else {
      handleRedirectLogin(router, setUser)
    }

    return config
  })

  return <>{children}</>
}

instanceAxios.interceptors.response.use(response => {
  return response
})

export default instanceAxios
export { AxiosInterceptor }
