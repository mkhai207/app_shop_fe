import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import dayjs from 'dayjs'
import { t } from 'i18next'
import qs from 'qs'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomPagination from 'src/components/custom-pagination'
import Spinner from 'src/components/spinner'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { getListOrders, retryPayOrder } from 'src/services/order'

const getStatusStyles = (status: string) => {
  switch (status) {
    case 'PENDING':
      return { backgroundColor: '#FFF3E0', color: '#F57C00' } // Cam nhạt
    case 'UNPAID':
      return { backgroundColor: '#FFEBEE', color: '#D32F2F' } // Đỏ nhạt
    case 'PAID':
      return { backgroundColor: '#E8F5E9', color: '#2E7D32' } // Xanh lá nhạt
    case 'SHIPPING':
      return { backgroundColor: '#E3F2FD', color: '#0288D1' } // Xanh dương nhạt
    case 'COMPLETED':
      return { backgroundColor: '#ECEFF1', color: '#37474F' } // Xám nhạt,
    case 'CANCELLED':
      return { backgroundColor: '#FFEBEE', color: '#D32F2F' } // Đỏ nhạt
    default:
      return { backgroundColor: '#F5F5F5', color: '#616161' } // Mặc định
  }
}

const OrderHistoryPage = () => {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [orders, setOrders] = useState<{
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
  const [loading, setLoading] = useState(false)

  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  const formatFiltersForAPI = () => {
    const params: Record<string, any> = {
      page: page || 1,
      limit: pageSize || 6,
      sort: 'created_at:DESC'
    }

    Object.keys(params).forEach(key => {
      if (
        params[key] === undefined ||
        params[key] === null ||
        (Array.isArray(params[key]) && params[key].length === 0)
      ) {
        delete params[key]
      }
    })

    return params
  }

  const handlePayOrder = async (orderId: string) => {
    try {
      setLoading(true)
      const response = await retryPayOrder(orderId)

      if (response?.status === 'success' && response?.data) {
        setLoading(false)
        const url = response?.data?.vnpayUrl
        console.log('url', url)
        if (url) {
          window.location.href = url
        }
      }
    } catch (error) {
      setLoading(false)
    }
  }

  const handleGetListOrders = async () => {
    try {
      setLoading(true)

      const queryParams = formatFiltersForAPI()

      const response = await getListOrders({
        params: queryParams,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat', encode: false })
      })

      if (response.status === 'success') {
        setOrders({
          data: response?.data || [],
          total: response.meta?.totalItems || 0,
          totalPages: response.meta?.totalPages || 0,
          currentPage: response.meta?.currentPage || 1
        })

        toast.success('Tải đơn hàng thành công!')
      } else {
        toast.error(response.message || 'Có lỗi xảy ra khi tải đơn hàng')
      }
    } catch (error: any) {
      toast.error(error?.message || 'Có lỗi xảy ra khi tải đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    handleGetListOrders()
  }, [page, pageSize])

  return (
    <>
      {loading && <Spinner />}
      <Box sx={{ p: 3 }}>
        <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fafafa' }}>
                <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Recipient Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Shipping Address</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.data.map(order => (
                <TableRow key={order.id} hover>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box>
                        <Typography variant='body2' fontWeight={500}>
                          {order.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{order.shipping_address}</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{dayjs(order.created_at).format('DD/MM/YYYY')}</TableCell>
                  <TableCell>
                    <Chip label={order.status} sx={getStatusStyles(order.status)} size='small' />
                  </TableCell>
                  <TableCell>
                    <Button variant='contained' size='small' sx={{ mr: 2 }}>
                      {t('view')}
                    </Button>
                    {order.status === 'UNPAID' && (
                      <Button variant='contained' size='small' onClick={() => handlePayOrder(order.id)}>
                        {t('pay')}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        <Box sx={{ mt: 4, mb: 4 }}>
          <CustomPagination
            onChangePagination={handleOnchangePagination}
            pageSizeOptions={PAGE_SIZE_OPTION}
            pageSize={pageSize}
            totalPages={orders?.totalPages}
            page={page}
            rowLength={10}
            isHideShowed
          />
        </Box>
      </Box>
    </>
  )
}

export default OrderHistoryPage
