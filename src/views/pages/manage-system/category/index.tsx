import React, { useState, ChangeEvent } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  Paper
} from '@mui/material'

interface Category {
  id: number | string
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  code: string
  name: string
}

const initialCategories: Category[] = [
  {
    id: 1,
    created_at: '2024-06-01',
    created_by: 'admin',
    updated_at: '2024-06-02',
    updated_by: 'admin',
    code: 'SHIRT',
    name: 'Áo'
  },
  {
    id: 2,
    created_at: '2024-06-03',
    created_by: 'staff',
    updated_at: '2024-06-04',
    updated_by: 'staff',
    code: 'PANTS',
    name: 'Quần'
  }
]

const cellStyle = {
  maxWidth: '140px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  textAlign: 'center' as const,
  cursor: 'pointer'
}

const TooltipCell = ({ value }: { value: string | number }) => (
  <TableCell sx={cellStyle}>
    <Tooltip title={String(value)} arrow placement='bottom'>
      <span>{value}</span>
    </Tooltip>
  </TableCell>
)

const emptyCategory: Category = {
  id: '',
  created_at: '',
  created_by: '',
  updated_at: '',
  updated_by: '',
  code: '',
  name: ''
}

const ManageCategoryPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [open, setOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form, setForm] = useState<Category>(emptyCategory)

  const handleOpenAdd = () => {
    const newId = categories.length ? Math.max(...categories.map(c => Number(c.id))) + 1 : 1
    setForm({
      ...emptyCategory,
      id: newId,
      created_at: new Date().toISOString().slice(0, 10),
      created_by: 'admin'
    })
    setEditIndex(null)
    setOpen(true)
  }

  const handleOpenEdit = (index: number) => {
    setForm(categories[index])
    setEditIndex(index)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setForm(emptyCategory)
    setEditIndex(null)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    if (editIndex === null) {
      setCategories([...categories, { ...form, updated_at: '', updated_by: '' }])
    } else {
      const updated = [...categories]
      updated[editIndex] = {
        ...form,
        updated_at: new Date().toISOString().slice(0, 10),
        updated_by: 'admin'
      }
      setCategories(updated)
    }
    handleClose()
  }

  const handleDelete = (index: number) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      setCategories(categories.filter((_, i) => i !== index))
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant='h5' fontWeight='bold' gutterBottom>
        Quản lý danh mục
      </Typography>
      <Button variant='contained' color='primary' onClick={handleOpenAdd} sx={{ mb: 2 }}>
        Thêm danh mục
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {[
                'ID',
                'Ngày tạo',
                'Người tạo',
                'Ngày cập nhật',
                'Người cập nhật',
                'Mã danh mục',
                'Tên danh mục',
                'Hành động'
              ].map(header => (
                <TableCell key={header} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category, idx) => (
              <TableRow key={category.id}>
                <TooltipCell value={category.id} />
                <TooltipCell value={category.created_at} />
                <TooltipCell value={category.created_by} />
                <TooltipCell value={category.updated_at} />
                <TooltipCell value={category.updated_by} />
                <TooltipCell value={category.code} />
                <TooltipCell value={category.name} />
                <TableCell sx={{ textAlign: 'center' }}>
                  <Button
                    size='small'
                    variant='outlined'
                    color='primary'
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenEdit(idx)}
                  >
                    Sửa
                  </Button>
                  <Button size='small' variant='outlined' color='error' onClick={() => handleDelete(idx)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIndex === null ? 'Thêm danh mục' : 'Sửa danh mục'}</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            label='Mã danh mục'
            name='code'
            value={form.code}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin='dense'
            label='Tên danh mục'
            name='name'
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSave} variant='contained' color='primary'>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageCategoryPage
