import React, { useState, useEffect } from 'react'
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
  Chip,
  Alert,
  InputAdornment
} from '@mui/material'

import { useCategory } from 'src/hooks/useCategory'
import { TCategory } from 'src/types/category'

// Kiểu dữ liệu TypeScript cho phân loại mới
interface NewCategory {
  code: string
  name: string
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

const TooltipCell = ({ value }: { value: string | number }) => (
  <TableCell sx={cellStyle}>
    <Tooltip title={String(value)} arrow placement='bottom'>
      <span>{value}</span>
    </Tooltip>
  </TableCell>
)

const ManageCategoryPage: React.FC = () => {
  // State declarations
  const { fetchCategories, categories, loading, error, updateCategories, createCategory, updateCategory, deleteCategory } = useCategory()
  const [editModal, setEditModal] = useState(false)
  const [editCategory, setEditCategory] = useState<TCategory | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [newCategory, setNewCategory] = useState<NewCategory>({
    code: '',
    name: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Cố định 10 items mỗi trang

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        await fetchCategories()
      } catch (err: any) {
        console.error('Error loading categories:', err)
      }
    }

    loadCategories()
  }, [fetchCategories])

  // Handlers
  const handleDelete = async (id: number) => {
    // Hiển thị confirm dialog với thông tin chi tiết hơn
    const categoryToDelete = categories.find(c => c.id === id)
    const confirmMessage = categoryToDelete 
      ? `Bạn có chắc chắn muốn xóa phân loại "${categoryToDelete.name}" (${categoryToDelete.code})?\n\n⚠️ Lưu ý: Đây là thao tác xóa vĩnh viễn và không thể khôi phục!`
      : 'Bạn có chắc chắn muốn xóa phân loại này?\n\n⚠️ Lưu ý: Đây là thao tác xóa vĩnh viễn và không thể khôi phục!'
    
    if (window.confirm(confirmMessage)) {
      try {
        console.log('Deleting category with ID:', id)
        
        // Call API to delete category
        await deleteCategory(id)
        
        // Show success message
        alert('Xóa phân loại thành công!')
        
      } catch (err: any) {
        console.error('Error deleting category:', err)
        alert(err.message || 'Có lỗi xảy ra khi xóa phân loại')
      }
    }
  }

  const handleEdit = (category: TCategory) => {
    setEditCategory(category)
    setEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!editCategory) return

    try {
      // Validate input
      if (!editCategory.code.trim() || !editCategory.name.trim()) {
        alert('Vui lòng nhập đầy đủ mã và tên phân loại')
        return
      }

      // Prepare update data (only changed fields)
      const updateData: { code?: string; name?: string } = {}
      
      // Find original category to compare
      const originalCategory = categories.find(c => c.id === editCategory.id)
      if (originalCategory) {
        if (editCategory.code.trim() !== originalCategory.code) {
          updateData.code = editCategory.code.trim()
        }
        if (editCategory.name.trim() !== originalCategory.name) {
          updateData.name = editCategory.name.trim()
        }
      }

      // If no changes, just close modal
      if (Object.keys(updateData).length === 0) {
        setEditModal(false)
        return
      }

      console.log('Updating category with data:', updateData)

      // Call API to update category
      await updateCategory(editCategory.id, updateData)

      // Close modal
      setEditModal(false)
      
      // Show success message
      alert('Cập nhật phân loại thành công!')
      
    } catch (err: any) {
      console.error('Error updating category:', err)
      alert(err.message || 'Có lỗi xảy ra khi cập nhật phân loại')
    }
  }

  const handleAdd = () => {
    setNewCategory({ code: '', name: '' })
    setAddModal(true)
  }

  const handleSaveAdd = async () => {
    try {
      // Validate input
      if (!newCategory.code.trim() || !newCategory.name.trim()) {
        alert('Vui lòng nhập đầy đủ mã và tên phân loại')
        return
      }

      // Call API to create category
      await createCategory({
        code: newCategory.code.trim(),
        name: newCategory.name.trim()
      })

      // Close modal and reset form
      setAddModal(false)
      setNewCategory({ code: '', name: '' })
      
      // Show success message
      alert('Tạo phân loại thành công!')
      
    } catch (err: any) {
      console.error('Error creating category:', err)
      alert(err.message || 'Có lỗi xảy ra khi tạo phân loại')
    }
  }

  // Filtering and pagination
  const filteredCategories = categories.filter(category => {
    const matchCode = category.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchName = category.name.toLowerCase().includes(searchTerm.toLowerCase())

    return matchCode || matchName
  })
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleManualPageInput = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const input = event.target as HTMLInputElement
      const pageNumber = parseInt(input.value)
      
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber)
        input.value = '' // Clear input after successful navigation
      } else {
        // Reset to current page if invalid input
        input.value = currentPage.toString()
      }
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box'
      }}
    >
      <Typography variant='h5' fontWeight='bold' mb={3}>
        Quản lý phân loại
      </Typography>

      {error && error !== null && (
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
            {error || 'Có lỗi xảy ra'}
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', mb: 3, gap: 2, alignItems: 'flex-end' }}>
        <Button variant='contained' color='primary' onClick={handleAdd}>
          Thêm phân loại
        </Button>
        <Box>
          <TextField
            size='small'
            sx={{ width: 180, minWidth: 120 }}
            placeholder='Tìm kiếm theo mã hoặc tên'
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
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
                    'Mã phân loại',
                    'Tên phân loại',
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
                {paginatedCategories.length > 0 ? (
                  paginatedCategories.map(category => (
                    <TableRow key={category.id}>
                      <TableCell sx={{ textAlign: 'center' }}>{category.id}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(category.created_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={category.created_by || 'N/A'}>
                          <span style={ellipsisStyle}>{category.created_by || 'N/A'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(category.updated_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={category.updated_by || 'N/A'}>
                          <span style={ellipsisStyle}>{category.updated_by || 'N/A'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip 
                          label={category.code} 
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={category.name}>
                          <span style={ellipsisStyle}>{category.name}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button variant='outlined' color='warning' size='small' onClick={() => handleEdit(category)}>
                            Sửa
                          </Button>
                          <Button
                            variant='outlined'
                            color='error'
                            size='small'
                            onClick={() => handleDelete(category.id)}
                          >
                            Xoá
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} sx={{ textAlign: 'center' }}>
                      Không có phân loại nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredCategories.length)} trong tổng số {filteredCategories.length} phân loại
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trước
                </Button>
                
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "contained" : "outlined"}
                    onClick={() => handlePageChange(pageNum)}
                    sx={{ minWidth: 40 }}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  variant="outlined"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Sau
                </Button>
              </Box>
              
              {/* Manual page input */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                  Chuyển đến trang:
                </Typography>
                <TextField
                  size="small"
                  sx={{ width: 80 }}
                  placeholder={currentPage.toString()}
                  onKeyDown={handleManualPageInput}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">/ {totalPages}</InputAdornment>,
                  }}
                />
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Edit Category Dialog */}
      <Dialog open={editModal} onClose={() => setEditModal(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Sửa thông tin phân loại</DialogTitle>
        <DialogContent>
          {editCategory && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label='Mã phân loại'
                value={editCategory.code}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditCategory({ ...editCategory, code: e.target.value })
                }
                fullWidth
              />
              <TextField
                label='Tên phân loại'
                value={editCategory.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditCategory({ ...editCategory, name: e.target.value })
                }
                fullWidth
              />
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

      {/* Add Category Dialog */}
      <Dialog open={addModal} onClose={() => setAddModal(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Thêm phân loại mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label='Mã phân loại'
              value={newCategory.code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewCategory({ ...newCategory, code: e.target.value })
              }
              fullWidth
            />
            <TextField
              label='Tên phân loại'
              value={newCategory.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModal(false)}>Huỷ</Button>
          <Button onClick={handleSaveAdd} variant='contained' color='primary'>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageCategoryPage
