import {
  Box,
  Button,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import IconifyIcon from 'src/components/Icon'
import Spinner from 'src/components/spinner'
import { getDetailsProductPublic, getSimilarProducts } from 'src/services/product'
import { TProductDetail } from 'src/types/product'
import { parseSlider } from 'src/utils/parseSlider'
import TabPanel from '../components/TabPanel'
import { useDispatch, useSelector } from 'react-redux'
import { addToCartAsync } from 'src/stores/apps/cart/action'
import { AppDispatch, RootState } from 'src/stores'
import { resetCart } from 'src/stores/apps/cart'
import CardProduct from 'src/components/card-product/CardProduct'
import { TProduct } from 'src/types/product'
import { useAuth } from 'src/hooks/useAuth'

type TProps = {}

const DetailProductPage: NextPage<TProps> = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { user } = useAuth()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [productDetail, setProductDetail] = useState<TProductDetail | null>(null)
  const router = useRouter()
  const dispatch: AppDispatch = useDispatch()
  const { isLoading, isSuccess, isError, message } = useSelector((state: RootState) => state.cart)
  const [tabValue, setTabValue] = useState(0)
  const [productSimilar, setProductSimilar] = useState<{
    data: any[]
    total: number
    totalPages: number
    currentPage: number
  }>({
    data: [],
    total: 0,
    totalPages: 0,
    currentPage: 1
  })

  const handleTabChange = (event: SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const fetchGetDetailProductPublic = async () => {
    try {
      setLoading(true)

      const response = await getDetailsProductPublic(router?.query?.productId as string)

      if (response.status === 'success') {
        setProductDetail(response?.data)
      }
    } catch (error: any) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change))
  }

  const fetchGetSimilarProduct = async () => {
    try {
      setLoading(true)

      const response = await getSimilarProducts(productDetail?.id || '')

      if (response.status === 'success') {
        setProductSimilar({
          data: response.data || [],
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          currentPage: response.data.currentPage || 1
        })
      }
    } catch (error: any) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!productDetail?.id) {
      return toast.error('Sản phẩm không tồn tại')
    }

    if (!selectedSize) {
      return toast.error('Vui lòng chọn size')
    }

    if (!selectedColor) {
      return toast.error('Vui lòng chọn màu')
    }

    dispatch(
      addToCartAsync({
        product_id: productDetail?.id || '',
        size_id: selectedSize,
        color_id: selectedColor || '',
        quantity: quantity
      })
    )
  }

  useEffect(() => {
    fetchGetDetailProductPublic()
  }, [])

  useEffect(() => {
    if (message) {
      console.log('message', message)
      if (isError) {
        toast.error(message)
      } else {
        toast.success(message)
      }
    }
    dispatch(resetCart())
  }, [isSuccess, isError, message])

  useEffect(() => {
    if (productDetail?.id) {
      fetchGetSimilarProduct()
    }
  }, [])

  return (
    <>
      {isLoading && loading && <Spinner />}
      <Container maxWidth='lg' sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Product Images Section */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Main Image */}
              <Paper
                elevation={2}
                sx={{
                  position: 'relative',
                  mb: 2,
                  overflow: 'hidden',
                  borderRadius: 2
                }}
              >
                <CardMedia
                  component='img'
                  height={500}
                  image={parseSlider(productDetail?.slider || '')[selectedImage]}
                  alt='Áo Sơ Mi Jeans Crotop'
                  sx={{ objectFit: 'cover' }}
                />
              </Paper>

              {/* Thumbnail Images */}
              <Grid container spacing={1}>
                {parseSlider(productDetail?.slider || '').map((image, index) => (
                  <Grid item xs={4} key={index}>
                    <Paper
                      elevation={selectedImage === index ? 3 : 1}
                      sx={{
                        cursor: 'pointer',
                        border: selectedImage === index ? '2px solid' : '1px solid',
                        borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                        overflow: 'hidden',
                        borderRadius: 1,
                        '&:hover': {
                          borderColor: 'primary.main',
                          elevation: 2
                        }
                      }}
                      onClick={() => setSelectedImage(index)}
                    >
                      <CardMedia
                        component='img'
                        height={100}
                        image={image}
                        alt={`Thumbnail ${index + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>

          {/* Product Details Section */}
          <Grid item xs={12} md={6}>
            <Box>
              {/* Title*/}
              <Box display='flex' justifyContent='space-between' alignItems='flex-start' mb={2}>
                <Typography variant='h4' component='h1' fontWeight='bold' sx={{ flexGrow: 1, mr: 2 }}>
                  {productDetail?.name}
                </Typography>
              </Box>

              {/* Brand and Category Info */}
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                <Box component='span' fontWeight='medium'>
                  Thương hiệu:
                </Box>{' '}
                {productDetail?.brand.name}|{' '}
                <Box component='span' fontWeight='medium'>
                  Loại:
                </Box>{' '}
                {productDetail?.category.name} |{' '}
                <Box component='span' fontWeight='medium'>
                  MSP:
                </Box>{' '}
                {productDetail?.id}
              </Typography>

              {/* Price */}
              <Box mb={3}>
                <Typography variant='h3' color='error' fontWeight='bold' sx={{ mb: 1 }}>
                  {productDetail?.price} VNĐ
                </Typography>
                <Typography variant='body1' color='success.main' fontWeight='medium'>
                  <Box component='span' fontWeight='bold'>
                    Tình trạng:
                  </Box>{' '}
                  {productDetail?.status ? 'Còn hàng' : 'Hết hàng'}
                </Typography>
              </Box>

              {/* Color Selection */}
              <Box mb={3}>
                <Typography variant='body1' fontWeight='bold' gutterBottom>
                  Màu sắc: {productDetail?.colors.find(color => color.id === selectedColor)?.name}
                </Typography>
                <Box display='flex' gap={1}>
                  {productDetail?.colors.map(color => (
                    <Tooltip key={color.id} title={color.name} arrow>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          backgroundColor: color.hex_code,
                          border: '2px solid',
                          borderColor: selectedColor === color.id ? 'primary.main' : 'grey.300',
                          borderRadius: '50%',
                          cursor: 'pointer',
                          '&:hover': { transform: 'scale(1.1)' },
                          transition: 'transform 0.2s'
                        }}
                        onClick={() => setSelectedColor(color.id)}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>

              {/* Size Selection */}
              <Box mb={3}>
                <Box display='flex' alignItems='center' gap={2} mb={2}>
                  <Typography variant='body1' fontWeight='bold'>
                    Kích thước:
                  </Typography>
                  <Button
                    variant='text'
                    size='small'
                    startIcon={
                      <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <rect x='1' y='3' width='15' height='13' />
                        <polygon points='16,3 21,8 21,21 8,21 8,13 16,3' />
                      </svg>
                    }
                    sx={{ textTransform: 'none' }}
                  >
                    Hướng dẫn chọn size
                  </Button>
                </Box>
                <Stack direction='row' spacing={1}>
                  {productDetail?.sizes.map(size => (
                    <Button
                      key={size.id}
                      variant={selectedSize === size.id ? 'contained' : 'outlined'}
                      size='small'
                      onClick={() => setSelectedSize(size.id)}
                      sx={{
                        minWidth: 48,
                        height: 40,
                        fontWeight: 'medium'
                      }}
                    >
                      {size.name}
                    </Button>
                  ))}
                </Stack>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Quantity Selector */}
              <Box mb={4}>
                <Typography variant='body1' fontWeight='bold' gutterBottom>
                  Số lượng:
                </Typography>
                <Box display='flex' alignItems='center'>
                  <Paper
                    variant='outlined'
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      borderRadius: 1
                    }}
                  >
                    <IconButton size='small' onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <line x1='5' y1='12' x2='19' y2='12' />
                      </svg>
                    </IconButton>
                    <TextField
                      value={quantity}
                      size='small'
                      sx={{
                        width: 60,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' }
                        },
                        '& input': { textAlign: 'center', fontWeight: 'medium' }
                      }}
                      inputProps={{ readOnly: true }}
                    />
                    <IconButton size='small' onClick={() => handleQuantityChange(1)}>
                      <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <line x1='12' y1='5' x2='12' y2='19' />
                        <line x1='5' y1='12' x2='19' y2='12' />
                      </svg>
                    </IconButton>
                  </Paper>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Stack direction='row' spacing={2}>
                <Button
                  fullWidth
                  variant='outlined'
                  sx={{
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    '&:hover': {
                      backgroundColor: theme.palette.customColors.avatarBg,
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                  onClick={handleAddToCart}
                >
                  <IconifyIcon icon='mdi:cart' fontSize={18} />
                  {t('add-to-cart')}
                </Button>
                <Button
                  fullWidth
                  variant='contained'
                  sx={{
                    height: 36,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    backgroundColor: theme.palette.primary.dark,
                    '&:hover': {
                      backgroundColor: theme.palette.primary.main,
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <IconifyIcon icon='icon-park-outline:buy' fontSize={18} />
                  {t('buy-now')}
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
        <Container maxWidth='lg' sx={{ py: 4, mt: 10 }}>
          <Paper elevation={0} sx={{ backgroundColor: 'transparent' }}>
            {/* Tabs Navigation */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                sx={{
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 'medium',
                    fontSize: '1rem',
                    color: 'text.secondary',
                    '&.Mui-selected': {
                      color: 'text.primary',
                      fontWeight: 'bold'
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: 'black',
                    height: 3
                  }
                }}
              >
                <Tab label='MÔ TẢ' />
                <Tab label='CHÍNH SÁCH THANH TOÁN' />
                <Tab label='CHÍNH SÁCH ĐỔI TRẢ' />
                <Tab label='BÌNH LUẬN' />
              </Tabs>
            </Box>

            {/* Tab Panel 1 - Mô tả */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ maxWidth: '100%' }}>
                {/* Product Title */}
                <Typography
                  variant='h6'
                  component='h2'
                  sx={{
                    mb: 3,
                    fontWeight: 'medium',
                    color: 'text.primary'
                  }}
                >
                  {productDetail?.name}
                </Typography>

                {/* Product Description */}
                <Typography
                  variant='body1'
                  sx={{
                    mb: 2,
                    lineHeight: 1.7,
                    color: 'text.primary'
                  }}
                >
                  <Box component='span' fontWeight='bold'>
                    Mô tả sản phẩm:
                  </Box>
                </Typography>
                <Typography
                  variant='body1'
                  sx={{
                    mb: 3,
                    lineHeight: 1.7,
                    color: 'text.primary'
                  }}
                >
                  {productDetail?.description}
                </Typography>
              </Box>
            </TabPanel>

            {/* Tab Panel 2 - Chính sách thanh toán */}
            <TabPanel value={tabValue} index={1}>
              <Typography variant='h6' gutterBottom fontWeight='bold'>
                Chính Sách Thanh Toán
              </Typography>
              <Typography variant='body1' sx={{ lineHeight: 1.7 }}>
                • Thanh toán khi nhận hàng (COD)
                <br />
                • Chuyển khoản ngân hàng
                <br />• Thanh toán qua ví điện tử VnPay
              </Typography>
            </TabPanel>

            {/* Tab Panel 3 - Chính sách đổi trả */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant='h6' gutterBottom fontWeight='bold'>
                Chính Sách Đổi Trả
              </Typography>
              <Typography variant='body1' sx={{ lineHeight: 1.7 }}>
                • Đổi trả trong vòng 7 ngày kể từ ngày nhận hàng
                <br />
                • Sản phẩm còn nguyên tem mác, chưa qua sử dụng
                <br />
                • Đổi size miễn phí trong 3 ngày đầu
                <br />
                • Hoàn tiền 100% nếu sản phẩm lỗi từ nhà sản xuất
                <br />• Khách hàng chịu phí ship khi đổi trả do thay đổi ý
              </Typography>
            </TabPanel>

            {/* Tab Panel 4 - Bình luận */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant='h6' gutterBottom fontWeight='bold'>
                Bình Luận Khách Hàng
              </Typography>
              <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>
                <Typography variant='body1'>
                  Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ cảm nhận về sản phẩm!
                </Typography>
              </Box>
            </TabPanel>
          </Paper>
        </Container>

        {user && user?.id && (
          <Container maxWidth='lg' style={{ padding: '20px' }}>
            <Box textAlign='center' mb={7}>
              <Typography variant='h4' component='h1' fontWeight='bold' mb={1}>
                {t('similar-products')}
              </Typography>
            </Box>

            <Grid container spacing={3}>
              {productSimilar.data.map((product: TProduct) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <CardProduct item={product} />
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </Container>
    </>
  )
}

export default DetailProductPage
