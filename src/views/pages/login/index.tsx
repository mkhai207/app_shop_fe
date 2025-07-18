import {
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Typography
} from '@mui/material'
import { NextPage } from 'next'
import CustomTextField from 'src/components/text-field'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { EMAIL_REG, PASSWORD_REG } from 'src/configs/regex'
import { useState } from 'react'
import IconifyIcon from 'src/components/Icon'

type TProps = {}

const LoginPage: NextPage<TProps> = () => {
  const [showPassword, setShowPassword] = useState(false)

  const schema = yup
    .object({
      email: yup.string().required('Email is required').matches(EMAIL_REG, 'The field is must email type'),
      password: yup
        .string()
        .required('Password is required')
        .matches(
          PASSWORD_REG,
          'The password must contain at least one uppercase letter one number and one special character'
        )
    })
    .required()

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: { email: string; password: string }) => {
    console.log('data: ', { data })
  }

  return (
    <Container component='main' maxWidth='xs'>
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component='h1' variant='h5'>
          Sign in
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
          <Box sx={{ mt: 2 }}>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextField
                  variant='outlined'
                  required
                  fullWidth
                  label='Email'
                  placeholder='Input email'
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={Boolean(errors?.email)}
                  helperText={errors?.email?.message}
                />
              )}
              name='email'
            />
          </Box>

          <Box sx={{ mt: 2 }}>
            <Controller
              control={control}
              rules={{
                required: true
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <CustomTextField
                  variant='outlined'
                  required
                  fullWidth
                  label='Password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Input password'
                  onChange={onChange}
                  onBlur={onBlur}
                  value={value}
                  error={Boolean(errors?.password)}
                  helperText={errors?.password?.message}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <IconButton
                          edge='end'
                          onClick={() => {
                            setShowPassword(!showPassword)
                          }}
                        >
                          {showPassword ? (
                            <IconifyIcon icon='material-symbols:visibility-outline' />
                          ) : (
                            <IconifyIcon icon='material-symbols:visibility-off-outline-rounded' />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              )}
              name='password'
            />
          </Box>

          <FormControlLabel control={<Checkbox value='remember' color='primary' />} label='Remember me' />
          <Button type='submit' fullWidth variant='contained' color='primary' sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href='#' variant='body2'>
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href='#' variant='body2'>
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  )
}

export default LoginPage
