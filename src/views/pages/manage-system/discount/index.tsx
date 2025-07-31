import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import React, { useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { NextPage } from 'next'

type TProps = {}

interface Promotion {
  id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  valid_from: string
  valid_until: string
  minimum_order_value: number
  max_discount_amount: number
  discount_type: 'percent' | 'amount'
  discount_value: number
  promotion_code: string
  name: string
  description: string
}

const cellStyle: React.CSSProperties = {
  minWidth: 120,
  padding: '12px 20px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  position: 'relative',
  cursor: 'pointer',
  textAlign: 'center'
}

const thStyle: React.CSSProperties = {
  textAlign: 'center',
  fontWeight: 'bold',
  padding: '14px 22px',
  minWidth: 130
}

const TooltipCell: React.FC<{ value: string | number }> = ({ value }) => (
  <TableCell style={cellStyle}>
    <Tooltip title={String(value)} arrow placement='bottom'>
      <span
        style={{
          display: 'inline-block',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {value}
      </span>
    </Tooltip>
  </TableCell>
)

const initialPromotions: Promotion[] = [
  {
    id: 1,
    created_at: '2024-06-01',
    created_by: 'admin',
    updated_at: '2024-06-02',
    updated_by: 'admin',
    valid_from: '2024-06-01',
    valid_until: '2024-06-30',
    minimum_order_value: 500000,
    max_discount_amount: 100000,
    discount_type: 'percent',
    discount_value: 20,
    promotion_code: 'SUMMER20',
    name: 'Giảm giá mùa hè',
    description: 'Giảm 20% cho tất cả sản phẩm trong tháng 6'
  },
  {
    id: 2,
    created_at: '2024-07-01',
    created_by: 'staff',
    updated_at: '2024-07-02',
    updated_by: 'staff',
    valid_from: '2024-07-01',
    valid_until: '2024-07-15',
    minimum_order_value: 300000,
    max_discount_amount: 50000,
    discount_type: 'amount',
    discount_value: 50000,
    promotion_code: 'BOGO2024',
    name: 'Mua 1 tặng 1',
    description: 'Áp dụng cho sản phẩm A, B, C'
  }
]

const emptyPromotion: Promotion = {
  id: 0,
  promotion_code: '',
  created_at: '',
  created_by: '',
  updated_at: '',
  updated_by: '',
  valid_from: '',
  valid_until: '',
  minimum_order_value: 0,
  max_discount_amount: 0,
  discount_type: 'percent',
  discount_value: 0,
  name: '',
  description: ''
}

const ManageDiscountPage: NextPage<TProps> = () => {
  const [promotions] = useState<Promotion[]>(initialPromotions)
  const [open, setOpen] = useState<boolean>(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form, setForm] = useState<Promotion>(emptyPromotion)

  const handleOpenAdd = () => {
    setForm(emptyPromotion)
    setEditIndex(null)
    setOpen(true)
  }

  const handleOpenEdit = (promotion: Promotion, idx: number) => {
    setForm(promotion)
    setEditIndex(idx)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  return (
    // <div className='container mx-auto p-4'>
    //   <h2 className='text-2xl font-bold mb-4'>Quản lý khuyến mãi</h2>
    //   <Button variant='contained' color='primary' onClick={handleOpenAdd} className='mb-4'>
    //     Thêm khuyến mãi
    //   </Button>
    //   <div className='overflow-x-auto'>
    //     <Table className='min-w-full border'>
    //       <TableHead>
    //         <TableRow>
    //           <TableCell style={{ ...thStyle, minWidth: 60 }}>ID</TableCell>
    //           <TableCell style={thStyle}>Mã khuyến mãi</TableCell>
    //           <TableCell style={thStyle}>Ngày tạo</TableCell>
    //           <TableCell style={thStyle}>Người tạo</TableCell>
    //           <TableCell style={thStyle}>Ngày cập nhật</TableCell>
    //           <TableCell style={thStyle}>Người cập nhật</TableCell>
    //           <TableCell style={thStyle}>Hiệu lực từ</TableCell>
    //           <TableCell style={thStyle}>Hiệu lực đến</TableCell>
    //           <TableCell style={{ ...thStyle, minWidth: 150 }}>Giá trị giảm tối thiểu</TableCell>
    //           <TableCell style={{ ...thStyle, minWidth: 150 }}>Giá trị giảm tối đa</TableCell>
    //           <TableCell style={thStyle}>Loại giảm</TableCell>
    //           <TableCell style={{ ...thStyle, minWidth: 120 }}>Giá trị giảm</TableCell>
    //           <TableCell style={{ ...thStyle, minWidth: 180 }}>Tên khuyến mãi</TableCell>
    //           <TableCell style={{ ...thStyle, minWidth: 220 }}>Mô tả</TableCell>
    //           <TableCell style={{ ...thStyle, minWidth: 120 }}>Hành động</TableCell>
    //         </TableRow>
    //       </TableHead>
    //       <TableBody>
    //         {promotions.map((promotion, idx) => (
    //           <TableRow key={promotion.id}>
    //             <TooltipCell value={promotion.id} />
    //             <TooltipCell value={promotion.promotion_code} />
    //             <TooltipCell value={promotion.created_at} />
    //             <TooltipCell value={promotion.created_by} />
    //             <TooltipCell value={promotion.updated_at} />
    //             <TooltipCell value={promotion.updated_by} />
    //             <TooltipCell value={promotion.valid_from} />
    //             <TooltipCell value={promotion.valid_until} />
    //             <TooltipCell value={promotion.minimum_order_value.toLocaleString('vi-VN')} />
    //             <TooltipCell value={promotion.max_discount_amount.toLocaleString('vi-VN')} />
    //             <TooltipCell value={promotion.discount_type === 'percent' ? 'Phần trăm' : 'Số tiền'} />
    //             <TooltipCell
    //               value={
    //                 promotion.discount_type === 'percent'
    //                   ? `${promotion.discount_value}%`
    //                   : `${promotion.discount_value.toLocaleString('vi-VN')}₫`
    //               }
    //             />
    //             <TooltipCell value={promotion.name} />
    //             <TooltipCell value={promotion.description} />
    //             <TableCell style={{ textAlign: 'center' }}>
    //               <IconButton color='primary' onClick={() => handleOpenEdit(promotion, idx)}>
    //                 <EditIcon />
    //               </IconButton>
    //               <IconButton color='error'>
    //                 <DeleteIcon />
    //               </IconButton>
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </div>
    //   <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
    //     <DialogTitle>{editIndex === null ? 'Thêm khuyến mãi' : 'Sửa khuyến mãi'}</DialogTitle>
    //     <DialogContent>
    //       <div className='flex flex-wrap gap-4'>
    //         {Object.keys(emptyPromotion)
    //           .filter(k => k !== 'id')
    //           .map(key => (
    //             <TextField
    //               key={key}
    //               margin='dense'
    //               label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
    //               name={key}
    //               value={form[key as keyof Promotion]}
    //               onChange={handleChange}
    //               fullWidth
    //               type={
    //                 ['minimum_order_value', 'max_discount_amount', 'discount_value'].includes(key) ? 'number' : 'text'
    //               }
    //             />
    //           ))}
    //       </div>
    //     </DialogContent>
    //     <DialogActions>
    //       <Button onClick={handleClose}>Hủy</Button>
    //       <Button variant='contained' color='primary'>
    //         Lưu
    //       </Button>
    //     </DialogActions>
    //   </Dialog>
    // </div>
    <Paper elevation={3} sx={{ p: 4, m: 'auto', maxWidth: '100%' }}>
      <Typography variant='h5' component='h2' sx={{ fontWeight: 'bold', mb: 4 }}>
        Quản lý khuyến mãi
      </Typography>
      <Button variant='contained' color='primary' onClick={handleOpenAdd} sx={{ mb: 4 }}>
        Thêm khuyến mãi
      </Button>
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ ...thStyle, minWidth: 60 }}>ID</TableCell>
              <TableCell style={thStyle}>Mã khuyến mãi</TableCell>
              <TableCell style={thStyle}>Ngày tạo</TableCell>
              <TableCell style={thStyle}>Người tạo</TableCell>
              <TableCell style={thStyle}>Ngày cập nhật</TableCell>
              <TableCell style={thStyle}>Người cập nhật</TableCell>
              <TableCell style={thStyle}>Hiệu lực từ</TableCell>
              <TableCell style={thStyle}>Hiệu lực đến</TableCell>
              <TableCell style={{ ...thStyle, minWidth: 150 }}>Giá trị giảm tối thiểu</TableCell>
              <TableCell style={{ ...thStyle, minWidth: 150 }}>Giá trị giảm tối đa</TableCell>
              <TableCell style={thStyle}>Loại giảm</TableCell>
              <TableCell style={{ ...thStyle, minWidth: 120 }}>Giá trị giảm</TableCell>
              <TableCell style={{ ...thStyle, minWidth: 180 }}>Tên khuyến mãi</TableCell>
              <TableCell style={{ ...thStyle, minWidth: 220 }}>Mô tả</TableCell>
              <TableCell style={{ ...thStyle, minWidth: 120 }}>Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {promotions.map((promotion, idx) => (
              <TableRow key={promotion.id}>
                <TooltipCell value={promotion.id} />
                <TooltipCell value={promotion.promotion_code} />
                <TooltipCell value={promotion.created_at} />
                <TooltipCell value={promotion.created_by} />
                <TooltipCell value={promotion.updated_at} />
                <TooltipCell value={promotion.updated_by} />
                <TooltipCell value={promotion.valid_from} />
                <TooltipCell value={promotion.valid_until} />
                <TooltipCell value={promotion.minimum_order_value.toLocaleString('vi-VN')} />
                <TooltipCell value={promotion.max_discount_amount.toLocaleString('vi-VN')} />
                <TooltipCell value={promotion.discount_type === 'percent' ? 'Phần trăm' : 'Số tiền'} />
                <TooltipCell
                  value={
                    promotion.discount_type === 'percent'
                      ? `${promotion.discount_value}%`
                      : `${promotion.discount_value.toLocaleString('vi-VN')}₫`
                  }
                />
                <TooltipCell value={promotion.name} />
                <TooltipCell value={promotion.description} />
                <TableCell style={{ textAlign: 'center' }}>
                  <IconButton color='primary' onClick={() => handleOpenEdit(promotion, idx)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color='error'>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth='md' fullWidth>
        <DialogTitle>{editIndex === null ? 'Thêm khuyến mãi' : 'Sửa khuyến mãi'}</DialogTitle>
        <DialogContent>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {Object.keys(emptyPromotion)
              .filter(k => k !== 'id')
              .map(key => (
                <TextField
                  key={key}
                  margin='dense'
                  label={key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  name={key}
                  value={form[key as keyof Promotion]}
                  onChange={handleChange}
                  fullWidth
                  type={
                    ['minimum_order_value', 'max_discount_amount', 'discount_value'].includes(key) ? 'number' : 'text'
                  }
                />
              ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button variant='contained' color='primary'>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default ManageDiscountPage
