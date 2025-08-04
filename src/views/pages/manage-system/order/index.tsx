import React, { useState, useEffect } from 'react'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  IconButton,
  Chip,
  Divider,
  Grid,
  InputAdornment
} from '@mui/material'
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'
import CustomPagination from 'src/components/custom-pagination'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { useOrder } from 'src/hooks/useOrder'
import { Order } from 'src/services/order'

// Định nghĩa kiểu dữ liệu đơn hàng mới
interface NewOrder {
  name: string
  phone: string
  shipping_address: string
  paymentMethod: string
  discount_code?: string
  orderDetails: Array<{
    product_variant_id: number
    quantity: number
  }>
}

const cellStyle = {
  maxWidth: 150,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center' as const,
  padding: '12px 8px'
}

const ellipsisStyle: React.CSSProperties = {
  maxWidth: 120,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  display: 'inline-block',
  verticalAlign: 'middle'
}

// Cell hiển thị kèm Tooltip
const TooltipCell = ({ value }: { value: string | number }) => (
  <TableCell sx={cellStyle}>
    <Tooltip title={String(value)} arrow placement='bottom'>
      <span>{value}</span>
    </Tooltip>
  </TableCell>
)

const StatusCell = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'UNPAID':
        return '#f44336'
      case 'PAID':
        return '#4caf50'
      case 'PENDING':
        return '#ff9800'
      case 'SHIPPING':
        return '#2196f3'
      case 'CANCELLED':
        return '#f44336'
      case 'COMPLETED':
        return '#4caf50'
      default:
        return '#9e9e9e'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'UNPAID':
        return 'Chưa thanh toán'
      case 'PAID':
        return 'Đã thanh toán'
      case 'PENDING':
        return 'Chờ xác nhận'
      case 'SHIPPING':
        return 'Đang giao'
      case 'CANCELLED':
        return 'Đã hủy'
      case 'COMPLETED':
        return 'Đã hoàn thành'
      default:
        return status
    }
  }

  return (
    <TableCell sx={cellStyle}>
      <Chip
        label={getStatusText(status)}
        sx={{
          backgroundColor: getStatusColor(status),
          color: 'white',
          fontWeight: 'bold',
          fontSize: '0.75rem',
          minWidth: 80
        }}
        size='small'
      />
    </TableCell>
  )
}

const PaymentMethodCell = ({ method }: { method: string }) => {
  const getMethodText = (method: string) => {
    switch (method) {
      case 'ONLINE':
        return 'Thanh toán online'
      case 'CASH':
        return 'Thanh toán khi nhận hàng'
      default:
        return method
    }
  }

  return (
    <TableCell sx={cellStyle}>
      <Typography variant='body2' sx={{ fontWeight: 500 }}>
        {getMethodText(method)}
      </Typography>
    </TableCell>
  )
}

