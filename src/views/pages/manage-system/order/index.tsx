import React from 'react'
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
  Paper
} from '@mui/material'

// Định nghĩa kiểu dữ liệu đơn hàng
interface Order {
  id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  name: string
  payment_method: string
  phone: string
  address: string
  status: string
  discount_id: string
  user_name: string
}

// Danh sách đơn hàng mẫu
const orders: Order[] = [
  {
    id: 1,
    created_at: '2024-06-01',
    created_by: 'admin',
    updated_at: '2024-06-02',
    updated_by: 'admin',
    name: 'Đơn hàng 1',
    payment_method: 'COD',
    phone: '0123456789',
    address: 'Hà Nội ádfasdfasdfasdfasdfasdfasdfasdfasdfasf',
    status: 'Đang xử lý',
    discount_id: 'DISC10',
    user_name: 'Nguyễn Văn A'
  },
  {
    id: 2,
    created_at: '2024-06-03',
    created_by: 'staff',
    updated_at: '2024-06-04',
    updated_by: 'staff',
    name: 'Đơn hàng 2',
    payment_method: 'Chuyển khoản',
    phone: '0987654321',
    address: 'Hồ Chí Minh',
    status: 'Hoàn thành',
    discount_id: 'DISC20',
    user_name: 'Trần Thị B'
  }
]

// Cell hiển thị kèm Tooltip
const TooltipCell = ({ value }: { value: string | number }) => (
  <TableCell
    sx={{
      maxWidth: 160,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'center'
    }}
  >
    <Tooltip title={String(value)} arrow placement='bottom'>
      <span>{value}</span>
    </Tooltip>
  </TableCell>
)

const ManageOrderPage: React.FC = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant='h5' fontWeight='bold' gutterBottom>
        Quản lý đơn hàng
      </Typography>
      <TableContainer component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {[
                'ID',
                'Ngày tạo',
                'Người tạo',
                'Ngày cập nhật',
                'Người cập nhật',
                'Tên đơn hàng',
                'Phương thức thanh toán',
                'Số điện thoại',
                'Địa chỉ',
                'Trạng thái',
                'Mã giảm giá',
                'Tên người dùng'
              ].map(header => (
                <TableCell key={header} sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TooltipCell value={order.id} />
                <TooltipCell value={order.created_at} />
                <TooltipCell value={order.created_by} />
                <TooltipCell value={order.updated_at} />
                <TooltipCell value={order.updated_by} />
                <TooltipCell value={order.name} />
                <TooltipCell value={order.payment_method} />
                <TooltipCell value={order.phone} />
                <TooltipCell value={order.address} />
                <TooltipCell value={order.status} />
                <TooltipCell value={order.discount_id} />
                <TooltipCell value={order.user_name} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ManageOrderPage
