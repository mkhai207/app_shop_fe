import React, { useCallback, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement | null, config: any) => void
          prompt: () => void
        }
      }
    }
  }
}

interface GoogleLoginButtonProps {
  onSuccess?: (response: any) => void
  onError?: (error: any) => void
}

export default function GoogleLoginButton({ onSuccess, onError }: GoogleLoginButtonProps) {
  //   const handleGoogleLogin = useCallback(
  //     async (credential: string, userInfo: any) => {
  //       try {
  //         // Gửi ID token lên backend để verify
  //         const response = await axios.post(`${CONFIG_API.AUTH.INDEX}/google`, {
  //           credential: credential,
  //           userInfo: userInfo
  //         })
  //         console.log('Server response:', response)

  //         if (response.data.success == 'success') {
  //           window.location.href = '/'
  //         }
  //       } catch (error) {
  //         console.error('Error sending credential to server:', error)
  //         onError?.(error)
  //       }
  //     },
  //     [onError]
  //   )

  const handleCredentialResponse = useCallback(
    (response: any) => {
      console.log('Google ID Token:', response.credential)

      try {
        const base64Url = response.credential.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(function (c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            })
            .join('')
        )
        const userInfo = JSON.parse(jsonPayload)

        console.log('User Info:', userInfo)

        if (onSuccess) {
          onSuccess({
            credential: response.credential,
            userInfo: userInfo
          })

          // } else {
          //   handleGoogleLogin(response.credential, userInfo)
        }
      } catch (error) {
        console.error('Error handling credential response:', error)
        onError?.(error)
      }
    },
    [onSuccess, onError]
  )

  const initializeGoogleSignIn = React.useCallback(() => {
    try {
      window.google?.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
      })

      const googleSignInDiv = document.getElementById('googleSignInDiv')
      if (googleSignInDiv) {
        window.google?.accounts.id.renderButton(googleSignInDiv, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          locale: 'vi'
        })
      }

      window.google?.accounts.id.prompt()
    } catch (error) {
      console.error('Error initializing Google Sign-In:', error)
      onError?.(error)
    }
  }, [handleCredentialResponse, onError])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.google) {
      initializeGoogleSignIn()
    } else {
      const checkGoogleLoaded = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn()
          clearInterval(checkGoogleLoaded)
        }
      }, 100)

      setTimeout(() => clearInterval(checkGoogleLoaded), 10000)
    }
  }, [initializeGoogleSignIn])

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Typography variant='body2' color='textSecondary' align='center' sx={{ mb: 2 }}>
        Hoặc đăng nhập bằng
      </Typography>
      <Box
        id='googleSignInDiv'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          '& > div': {
            width: '100% !important'
          }
        }}
      />
    </Box>
  )
}