const ManageOrderPage: React.FC = () => {
  // State declarations
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [page, setPage] = useState(1)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [newOrder, setNewOrder] = useState<NewOrder>({
    name: '',
    phone: '',
    shipping_address: '',
    paymentMethod: '',
    orderDetails: [{ product_variant_id: 1, quantity: 1 }]
  })
  const [formErrors, setFormErrors] = useState<{
    name?: string
    phone?: string
    shipping_address?: string
    paymentMethod?: string
    orderDetails?: string
  }>({})
  const [productsPublic, setProductsPublic] = useState<{
    data: TProduct[]
    total: number
    totalPages: number
    currentPage: number
  }>({
    data: [],
    total: 0,
    totalPages: 0,
    currentPage: 1
  })
  const [searchBy, setSearchBy] = useState('')
  const [filters, setFilters] = useState<{
    brand_id: number
    category_id: number
  }>({ brand_id: 0, category_id: 0 })

  const formatFiltersForAPI = () => {
    const params: Record<string, any> = {
      page: page || 1,
      limit: pageSize || 10,
      sort: 'created_at:desc'
    }

    if (searchBy?.trim()) {
      params.name = `like:${searchBy.trim()}`
    }

    if (filters.brand_id) {
      params.brand_id = filters.brand_id
    }

    if (filters.category_id) {
      params.category_id = filters.category_id
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

  const handleGetListOrders = async () => {
    try {
      setLoading(true)

      const queryParams = formatFiltersForAPI()

      const response = await getAllProductsPublic({
        params: queryParams,
        paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat', encode: false })
      })

      if (response.status === 'success') {
        setProductsPublic({
          data: response.data || [],
          total: response.meta?.totalItems || 0,
          totalPages: response.meta?.totalPages || 0,
          currentPage: response.meta?.currentPage || 1
        })
      }
    } catch (error: any) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load orders from API
  useEffect(() => {}, [])

  // Handlers
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xoá đơn hàng này?')) {
      setOrders(orders.filter(o => o.id !== id))
    }
  }

  const handleEdit = (order: Order) => {
    setEditOrder(order)
    setEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editOrder) {
      setOrders(
        orders.map(o =>
          o.id === editOrder.id ? { ...editOrder, updated_at: new Date().toISOString(), updated_by: 'admin' } : o
        )
      )
      setEditModal(false)
    }
  }

  const handleAdd = () => {
    setNewOrder({
      name: '',
      phone: '',
      shipping_address: '',
      paymentMethod: '',
      orderDetails: [{ product_variant_id: 1, quantity: 1 }]
    })
    setFormErrors({})
    setAddModal(true)
  }

  const validateField = (field: string, value: any) => {
    switch (field) {
      case 'name':
        if (!value.trim()) {
          return 'Tên khách hàng là bắt buộc'
        } else if (value.trim().length < 2) {
          return 'Tên khách hàng phải có ít nhất 2 ký tự'
        }
        return undefined

      case 'phone':
        if (!value.trim()) {
          return 'Số điện thoại là bắt buộc'
        } else if (!/^[0-9]{10,11}$/.test(value.trim())) {
          return 'Số điện thoại phải có 10-11 chữ số'
        }
        return undefined

      case 'shipping_address':
        if (!value.trim()) {
          return 'Địa chỉ giao hàng là bắt buộc'
        } else if (value.trim().length < 10) {
          return 'Địa chỉ giao hàng phải có ít nhất 10 ký tự'
        }
        return undefined

      case 'paymentMethod':
        if (!value) {
          return 'Vui lòng chọn phương thức thanh toán'
        }
        return undefined

      default:
        return undefined
    }
  }

  const validateOrderDetails = (orderDetails: Array<{ product_variant_id: number; quantity: number }>) => {
    if (orderDetails.length === 0) {
      return 'Phải có ít nhất một sản phẩm trong đơn hàng'
    }

    for (let i = 0; i < orderDetails.length; i++) {
      const detail = orderDetails[i]
      if (!detail.product_variant_id || detail.product_variant_id <= 0) {
        return `Sản phẩm ${i + 1}: ID biến thể sản phẩm phải là số dương`
      }
      if (!detail.quantity || detail.quantity <= 0) {
        return `Sản phẩm ${i + 1}: Số lượng phải là số dương`
      }
    }

    return undefined
  }

  const validateForm = () => {
    const errors: any = {}

    // Validate individual fields
    const nameError = validateField('name', newOrder.name)
    if (nameError) errors.name = nameError

    const phoneError = validateField('phone', newOrder.phone)
    if (phoneError) errors.phone = phoneError

    const addressError = validateField('shipping_address', newOrder.shipping_address)
    if (addressError) errors.shipping_address = addressError

    const paymentError = validateField('paymentMethod', newOrder.paymentMethod)
    if (paymentError) errors.paymentMethod = paymentError

    // Validate order details
    const orderDetailsError = validateOrderDetails(newOrder.orderDetails)
    if (orderDetailsError) errors.orderDetails = orderDetailsError

    setFormErrors(errors)

    return Object.keys(errors).length === 0
  }

  const handleSaveAdd = async () => {
    try {
      setLoading(true)
      setError('')

      // Validate form
      if (!validateForm()) {
        return
      }

      const response = await createNewOrder(newOrder)

      // Add the new order to the list
      setOrders([response.data, ...orders])
      setAddModal(false)
      setFormErrors({})

      // Show success message
      alert('Tạo đơn hàng thành công!')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra khi tạo đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
  }

  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        maxWidth: '100vw',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowX: 'hidden',
        backgroundColor: '#f5f5f5'
      }}
    >
      {/* Header Section */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ShoppingCartIcon sx={{ fontSize: 32, color: 'primary.main' }} />
              <Typography variant='h4' fontWeight='bold' color='primary'>
                Quản lý đơn hàng
              </Typography>
            </Box>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1.5,
                textTransform: 'none',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              Thêm đơn hàng
            </Button>
          </Box>

          {error && (
            <Alert severity='error' sx={{ mb: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Filters Section */}
      <Card sx={{ mb: 3, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FilterIcon sx={{ color: 'primary.main' }} />
            <Typography variant='h6' fontWeight='bold'>
              Bộ lọc tìm kiếm
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems='flex-end'>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                size='small'
                fullWidth
                placeholder='Tìm kiếm theo tên, SĐT'
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size='small' fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e: SelectChangeEvent) => {
                    setFilterStatus(e.target.value)
                    setCurrentPage(1)
                  }}
                  label='Trạng thái'
                  sx={{
                    borderRadius: 2
                  }}
                >
                  <MenuItem value=''>Tất cả</MenuItem>
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status === 'PAID'
                        ? 'Đã thanh toán'
                        : status === 'PENDING'
                          ? 'Chờ thanh toán'
                          : status === 'SHIPPING'
                            ? 'Đang giao'
                            : status === 'CANCELLED'
                              ? 'Đã hủy'
                              : status === 'DELIVERED'
                                ? 'Đã giao'
                                : status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl size='small' fullWidth>
                <InputLabel>Thanh toán</InputLabel>
                <Select
                  value={filterPaymentMethod}
                  onChange={(e: SelectChangeEvent) => {
                    setFilterPaymentMethod(e.target.value)
                    setCurrentPage(1)
                  }}
                  label='Thanh toán'
                  sx={{
                    borderRadius: 2
                  }}
                >
                  <MenuItem value=''>Tất cả</MenuItem>
                  {paymentMethods.map(method => (
                    <MenuItem key={method} value={method}>
                      {method === 'ONLINE'
                        ? 'Thanh toán online'
                        : method === 'COD'
                          ? 'Thanh toán khi nhận hàng'
                          : method === 'BANK_TRANSFER'
                            ? 'Chuyển khoản ngân hàng'
                            : method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant='outlined'
                startIcon={<RefreshIcon />}
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('')
                  setFilterPaymentMethod('')
                  setCurrentPage(1)
                }}
                fullWidth
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                Làm mới
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Table Section */}
      {loading ? (
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <CardContent sx={{ p: 4 }}>
            <Box display='flex' justifyContent='center' alignItems='center' minHeight='300px'>
              <CircularProgress size={60} />
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  {[
                    'ID',
                    'Ngày tạo',
                    'Người tạo',
                    'Ngày cập nhật',
                    'Người cập nhật',
                    'Tên khách hàng',
                    'Phương thức thanh toán',
                    'Số điện thoại',
                    'Địa chỉ giao hàng',
                    'Trạng thái',
                    'Mã giảm giá',
                    'Tổng tiền',
                    'Hành động'
                  ].map(header => (
                    <TableCell
                      key={header}
                      sx={{
                        textAlign: 'center',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        padding: '16px 8px',
                        color: 'white',
                        backgroundColor: 'primary.main',
                        borderBottom: '2px solid #1976d2'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map((order, index) => (
                    <TableRow
                      key={order.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          transition: 'background-color 0.2s ease'
                        },
                        backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                      }}
                    >
                      <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                        #{order.id}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(order.created_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={order.created_by}>
                          <span style={ellipsisStyle}>{order.created_by}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(order.updated_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={order.updated_by}>
                          <span style={ellipsisStyle}>{order.updated_by}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={order.name}>
                          <span style={ellipsisStyle}>{order.name}</span>
                        </Tooltip>
                      </TableCell>
                      <PaymentMethodCell method={order.payment_method} />
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={order.phone}>
                          <span style={ellipsisStyle}>{order.phone}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={order.shipping_address}>
                          <span style={ellipsisStyle}>{order.shipping_address}</span>
                        </Tooltip>
                      </TableCell>
                      <StatusCell status={order.status} />
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={order.discount_id || 'Không có'}>
                          <span style={ellipsisStyle}>{order.discount_id || '-'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center', fontWeight: 'bold', color: 'success.main' }}>
                        <Tooltip title={formatCurrency(order.total_money)}>
                          <span style={ellipsisStyle}>{formatCurrency(order.total_money)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            color='primary'
                            size='small'
                            onClick={() => handleEdit(order)}
                            sx={{
                              backgroundColor: 'primary.light',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'primary.main'
                              }
                            }}
                          >
                            <EditIcon fontSize='small' />
                          </IconButton>
                          <IconButton
                            color='error'
                            size='small'
                            onClick={() => handleDelete(order.id)}
                            sx={{
                              backgroundColor: 'error.light',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'error.main'
                              }
                            }}
                          >
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} sx={{ textAlign: 'center', py: 8 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <ShoppingCartIcon sx={{ fontSize: 64, color: 'grey.400' }} />
                        <Typography variant='h6' color='text.secondary'>
                          Không có đơn hàng nào
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          Hãy thêm đơn hàng mới để bắt đầu
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
              <CustomPagination
                onChangePagination={handleOnchangePagination}
                pageSizeOptions={PAGE_SIZE_OPTION}
                pageSize={pageSize}
                totalPages={totalPages}
                page={page}
                rowLength={10}
                isHideShowed
              />
            </Box>
          )}
        </Card>
      )}

      {/* Edit Order Dialog */}
      <Dialog
        open={editModal}
        onClose={() => setEditModal(false)}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <EditIcon />
          Sửa thông tin đơn hàng
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {editOrder && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Tên khách hàng'
                  value={editOrder.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditOrder({ ...editOrder, name: e.target.value })
                  }
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Số điện thoại'
                  value={editOrder.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditOrder({ ...editOrder, phone: e.target.value })
                  }
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Địa chỉ giao hàng'
                  value={editOrder.shipping_address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditOrder({ ...editOrder, shipping_address: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={2}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Tổng tiền'
                  type='number'
                  value={editOrder.total_money || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditOrder({ ...editOrder, total_money: Number(e.target.value) })
                  }
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label='Mã giảm giá'
                  value={editOrder.discount_id || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditOrder({ ...editOrder, discount_id: Number(e.target.value) })
                  }
                  fullWidth
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Phương thức thanh toán</InputLabel>
                  <Select
                    value={editOrder.payment_method}
                    onChange={(e: SelectChangeEvent) => setEditOrder({ ...editOrder, payment_method: e.target.value })}
                    label='Phương thức thanh toán'
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value='ONLINE'>Thanh toán online</MenuItem>
                    <MenuItem value='COD'>Thanh toán khi nhận hàng</MenuItem>
                    <MenuItem value='BANK_TRANSFER'>Chuyển khoản ngân hàng</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={editOrder.status}
                    onChange={(e: SelectChangeEvent) => setEditOrder({ ...editOrder, status: e.target.value })}
                    label='Trạng thái'
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                  >
                    <MenuItem value='PENDING'>Chờ thanh toán</MenuItem>
                    <MenuItem value='PAID'>Đã thanh toán</MenuItem>
                    <MenuItem value='SHIPPING'>Đang giao</MenuItem>
                    <MenuItem value='DELIVERED'>Đã giao</MenuItem>
                    <MenuItem value='CANCELLED'>Đã hủy</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => setEditModal(false)} variant='outlined' sx={{ borderRadius: 2, px: 3 }}>
            Huỷ
          </Button>
          <Button onClick={handleSaveEdit} variant='contained' color='primary' sx={{ borderRadius: 2, px: 3 }}>
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Order Dialog */}
      <Dialog
        open={addModal}
        onClose={() => setAddModal(false)}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: 'success.main',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <AddIcon />
          Thêm đơn hàng mới
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Tên khách hàng *'
                value={newOrder.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setNewOrder({ ...newOrder, name: value })
                  const error = validateField('name', value)
                  setFormErrors({ ...formErrors, name: error })
                }}
                fullWidth
                required
                error={!!formErrors.name}
                helperText={formErrors.name}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Số điện thoại *'
                value={newOrder.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setNewOrder({ ...newOrder, phone: value })
                  const error = validateField('phone', value)
                  setFormErrors({ ...formErrors, phone: error })
                }}
                fullWidth
                required
                error={!!formErrors.phone}
                helperText={formErrors.phone}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Địa chỉ giao hàng *'
                value={newOrder.shipping_address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const value = e.target.value
                  setNewOrder({ ...newOrder, shipping_address: value })
                  const error = validateField('shipping_address', value)
                  setFormErrors({ ...formErrors, shipping_address: error })
                }}
                fullWidth
                multiline
                rows={2}
                required
                error={!!formErrors.shipping_address}
                helperText={formErrors.shipping_address}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label='Mã giảm giá (tùy chọn)'
                value={newOrder.discount_code || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewOrder({ ...newOrder, discount_code: e.target.value })
                }
                fullWidth
                helperText='Nhập mã giảm giá nếu có'
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.paymentMethod}>
                <InputLabel>Phương thức thanh toán *</InputLabel>
                <Select
                  value={newOrder.paymentMethod}
                  onChange={(e: SelectChangeEvent) => {
                    const value = e.target.value
                    setNewOrder({ ...newOrder, paymentMethod: value })
                    const error = validateField('paymentMethod', value)
                    setFormErrors({ ...formErrors, paymentMethod: error })
                  }}
                  label='Phương thức thanh toán *'
                  required
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value='CASH'>Tiền mặt</MenuItem>
                  <MenuItem value='ONLINE'>Thanh toán online</MenuItem>
                </Select>
                {formErrors.paymentMethod && (
                  <Typography variant='caption' color='error' sx={{ mt: 0.5, ml: 1.5 }}>
                    {formErrors.paymentMethod}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            {/* Order Details Section */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  p: 3,
                  border: formErrors.orderDetails ? '2px solid #d32f2f' : '2px solid #e0e0e0',
                  borderRadius: 2,
                  backgroundColor: '#fafafa'
                }}
              >
                <Typography variant='h6' sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingCartIcon />
                  Chi tiết đơn hàng *
                </Typography>
                {formErrors.orderDetails && (
                  <Alert severity='error' sx={{ mb: 2 }}>
                    {formErrors.orderDetails}
                  </Alert>
                )}

                {newOrder.orderDetails.map((detail, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <TextField
                      label='ID biến thể sản phẩm'
                      type='number'
                      value={detail.product_variant_id}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updatedDetails = [...newOrder.orderDetails]
                        updatedDetails[index].product_variant_id = Number(e.target.value)
                        setNewOrder({ ...newOrder, orderDetails: updatedDetails })

                        // Validate order details
                        const orderDetailsError = validateOrderDetails(updatedDetails)
                        setFormErrors({ ...formErrors, orderDetails: orderDetailsError })
                      }}
                      sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                      label='Số lượng'
                      type='number'
                      value={detail.quantity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const updatedDetails = [...newOrder.orderDetails]
                        updatedDetails[index].quantity = Number(e.target.value)
                        setNewOrder({ ...newOrder, orderDetails: updatedDetails })

                        // Validate order details
                        const orderDetailsError = validateOrderDetails(updatedDetails)
                        setFormErrors({ ...formErrors, orderDetails: orderDetailsError })
                      }}
                      sx={{ width: 120, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <IconButton
                      color='error'
                      onClick={() => {
                        const updatedDetails = newOrder.orderDetails.filter((_, i) => i !== index)
                        setNewOrder({ ...newOrder, orderDetails: updatedDetails })
                        const orderDetailsError = validateOrderDetails(updatedDetails)
                        setFormErrors({ ...formErrors, orderDetails: orderDetailsError })
                      }}
                      sx={{
                        backgroundColor: 'error.light',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'error.main'
                        }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}

                <Button
                  variant='outlined'
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const updatedDetails = [...newOrder.orderDetails, { product_variant_id: 1, quantity: 1 }]
                    setNewOrder({
                      ...newOrder,
                      orderDetails: updatedDetails
                    })
                    const orderDetailsError = validateOrderDetails(updatedDetails)
                    setFormErrors({ ...formErrors, orderDetails: orderDetailsError })
                  }}
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Thêm sản phẩm
                </Button>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button onClick={() => setAddModal(false)} variant='outlined' sx={{ borderRadius: 2, px: 3 }}>
            Huỷ
          </Button>
          <Button
            onClick={handleSaveAdd}
            variant='contained'
            color='success'
            disabled={loading}
            sx={{ borderRadius: 2, px: 3 }}
          >
            {loading ? 'Đang tạo...' : 'Tạo đơn hàng'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageOrderPage
