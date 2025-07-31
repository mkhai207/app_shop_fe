import React, { useState } from 'react'
import {
  Box,
  Avatar,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material'

// Kiểu dữ liệu TypeScript cho khách hàng
interface Customer {
  id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  active: boolean
  avartar: string
  birthday: string
  email: string
  fullname: string
  gender: string
  phone: string
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    created_at: '2024-06-01',
    created_by: 'admin',
    updated_at: '2024-06-02',
    updated_by: 'admin',
    active: true,
    avartar: '/avatars/1.jpg',
    birthday: '1990-01-01',
    email: 'a@example.com',
    fullname: 'Nguyễn Văn A',
    gender: 'Nam',
    phone: '0123456789'
  },
  {
    id: 2,
    created_at: '2024-06-03',
    created_by: 'staff',
    updated_at: '2024-06-04',
    updated_by: 'staff',
    active: false,
    avartar: '/avatars/2.jpg',
    birthday: '1992-02-02',
    email: 'b@example.com',
    fullname: 'Trần Thị B',
    gender: 'Nữ',
    phone: '0987654321'
  }
]

const cellStyle = {
  maxWidth: 150,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center' as const
}

const TooltipCell = ({ value }: { value: string | number }) => (
  <TableCell sx={cellStyle}>
    <Tooltip title={String(value)} arrow placement='bottom'>
      <span>{value}</span>
    </Tooltip>
  </TableCell>
)

const AvatarCell = ({ src, alt }: { src: string; alt: string }) => (
  <TableCell sx={{ textAlign: 'center' }}>
    <Tooltip title={alt} arrow placement='bottom'>
      <Avatar src={src} alt={alt} sx={{ width: 40, height: 40, margin: '0 auto' }} />
    </Tooltip>
  </TableCell>
)

const ActiveCell = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
  <TableCell sx={cellStyle}>
    <Tooltip title={active ? 'Hoạt động' : 'Không hoạt động'} arrow placement='bottom'>
      <Typography
        sx={{
          color: active ? 'green' : 'red',
          fontWeight: 'bold',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        onClick={onClick}
      >
        {active ? 'Hoạt động' : 'Không hoạt động'}
      </Typography>
    </Tooltip>
  </TableCell>
)

const ManageUserPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)

  const handleToggleActive = (id: number) => {
    setCustomers(prev =>
      prev.map(customer => (customer.id === id ? { ...customer, active: !customer.active } : customer))
    )
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant='h5' fontWeight='bold' mb={3}>
        Quản lý khách hàng
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
                'Trạng thái',
                'Avatar',
                'Ngày sinh',
                'Email',
                'Họ tên',
                'Giới tính',
                'Số điện thoại'
              ].map(header => (
                <TableCell key={header} sx={{ textAlign: 'center', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map(customer => (
              <TableRow key={customer.id}>
                <TooltipCell value={customer.id} />
                <TooltipCell value={customer.created_at} />
                <TooltipCell value={customer.created_by} />
                <TooltipCell value={customer.updated_at} />
                <TooltipCell value={customer.updated_by} />
                <ActiveCell active={customer.active} onClick={() => handleToggleActive(customer.id)} />
                <AvatarCell src={customer.avartar} alt={customer.fullname} />
                <TooltipCell value={customer.birthday} />
                <TooltipCell value={customer.email} />
                <TooltipCell value={customer.fullname} />
                <TooltipCell value={customer.gender} />
                <TooltipCell value={customer.phone} />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default ManageUserPage
