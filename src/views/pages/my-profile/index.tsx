import { yupResolver } from '@hookform/resolvers/yup'
import { Avatar, Box, Button, FormControl, Grid, InputLabel, useTheme, Select, MenuItem } from '@mui/material'
import { NextPage } from 'next'
import * as yup from 'yup'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/components/Icon'
import CustomTextField from 'src/components/text-field'
import { useAuth } from 'src/hooks/useAuth'
import { EMAIL_REG } from 'src/configs/regex'
import WrapperFileUpload from 'src/components/wrapper-file-upload'
import { useEffect } from 'react'

type TProps = {}

type TDefaultValues = {
  fullname: string
  email: string
  phone?: string
  avatar?: File | string
  birthDay?: string
  gender?: string
}

const MyProfilePage: NextPage<TProps> = () => {
  const theme = useTheme()
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const schema = yup.object({
    fullname: yup.string().required(t('Full name is required')),
    email: yup.string().required(t('Email is required')).matches(EMAIL_REG, t('The field must be email type')),
    phone: yup.string().optional(),
    avatar: yup.mixed().optional(),
    birthDay: yup.string().optional(),
    gender: yup.string().optional()
  })

  const defaultValues: TDefaultValues = {
    fullname: '',
    email: '',
    phone: '',
    avatar: '',
    birthDay: '',
    gender: ''
  }

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: any) => {
    console.log('data: ', { data })
  }

  const handleUploadAvatar = () => {}

  useEffect(() => {
    if (user) {
      reset({
        fullname: user?.fullName || '',
        email: user?.email || ''
      })
    }
  }, [user, reset])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} autoComplete='off' noValidate>
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: '16px',
            py: { xs: 4, sm: 5 },
            px: { xs: 3, sm: 4, md: 5 },
            width: { xs: '100%', sm: 480, md: 520, lg: 560 },
            maxWidth: '100%',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        >
          <Grid container spacing={3} direction='column' alignItems='center'>
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  mb: 1
                }}
              >
                <Avatar sx={{ width: 100, height: 100 }} src={user?.avatar || undefined}>
                  <IconifyIcon icon='ph:user-thin' fontSize={70} />
                </Avatar>
                <WrapperFileUpload
                  uploadFunc={handleUploadAvatar}
                  objectAcceptFile={{
                    'image/jpeg': ['.jpg', '.jpeg'],
                    'image/png': ['.png']
                  }}
                >
                  <Button
                    variant='outlined'
                    onClick={() => {}}
                    sx={{
                      width: 'auto',
                      borderRadius: '8px'
                    }}
                  >
                    {t('Upload')}
                  </Button>
                </WrapperFileUpload>
              </Box>
            </Grid>

            <Grid item xs={12} sx={{ width: '100%' }}>
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    required
                    autoFocus
                    fullWidth
                    label={t('Full Name')}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={t('enter_your_fullname')}
                    error={Boolean(errors?.fullname)}
                    helperText={errors?.fullname?.message}
                  />
                )}
                name='fullname'
              />
            </Grid>

            <Grid item xs={12} sx={{ width: '100%' }}>
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    disabled
                    required
                    fullWidth
                    label={t('Email')}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={t('enter_your_email')}
                    error={Boolean(errors?.email)}
                    helperText={errors?.email?.message}
                  />
                )}
                name='email'
              />
            </Grid>

            <Grid item xs={12} sx={{ width: '100%' }}>
              <Controller
                control={control}
                rules={{ required: false }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomTextField
                    fullWidth
                    label={t('Phone')}
                    onChange={onChange}
                    onBlur={onBlur}
                    value={value}
                    placeholder={t('enter_your_phone')}
                    error={Boolean(errors?.phone)}
                    helperText={errors?.phone?.message}
                  />
                )}
                name='phone'
              />
            </Grid>

            {/* Row layout cho Birth Day và Gender */}
            <Grid item xs={12} sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <CustomTextField
                        fullWidth
                        label={t('Birth Day')}
                        type='date'
                        onChange={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder={t('enter_your_birthday')}
                        error={Boolean(errors?.birthDay)}
                        helperText={errors?.birthDay?.message}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                    name='birthDay'
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormControl fullWidth error={Boolean(errors?.gender)}>
                        <InputLabel id='gender-label'>{t('Gender')}</InputLabel>
                        <Select
                          labelId='gender-label'
                          id='gender'
                          value={value || ''}
                          onChange={onChange}
                          onBlur={onBlur}
                          label={t('Gender')}
                        >
                          <MenuItem value='male'>{t('Male')}</MenuItem>
                          <MenuItem value='female'>{t('Female')}</MenuItem>
                          <MenuItem value='other'>{t('Other')}</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    name='gender'
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sx={{ width: '100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button
                  type='submit'
                  variant='contained'
                  sx={{
                    px: 4,
                    py: 1.2,
                    borderRadius: '8px',
                    fontSize: '1rem'
                  }}
                >
                  {t('Change')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </form>
    </Box>
  )
}

export default MyProfilePage
