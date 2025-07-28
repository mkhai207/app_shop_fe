import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Spinner from 'src/components/spinner'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useAuth } from 'src/hooks/useAuth'
import { deleteCartItems } from 'src/services/cart'
import { createOrder } from 'src/services/checkout'
import { RootState } from 'src/stores'
import { TCreateOrder, TCreateOrderForm } from 'src/types/order'
import * as yup from 'yup'

type TProps = {}

const CheckoutPage: NextPage<TProps> = () => {
  const { user } = useAuth()
  const { items } = useSelector((state: RootState) => state.cart)
  const { t } = useTranslation()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)

  const orderTotal = items.reduce((total, item) => total + item.variant.product.price * item.quantity, 0)

  const shippingFee = orderTotal > 500000 ? 0 : 30000

  const schema = yup.object({
    paymentMethod: yup.string().required(t('payment-method-required')),
    shipping_address: yup.string().required(t('shipping-address-required')),
    name: yup.string().required(t('full-name-required')),
    phone: yup
      .string()
      .required(t('phone-number-required'))
      .matches(/^\d{10}$/, t('phone_number_invalid'))
  })

  const handleCreateOrder = async (data: TCreateOrder) => {
    try {
      setLoading(true)
      const response = await createOrder(data)
      setOrderSuccess(true)

      if (response?.status === 'success' && response?.data) {
        setLoading(false)
        const url = response?.data?.vnpayUrl
        if (url) {
          window.location.href = url
        } else {
          router.push(ROUTE_CONFIG.ORDER_SUCCESS)
        }
      }
    } catch (error) {
      setLoading(false)
      console.log('error', error)
    }
  }

  const defaultValues: TCreateOrderForm = {
    paymentMethod: 'CASH',
    shipping_address: '',
    name: user?.fullName || '',
    phone: ''
  }

  const { handleSubmit, control } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: TCreateOrderForm) => {
    const orderDetails = items.map(item => ({
      product_variant_id: item.variant.id,
      quantity: item.quantity
    }))

    let status = null
    if (user?.role.code === 'ADMIN') {
      status = 'PENDING'
    }

    const orderData = {
      ...data,

      status,
      discount_code: '',
      orderDetails
    }
    console.log('orderData', orderData)

    handleCreateOrder(orderData)
  }

  useEffect(() => {
    if (orderSuccess) {
      deleteCartItems()
    }
  }, [orderSuccess])

  return (
    <>
      {loading && <Spinner />}
      <Container maxWidth='lg' sx={{ p: 2, mb: 10 }}>
        <Grid container spacing={3}>
          {/* Left Column - Delivery Information */}
          <Grid item xs={12} lg={8}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              {t('delivery-info')}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Controller
                  name='name'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField {...field} label='Họ và tên' fullWidth error={!!error} helperText={error?.message} />
                  )}
                />

                <Controller
                  name='phone'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      label='Số điện thoại'
                      type='tel'
                      fullWidth
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />

                <Controller
                  name='shipping_address'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField {...field} label='Địa chỉ' fullWidth error={!!error} helperText={error?.message} />
                  )}
                />

                <Controller
                  name='paymentMethod'
                  control={control}
                  render={({ field }) => (
                    <Select {...field} fullWidth>
                      <MenuItem value='CASH'>Thanh toán khi nhận hàng</MenuItem>
                      <MenuItem value='ONLINE'>Thanh toán online qua VNPAY</MenuItem>
                    </Select>
                  )}
                />

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button variant='text' color='primary' component='a' href='#'>
                    Giỏ hàng
                  </Button>
                  <Button type='submit' variant='contained' color='primary'>
                    Đặt hàng
                  </Button>
                </Box>
              </Box>
            </form>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ p: 3, position: 'sticky', top: 16 }}>
              {items && items.length > 0 ? (
                items.map(item => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={item.variant.product.thumbnail}
                        alt={item.variant.product.name}
                        style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8 }}
                      />
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -8,
                          right: -8,
                          bgcolor: 'grey.500',
                          color: 'white',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 12
                        }}
                      >
                        {item.quantity}
                      </Box>
                    </Box>
                    <Box sx={{ ml: 2, flex: 1 }}>
                      <Typography variant='subtitle2'>{item.variant.product.name}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {item.variant.color.name} / {item.variant.size.name}
                      </Typography>
                    </Box>
                    <Typography variant='subtitle1'>
                      {(item.variant.product.price * item.quantity).toLocaleString()}VNĐ
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant='body2'>Không có sản phẩm trong giỏ hàng</Typography>
              )}

              <Box sx={{ display: 'flex', mb: 3 }}>
                <TextField
                  label='Mã giảm giá'
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Button variant='contained' color='inherit'>
                          Sử dụng
                        </Button>
                        {/* <Button variant='contained' color='inherit' disabled={isLoading}>
                              {isLoading ? <CircularProgress size={24} /> : 'Sử dụng'}
                            </Button> */}
                      </InputAdornment>
                    )
                  }}
                />
              </Box>
              {/* 
              {voucherStatus.message && (
                <Alert severity={voucherStatus.severity} sx={{ mb: 3 }}>
                  {voucherStatus.message}
                </Alert>
              )} */}

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tạm tính</Typography>
                  <Typography>{orderTotal.toLocaleString()}VNĐ</Typography>
                </Box>
                {/* {discount > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Giảm giá</Typography>
                    <Typography>-{formatPrice(discount)}</Typography>
                  </Box>
                )} */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Phí vận chuyển</Typography>
                  <Typography>{shippingFee.toLocaleString()}VNĐ</Typography>
                </Box>
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h6'>Tổng cộng</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='caption' color='text.secondary'>
                    VND{' '}
                  </Typography>
                  <Typography variant='h6'>{(orderTotal + shippingFee).toLocaleString()}VNĐ</Typography>
                </Box>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default CheckoutPage
