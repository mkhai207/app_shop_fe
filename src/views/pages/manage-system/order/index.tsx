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
  Paper,
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
  Alert
} from '@mui/material'
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
  textAlign: 'center' as const
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
      case 'PAID':
        return 'green'
      case 'PENDING':
        return 'orange'
      case 'SHIPPING':
        return 'blue'
      case 'CANCELLED':
        return 'red'
      case 'DELIVERED':
        return 'green'
      default:
        return 'gray'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Đã thanh toán'
      case 'PENDING':
        return 'Chờ thanh toán'
      case 'SHIPPING':
        return 'Đang giao'
      case 'CANCELLED':
        return 'Đã hủy'
      case 'DELIVERED':
        return 'Đã giao'
      default:
        return status
    }
  }

  return (
    <TableCell sx={cellStyle}>
      <Typography
        sx={{
          color: getStatusColor(status),
          fontWeight: 'bold'
        }}
      >
        {getStatusText(status)}
      </Typography>
    </TableCell>
  )
}

const PaymentMethodCell = ({ method }: { method: string }) => {
  const getMethodText = (method: string) => {
    switch (method) {
      case 'ONLINE':
        return 'Thanh toán online'
      case 'COD':
        return 'Thanh toán khi nhận hàng'
      case 'BANK_TRANSFER':
        return 'Chuyển khoản ngân hàng'
      default:
        return method
    }
  }

  return (
    <TableCell sx={cellStyle}>
      <Typography>
        {getMethodText(method)}
      </Typography>
    </TableCell>
  )
}

