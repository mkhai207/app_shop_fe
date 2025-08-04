import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Chip
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
import { getDiscountByCode, TDiscount } from 'src/services/discount'
import { RootState } from 'src/stores'
import { TCreateOrder, TCreateOrderForm } from 'src/types/order'
import * as yup from 'yup'

type TProps = {}

interface BuyNowItem {
  product_id: string
  color_id: string
  size_id: string
  quantity: number
  product_name: string
  product_price: number
  product_thumbnail: string
  color_name: string
  size_name: string
  product_variant_id: string
}

const CheckoutPage: NextPage<TProps> = () => {
  const { user } = useAuth()
  const { items } = useSelector((state: RootState) => state.cart)
  const { t } = useTranslation()
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [buyNowItems, setBuyNowItems] = useState<BuyNowItem[]>([])
  const [isBuyNowMode, setIsBuyNowMode] = useState(false)

  // Discount states
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string
    discountAmount: number
    discountType: 'percentage' | 'fixed'
  } | null>(null)
  const [discountLoading, setDiscountLoading] = useState(false)
  const [discountError, setDiscountError] = useState('')

  useEffect(() => {
    const buyNowData = localStorage.getItem('buyNowItems')
    if (buyNowData) {
      try {
        const parsedData = JSON.parse(buyNowData) as BuyNowItem[]
        if (parsedData && parsedData.length > 0) {
          setBuyNowItems(parsedData)
          setIsBuyNowMode(true)
          localStorage.removeItem('buyNowItems')
        }
      } catch (error) {
        console.error('Error parsing buyNowItems:', error)
      }
    }
  }, [])

  // Tính toán order total dựa trên mode
  const getOrderTotal = () => {
    if (isBuyNowMode) {
      return buyNowItems.reduce((total, item) => total + item.product_price * item.quantity, 0)
    }

    return items.reduce((total, item) => total + item.variant.product.price * item.quantity, 0)
  }

  const orderTotal = getOrderTotal()
  const shippingFee = orderTotal >= 500000 ? 0 : 30000

  // Tính toán discount
  const getDiscountAmount = () => {
    if (!appliedDiscount) {
      return 0
    }

    if (appliedDiscount.discountType === 'percentage') {
      return (orderTotal * appliedDiscount.discountAmount) / 100
    } else {
      return appliedDiscount.discountAmount
    }
  }

  const discountAmount = getDiscountAmount()
  const finalTotal = orderTotal + shippingFee - discountAmount

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

  // Handle discount code application
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Vui lòng nhập mã giảm giá')

      return
    }

    setDiscountLoading(true)
    setDiscountError('')

    try {
      const response = await getDiscountByCode(discountCode.trim())

      if (response?.status === 'success' && response?.data) {
        const discount: TDiscount = response.data

        // Kiểm tra thời gian hiệu lực
        const now = new Date()
        const validFrom = new Date(discount.valid_from)
        const validUntil = new Date(discount.valid_until)

        if (now < validFrom || now > validUntil) {
          setDiscountError('Mã giảm giá đã hết hạn hoặc chưa thể sử dụng')

          return
        }

        // Kiểm tra giá trị đơn hàng tối thiểu
        if (discount.minimum_order_value > orderTotal) {
          setDiscountError(`Đơn hàng phải có giá trị tối thiểu ${discount.minimum_order_value.toLocaleString()}VNĐ`)

          return
        }

        // Tính toán số tiền giảm giá
        let discountAmount = 0
        if (discount.discount_type === 'PERCENTAGE') {
          discountAmount = (orderTotal * parseFloat(discount.discount_value)) / 100

          if (discount.max_discount_amount && discountAmount > discount.max_discount_amount) {
            discountAmount = discount.max_discount_amount
          }
        } else {
          discountAmount = parseFloat(discount.discount_value)
        }

        setAppliedDiscount({
          code: discount.code,
          discountAmount: discountAmount,
          discountType: discount.discount_type === 'PERCENTAGE' ? 'percentage' : 'fixed'
        })

        setDiscountCode('')
      } else {
        setDiscountError('Mã giảm giá không hợp lệ')
      }
    } catch (error) {
      console.error('Error applying discount:', error)
      setDiscountError('Có lỗi xảy ra khi áp dụng mã giảm giá')
    } finally {
      setDiscountLoading(false)
    }
  }

  // Handle discount code removal
  const handleRemoveDiscount = () => {
    setAppliedDiscount(null)
    setDiscountError('')
  }

  const onSubmit = (data: TCreateOrderForm) => {
    let orderDetails = []

    if (isBuyNowMode) {
      orderDetails = buyNowItems.map(item => ({
        product_variant_id: item.product_variant_id,
        quantity: item.quantity
      }))
    } else {
      orderDetails = items.map(item => ({
        product_variant_id: item.variant.id,
        quantity: item.quantity
      }))
    }

    let status: string | undefined = undefined
    if (user?.role.code === 'ADMIN') {
      status = 'PENDING'
    }

    const orderData = {
      ...data,
      status,
      discount_code: appliedDiscount?.code || '',
      orderDetails
    }
    console.log('orderData', orderData)

    handleCreateOrder(orderData)
  }

  useEffect(() => {
    if (orderSuccess) {
      if (!isBuyNowMode) {
        deleteCartItems()
      }
    }
  }, [orderSuccess, isBuyNowMode])

  if (!isBuyNowMode && items.length === 0) {
    return (
      <Container maxWidth='lg' sx={{ p: 2, mb: 10 }}>
        <Alert severity='warning' sx={{ mb: 2 }}>
          Không có sản phẩm nào trong giỏ hàng. Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán.
        </Alert>
        <Button variant='contained' onClick={() => router.push('/')}>
          Quay về trang chủ
        </Button>
      </Container>
    )
  }

  if (isBuyNowMode && buyNowItems.length === 0) {
    return (
      <Container maxWidth='lg' sx={{ p: 2, mb: 10 }}>
        <Alert severity='warning' sx={{ mb: 2 }}>
          Không tìm thấy thông tin sản phẩm mua ngay. Vui lòng thử lại.
        </Alert>
        <Button variant='contained' onClick={() => router.push('/')}>
          Quay về trang chủ
        </Button>
      </Container>
    )
  }

  return (
    <>
      {loading && <Spinner />}
      <Container maxWidth='lg' sx={{ p: 2, mb: 10 }}>
        {isBuyNowMode && (
          <Alert severity='info' sx={{ mb: 3 }}>
            Bạn đang thanh toán sản phẩm mua ngay
          </Alert>
        )}

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
                    {isBuyNowMode ? 'Sản phẩm' : 'Giỏ hàng'}
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
              {isBuyNowMode ? (
                buyNowItems.map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={item.product_thumbnail}
                        alt={item.product_name}
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
                      <Typography variant='subtitle2'>{item.product_name}</Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {item.color_name} / {item.size_name}
                      </Typography>
                    </Box>
                    <Typography variant='subtitle1'>
                      {(item.product_price * item.quantity).toLocaleString()}VNĐ
                    </Typography>
                  </Box>
                ))
              ) : items && items.length > 0 ? (
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

              {/* Discount Code Section */}
              <Box sx={{ mb: 3 }}>
                {appliedDiscount ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={`Mã giảm giá: ${appliedDiscount.code}`}
                      color='success'
                      onDelete={handleRemoveDiscount}
                    />
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label='Mã giảm giá'
                      value={discountCode}
                      onChange={e => setDiscountCode(e.target.value)}
                      error={!!discountError}
                      helperText={discountError}
                      fullWidth
                      size='small'
                      disabled={discountLoading}
                    />
                    <Button
                      variant='contained'
                      onClick={handleApplyDiscount}
                      disabled={discountLoading || !discountCode.trim()}
                      sx={{ minWidth: 'auto', px: 2 }}
                    >
                      {discountLoading ? 'Đang áp dụng...' : 'Áp dụng'}
                    </Button>
                  </Box>
                )}
              </Box>

              {/* Price Summary */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tạm tính</Typography>
                  <Typography>{orderTotal.toLocaleString()}VNĐ</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Phí vận chuyển</Typography>
                  <Typography>{shippingFee.toLocaleString()}VNĐ</Typography>
                </Box>
                {appliedDiscount && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography color='success.main'>Giảm giá</Typography>
                    <Typography color='success.main'>-{discountAmount.toLocaleString()}VNĐ</Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h6'>Tổng cộng</Typography>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant='caption' color='text.secondary'>
                    VND{' '}
                  </Typography>
                  <Typography variant='h6'>{finalTotal.toLocaleString()}VNĐ</Typography>
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
