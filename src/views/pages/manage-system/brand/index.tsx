import React, { useState, ChangeEvent, useEffect } from 'react'
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
  Paper,
  IconButton,
  CircularProgress,
  Alert,
  InputAdornment,
  Snackbar
} from '@mui/material'
import { Edit, Delete, Add, CheckCircle, Error } from '@mui/icons-material'
import { useBrand } from 'src/hooks/useBrand'
import { TBrand } from 'src/types/brand'

const cellStyle = {
  maxWidth: '140px',
  whiteSpace: 'nowrap' as const,
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

const emptyBrand: TBrand = {
  id: '0',
  created_at: '',
  created_by: '',
  updated_at: '',
  updated_by: '',
  name: ''
}

const ManageBrandPage: React.FC = () => {
  const { fetchBrands, createNewBrand, updateExistingBrand, deleteExistingBrand } = useBrand()
  const [brands, setBrands] = useState<TBrand[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [form, setForm] = useState<TBrand>(emptyBrand)
  const [currentPage, setCurrentPage] = useState(1)
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [formError, setFormError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const itemsPerPage = 10 // Cố định 10 items mỗi trang

  // Load brands from API
  useEffect(() => {
    const loadBrands = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetchBrands()
        setBrands(response.data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch brands')
      } finally {
        setLoading(false)
      }
    }

    loadBrands()
  }, []) // Remove fetchBrands dependency to prevent infinite re-renders

  const handleOpenAdd = () => {
    const newId = brands && brands.length > 0 ? Math.max(...brands.map(b => Number(b.id))) + 1 : 1
    setForm({
      ...emptyBrand,
      id: String(newId),
      created_at: new Date().toISOString().slice(0, 10),
      created_by: 'admin'
    })
    setEditIndex(null)
    setOpen(true)
  }

  const handleOpenEdit = (index: number) => {
    if (brands && brands[index]) {
      setForm(brands[index])
      setEditIndex(index)
      setOpen(true)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setForm(emptyBrand)
    setEditIndex(null)
    setFormError('') // Clear form error when closing
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev: TBrand) => ({
      ...prev,
      [name]: value
    }))
    // Clear form error when user starts typing
    if (formError) {
      setFormError('')
    }
  }

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFormError('Vui lòng nhập tên thương hiệu')
      return
    }

    setSaving(true)
    setFormError('')

    try {
      if (editIndex !== null) {
        // Edit existing brand using API
        const response = await updateExistingBrand(form.id, { id: form.id, name: form.name })
        
        if (response.error) {
          throw response.error.message || 'Có lỗi xảy ra khi cập nhật thương hiệu'
        }

        // Reload brands from API after successful update
        const brandsResponse = await fetchBrands()
        if (brandsResponse.data) {
          setBrands(brandsResponse.data)
        }
        
        // Show success message for edit
        setSuccessMessage('Cập nhật thương hiệu thành công!')
        setShowSuccess(true)
        handleClose()
      } else {
        // Add new brand using API
        const response = await createNewBrand({ name: form.name })
        
        if (response.error) {
          throw response.error.message || 'Có lỗi xảy ra khi tạo thương hiệu'
        }

        // Reload brands from API after successful creation
        const brandsResponse = await fetchBrands()
        if (brandsResponse.data) {
          setBrands(brandsResponse.data)
        }
        
        // Show success message for create
        setSuccessMessage('Thêm thương hiệu thành công!')
        setShowSuccess(true)
        handleClose()
      }
    } catch (err: any) {
      // Don't close the form on error, just show the error message
      setFormError(err.message || 'Có lỗi xảy ra khi lưu thương hiệu')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (brandId: string, brandName: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brandName}"? Hành động này không thể hoàn tác.`)) {
      return
    }

    setDeleteLoading(brandId)

    try {
      const response = await deleteExistingBrand(brandId)
      
      if (response.error) {
        throw response.error.message || 'Có lỗi xảy ra khi xóa thương hiệu'
      }

      // Reload brands from API after successful deletion
      const brandsResponse = await fetchBrands()
      if (brandsResponse.data) {
        setBrands(brandsResponse.data)
      }
      
      // Show success message for delete
      setSuccessMessage('Xóa thương hiệu thành công!')
      setShowSuccess(true)
    } catch (err: any) {
      // Show error message
      setError(err.message || 'Có lỗi xảy ra khi xóa thương hiệu')
    } finally {
      setDeleteLoading(null)
    }
  }

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

  // Calculate pagination
  const totalPages = Math.ceil(brands.length / itemsPerPage)
  const paginatedBrands = brands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setSuccessMessage('')
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Quản lý Thương hiệu
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAdd}
          sx={{ backgroundColor: '#1976d2' }}
        >
          Thêm thương hiệu
        </Button>
      </Box>

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

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ boxShadow: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Tên thương hiệu</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ngày tạo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Người tạo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Ngày cập nhật</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Người cập nhật</TableCell>
                  <TableCell sx={{ fontWeight: 'bold', textAlign: 'center' }}>Thao tác</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBrands && paginatedBrands.length > 0 ? (
                  paginatedBrands.map((brand, index) => {
                    const actualIndex = (currentPage - 1) * itemsPerPage + index
                    return (
                      <TableRow key={brand.id} hover>
                        <TooltipCell value={brand.id} />
                        <TooltipCell value={brand.name} />
                        <TooltipCell value={formatDate(brand.created_at)} />
                        <TooltipCell value={brand.created_by} />
                        <TooltipCell value={formatDate(brand.updated_at)} />
                        <TooltipCell value={brand.updated_by} />
                        <TableCell sx={{ textAlign: 'center' }}>
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEdit(actualIndex)}
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(brand.id, brand.name)}
                            size="small"
                            disabled={deleteLoading === brand.id}
                          >
                            {deleteLoading === brand.id ? (
                              <CircularProgress size={16} color="error" />
                            ) : (
                              <Delete />
                            )}
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ textAlign: 'center', py: 3 }}>
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, brands.length)} trong tổng số {brands.length} thương hiệu
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

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editIndex !== null ? 'Chỉnh sửa thương hiệu' : 'Thêm thương hiệu mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Tên thương hiệu"
            type="text"
            fullWidth
            variant="outlined"
            value={form.name}
            onChange={handleChange}
            sx={{ mt: 2 }}
            error={!!formError}
            helperText={formError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Hủy
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary" disabled={saving}>
            {saving ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} color="inherit" />
                {editIndex !== null ? 'Đang cập nhật...' : 'Đang thêm...'}
              </Box>
            ) : (
              editIndex !== null ? 'Cập nhật' : 'Thêm'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={6000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ManageBrandPage 