const ManageOrderPage: React.FC = () => {
  // State declarations
  const { fetchOrders, createNewOrder } = useOrder()
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
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Load orders from API
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetchOrders()
        setOrders(response.data)
      } catch (err: any) {
        setError(err.message || 'Không thể tải danh sách đơn hàng')
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [fetchOrders])

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

  const validateOrderDetails = (orderDetails: Array<{product_variant_id: number, quantity: number}>) => {
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

  // Filtering and pagination
  const statuses = Array.from(new Set(orders.map(o => o.status).filter(Boolean)))
  const paymentMethods = Array.from(new Set(orders.map(o => o.payment_method).filter(Boolean)))
  
  const filteredOrders = orders.filter(order => {
    const matchName = order.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchPhone = order.phone.includes(searchTerm)
    const matchStatus = filterStatus ? order.status === filterStatus : true
    const matchPaymentMethod = filterPaymentMethod ? order.payment_method === filterPaymentMethod : true

    return (matchName || matchPhone) && matchStatus && matchPaymentMethod
  })
  
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      <Typography variant='h5' fontWeight='bold' mb={3}>
        Quản lý đơn hàng
      </Typography>

      {error && (
        <Box 
          sx={{ 
            mb: 2,
            p: 2,
            borderRadius: 1,
            backgroundColor: '#FDE4D5',
            border: '1px solid #EA5455',
            color: '#EA5455',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {error}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', mb: 3, gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <Button variant='contained' color='primary' onClick={handleAdd}>
          Thêm đơn hàng
        </Button>
        <Box>
          <TextField
            size='small'
            sx={{ width: 180, minWidth: 120 }}
            placeholder='Tìm kiếm theo tên, SĐT'
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </Box>
        <Box>
          <FormControl size='small' sx={{ width: 140, minWidth: 100 }}>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e: SelectChangeEvent) => {
                setFilterStatus(e.target.value)
                setCurrentPage(1)
              }}
              label='Trạng thái'
            >
              <MenuItem value=''>Tất cả</MenuItem>
              {statuses.map(status => (
                <MenuItem key={status} value={status}>
                  {status === 'PAID' ? 'Đã thanh toán' : 
                   status === 'PENDING' ? 'Chờ thanh toán' :
                   status === 'SHIPPING' ? 'Đang giao' :
                   status === 'CANCELLED' ? 'Đã hủy' :
                   status === 'DELIVERED' ? 'Đã giao' : status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box>
          <FormControl size='small' sx={{ width: 140, minWidth: 100 }}>
            <InputLabel>Thanh toán</InputLabel>
            <Select
              value={filterPaymentMethod}
              onChange={(e: SelectChangeEvent) => {
                setFilterPaymentMethod(e.target.value)
                setCurrentPage(1)
              }}
              label='Thanh toán'
            >
              <MenuItem value=''>Tất cả</MenuItem>
              {paymentMethods.map(method => (
                <MenuItem key={method} value={method}>
                  {method === 'ONLINE' ? 'Thanh toán online' :
                   method === 'COD' ? 'Thanh toán khi nhận hàng' :
                   method === 'BANK_TRANSFER' ? 'Chuyển khoản ngân hàng' : method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              width: '100%',
              overflowX: 'auto',
              maxWidth: '100%'
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
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
                        padding: '8px'
                      }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.length > 0 ? (
                  paginatedOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell sx={{ textAlign: 'center' }}>{order.id}</TableCell>
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
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={formatCurrency(order.total_money)}>
                          <span style={ellipsisStyle}>{formatCurrency(order.total_money)}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button variant='outlined' color='warning' size='small' onClick={() => handleEdit(order)}>
                            Sửa
                          </Button>
                          <Button
                            variant='outlined'
                            color='error'
                            size='small'
                            onClick={() => handleDelete(order.id)}
                          >
                            Xoá
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={13} sx={{ textAlign: 'center' }}>
                      Không có đơn hàng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ mt: 4, mb: 4 }}>
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
        </>
      )}

      {/* Edit Order Dialog */}
      <Dialog open={editModal} onClose={() => setEditModal(false)} maxWidth='md' fullWidth>
        <DialogTitle>Sửa thông tin đơn hàng</DialogTitle>
        <DialogContent>
          {editOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label='Tên khách hàng'
                value={editOrder.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditOrder({ ...editOrder, name: e.target.value })
                }
                fullWidth
              />
              <TextField
                label='Số điện thoại'
                value={editOrder.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditOrder({ ...editOrder, phone: e.target.value })
                }
                fullWidth
              />
              <TextField
                label='Địa chỉ giao hàng'
                value={editOrder.shipping_address}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditOrder({ ...editOrder, shipping_address: e.target.value })
                }
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label='Tổng tiền'
                type='number'
                value={editOrder.total_money || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditOrder({ ...editOrder, total_money: Number(e.target.value) })
                }
                fullWidth
              />
              <TextField
                label='Mã giảm giá'
                value={editOrder.discount_id || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditOrder({ ...editOrder, discount_id: Number(e.target.value) })
                }
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Phương thức thanh toán</InputLabel>
                <Select
                  value={editOrder.payment_method}
                  onChange={(e: SelectChangeEvent) =>
                    setEditOrder({ ...editOrder, payment_method: e.target.value })
                  }
                  label='Phương thức thanh toán'
                >
                  <MenuItem value='ONLINE'>Thanh toán online</MenuItem>
                  <MenuItem value='COD'>Thanh toán khi nhận hàng</MenuItem>
                  <MenuItem value='BANK_TRANSFER'>Chuyển khoản ngân hàng</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={editOrder.status}
                  onChange={(e: SelectChangeEvent) =>
                    setEditOrder({ ...editOrder, status: e.target.value })
                  }
                  label='Trạng thái'
                >
                  <MenuItem value='PENDING'>Chờ thanh toán</MenuItem>
                  <MenuItem value='PAID'>Đã thanh toán</MenuItem>
                  <MenuItem value='SHIPPING'>Đang giao</MenuItem>
                  <MenuItem value='DELIVERED'>Đã giao</MenuItem>
                  <MenuItem value='CANCELLED'>Đã hủy</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModal(false)}>Huỷ</Button>
          <Button onClick={handleSaveEdit} variant='contained' color='primary'>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Order Dialog */}
      <Dialog open={addModal} onClose={() => setAddModal(false)} maxWidth='md' fullWidth>
        <DialogTitle>Thêm đơn hàng mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
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
             />
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
             />
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
             />
            <TextField
              label='Mã giảm giá (tùy chọn)'
              value={newOrder.discount_code || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewOrder({ ...newOrder, discount_code: e.target.value })
              }
              fullWidth
              helperText='Nhập mã giảm giá nếu có'
            />
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
               >
                 <MenuItem value='CASH'>Tiền mặt</MenuItem>
                 <MenuItem value='ONLINE'>Thanh toán online</MenuItem>
               </Select>
               {formErrors.paymentMethod && (
                 <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                   {formErrors.paymentMethod}
                 </Typography>
               )}
             </FormControl>
            
                         {/* Order Details Section */}
             <Box sx={{ 
               mt: 2, 
               p: 2, 
               border: formErrors.orderDetails ? '1px solid #d32f2f' : '1px solid #e0e0e0', 
               borderRadius: 1 
             }}>
               <Typography variant='h6' sx={{ mb: 2 }}>
                 Chi tiết đơn hàng *
               </Typography>
               {formErrors.orderDetails && (
                 <Typography variant="caption" color="error" sx={{ mb: 2, display: 'block' }}>
                   {formErrors.orderDetails}
                 </Typography>
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
                     sx={{ flex: 1 }}
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
                     sx={{ width: 120 }}
                   />
                                     <Button
                     variant='outlined'
                     color='error'
                     size='small'
                     onClick={() => {
                       const updatedDetails = newOrder.orderDetails.filter((_, i) => i !== index)
                       setNewOrder({ ...newOrder, orderDetails: updatedDetails })
                       const orderDetailsError = validateOrderDetails(updatedDetails)
                       setFormErrors({ ...formErrors, orderDetails: orderDetailsError })
                     }}
                   >
                     Xóa
                   </Button>
                </Box>
              ))}
              
                             <Button
                 variant='outlined'
                 onClick={() => {
                   const updatedDetails = [...newOrder.orderDetails, { product_variant_id: 1, quantity: 1 }]
                   setNewOrder({
                     ...newOrder,
                     orderDetails: updatedDetails
                   })
                   const orderDetailsError = validateOrderDetails(updatedDetails)
                   setFormErrors({ ...formErrors, orderDetails: orderDetailsError })
                 }}
                 sx={{ mt: 1 }}
               >
                 Thêm sản phẩm
               </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModal(false)}>Huỷ</Button>
          <Button 
            onClick={handleSaveAdd} 
            variant='contained' 
            color='primary'
            disabled={loading}
          >
            {loading ? 'Đang tạo...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageOrderPage
