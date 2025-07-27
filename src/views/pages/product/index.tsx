import { Box, Grid, Typography, useTheme } from '@mui/material'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import CardProduct from '../../../components/card-product/CardProduct'
import { getAllProductsPublic } from 'src/services/product'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { TProduct } from 'src/types/product'
import CustomPagination from 'src/components/custom-pagination'
import Spinner from 'src/components/spinner'
import { ROUTE_CONFIG } from 'src/configs/route'
import { useRouter } from 'next/router'

type TProps = {}

const ProductPage: NextPage<TProps> = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const router = useRouter()

  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [page, setPage] = useState(1)

  // Filter states
  const [searchBy, setSearchBy] = useState('')
  const [sortBy, setSortBy] = useState('created_at:DESC')
  const [typeSelected, setTypeSelected] = useState<string[]>([])
  const [statusSelected, setStatusSelected] = useState<string[]>([])

  // Data states
  const [loading, setLoading] = useState(false)
  const [productsPublic, setProductsPublic] = useState<{
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

  const formatFiltersForAPI = () => {
    const params: Record<string, any> = {
      page,
      limit: pageSize,
      sort: sortBy
    }

    // Add search filter
    if (searchBy.trim()) {
      params.name = `like:${searchBy.trim()}`
    }

    // Add status filter
    if (statusSelected.length > 0) {
      params.status = statusSelected.length === 1 ? statusSelected[0] : statusSelected
    }

    // Add type/category filter
    if (typeSelected.length > 0) {
      params.type = typeSelected.length === 1 ? typeSelected[0] : typeSelected
    }

    return params
  }

  // fetch api
  const handleGetListProducts = async () => {
    try {
      setLoading(true)

      const queryParams = formatFiltersForAPI()

      const response = await getAllProductsPublic({ params: queryParams })
      console.log('API Response:', response)

      if (response.status === 'success') {
        console.log('data', response?.data)
        setProductsPublic({
          data: response?.data || [],
          total: response.meta?.totalItems || 0,
          totalPages: response.meta?.totalPages || 0,
          currentPage: response.meta?.currentPage || 1
        })

        toast.success('Tải sản phẩm thành công!')
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tải sản phẩm')
      }
    } catch (error: any) {
      console.error('Error fetching products:', error)
      toast.error(error?.message || 'Có lỗi xảy ra khi tải sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const handleNavigateProduct = () => {
    router.push(`${ROUTE_CONFIG.PRODUCT}`)
  }

  useEffect(() => {
    handleGetListProducts()
  }, [page, pageSize, searchBy, sortBy, statusSelected, typeSelected])

  // only run on mount
  useEffect(() => {
    handleGetListProducts()
  }, [])

  return (
    <>
      {loading && <Spinner />}
      <Box
        sx={{
          mx: 'auto',
          backgroundColor: theme.palette.background.paper,
          height: '100%',
          width: '80%'
        }}
      >
        {/* Banner Section */}
        <Box
          sx={{
            width: '100%',
            height: 'auto',
            mb: 10,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            cursor: 'pointer'
          }}
          onClick={() => handleNavigateProduct()}
        >
          <img
            src='/images/product-banner.jpg'
            alt={t('banner_alt')}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover'
            }}
          />
        </Box>
        <Box sx={{ height: '100%', width: '100%', mt: 4, mb: 4 }}>
          <Grid container spacing={4} justifyContent='flex-start'>
            {productsPublic?.data?.length > 0 ? (
              productsPublic.data.map((item: TProduct) => (
                <Grid item key={item.id} xs={12} sm={6} md={4} lg={3}>
                  <CardProduct item={item} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12}>
                <Typography>Không có sản phẩm</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
        <CustomPagination
          onChangePagination={handleOnchangePagination}
          pageSizeOptions={PAGE_SIZE_OPTION}
          pageSize={pageSize}
          totalPages={productsPublic?.totalPages}
          page={page}
          rowLength={10}
          isHideShowed
        />
      </Box>
    </>
  )
}

export default ProductPage
