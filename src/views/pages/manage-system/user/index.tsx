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

import { useAuth } from 'src/hooks/useAuth'
import { TUser } from 'src/types/auth'

// Kiểu dữ liệu TypeScript cho người dùng
interface NewUser {
  fullName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

// Kiểu dữ liệu cho validation errors
interface ValidationErrors {
  fullName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
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

const AvatarCell = ({ src, alt }: { src: string | null; alt: string }) => (
  <TableCell sx={{ textAlign: 'center' }}>
    <Tooltip title={alt} arrow placement='bottom'>
      <Avatar src={src || undefined} alt={alt} sx={{ width: 40, height: 40, margin: '0 auto' }}>
        {alt.charAt(0)}
      </Avatar>
    </Tooltip>
  </TableCell>
)

const ActiveCell = ({ active, onClick, loading }: { active: boolean; onClick: () => void; loading: boolean }) => (
  <TableCell sx={cellStyle}>
    <Tooltip title={active ? 'Hoạt động' : 'Click để kích hoạt'} arrow placement='bottom'>
      <Typography
        sx={{
          color: active ? 'green' : 'red',
          fontWeight: 'bold',
          cursor: active ? 'default' : 'pointer',
          userSelect: 'none',
          opacity: loading ? 0.6 : 1
        }}
        onClick={active ? undefined : onClick}
      >
        {active ? 'Hoạt động' : (loading ? 'Đang kích hoạt...' : 'Không hoạt động')}
      </Typography>
    </Tooltip>
  </TableCell>
)

const ManageUserPage: React.FC = () => {
  // State declarations
  const { fetchUsers, createNewUser, updateUserProfile, deleteUserProfile } = useAuth()
  const [users, setUsers] = useState<TUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [editUser, setEditUser] = useState<TUser | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Cố định 10 items mỗi trang

  // Debug validation errors
  useEffect(() => {
    console.log('Current validation errors:', validationErrors)
  }, [validationErrors])

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetchUsers()
        setUsers(response.data)
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, []) // Remove fetchUsers dependency to prevent infinite re-renders

  // Handlers
  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc muốn vô hiệu hóa người dùng này? (Người dùng sẽ không thể đăng nhập nhưng dữ liệu vẫn được giữ lại)')) {
      try {
        setLoading(true)
        setError('')
        
        // Call API to deactivate user (soft delete)
        await deleteUserProfile(id)
        
        // Reload users list after successful deactivation
        const response = await fetchUsers()
        setUsers(response.data)
        
        // Show success message (optional)
        console.log('User deactivated successfully')
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi vô hiệu hóa người dùng')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEdit = (user: TUser) => {
    setEditUser(user)
    setEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (editUser) {
      try {
        setLoading(true)
        setError('')
        
        // Prepare data for API
        const updateData: {
          fullname?: string
          phone?: string
          avatar?: string
          birthday?: string
          gender?: string
          active?: boolean
        } = {}
        
        // Only include fields that have been changed
        if (editUser.full_name !== users.find(u => u.id === editUser.id)?.full_name) {
          updateData.fullname = editUser.full_name || undefined
        }
        if (editUser.phone !== users.find(u => u.id === editUser.id)?.phone) {
          updateData.phone = editUser.phone || undefined
        }
        if (editUser.avatar !== users.find(u => u.id === editUser.id)?.avatar) {
          updateData.avatar = editUser.avatar || undefined
        }
        if (editUser.birthday !== users.find(u => u.id === editUser.id)?.birthday) {
          updateData.birthday = editUser.birthday || undefined
        }
        if (editUser.gender !== users.find(u => u.id === editUser.id)?.gender) {
          updateData.gender = editUser.gender || undefined
        }
        if (editUser.active !== users.find(u => u.id === editUser.id)?.active) {
          updateData.active = editUser.active
        }
        
        // Call API to update user
        await updateUserProfile(editUser.id, updateData)
        
        // Reload users list after successful update
        const response = await fetchUsers()
        setUsers(response.data)
        
        setEditModal(false)
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi cập nhật người dùng')
      } finally {
        setLoading(false)
      }
    }
  }

  // Validation functions
  const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) return 'Email là bắt buộc'
    if (!emailRegex.test(email)) return 'Email không đúng định dạng'
    return undefined
  }

  const validatePhone = (phone: string): string | undefined => {
    const phoneRegex = /^[0-9]{10,11}$/
    if (!phone) return 'Số điện thoại là bắt buộc'
    if (!phoneRegex.test(phone)) return 'Số điện thoại phải có 10-11 chữ số'
    return undefined
  }

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Mật khẩu là bắt buộc'
    if (password.length < 6) return 'Mật khẩu phải có ít nhất 6 ký tự'
    return undefined
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Xác nhận mật khẩu là bắt buộc'
    if (password !== confirmPassword) return 'Mật khẩu xác nhận không khớp'
    return undefined
  }

  const validateFullName = (fullName: string): string | undefined => {
    if (!fullName.trim()) return 'Họ tên là bắt buộc'
    if (fullName.trim().length < 6) return 'Họ tên phải có ít nhất 6 ký tự'
    return undefined
  }

  const validateField = (field: keyof NewUser, value: string) => {
    let error: string | undefined

    switch (field) {
      case 'fullName':
        error = validateFullName(value)
        break
      case 'email':
        error = validateEmail(value)
        break
      case 'phone':
        error = validatePhone(value)
        break
      case 'password':
        error = validatePassword(value)
        break
      case 'confirmPassword':
        error = validateConfirmPassword(newUser.password, value)
        break
    }

    console.log(`Validating ${field}: "${value}" -> error: "${error}"`)

    setValidationErrors(prev => {
      const newErrors = {
        ...prev,
        [field]: error
      }
      console.log('New validation errors:', newErrors)
      return newErrors
    })

    return !error
  }

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {}
    
    errors.fullName = validateFullName(newUser.fullName)
    errors.email = validateEmail(newUser.email)
    errors.phone = validatePhone(newUser.phone)
    errors.password = validatePassword(newUser.password)
    errors.confirmPassword = validateConfirmPassword(newUser.password, newUser.confirmPassword)

    setValidationErrors(errors)
    
    return !Object.values(errors).some(error => error)
  }

  // Helper function to map API field names to form field names
  const mapApiFieldToFormField = (apiField: string): keyof ValidationErrors | null => {
    const fieldMapping: { [key: string]: keyof ValidationErrors } = {
      'fullName': 'fullName',
      'full_name': 'fullName',
      'email': 'email',
      'phone': 'phone',
      'password': 'password',
      'confirmPassword': 'confirmPassword',
      'confirm_password': 'confirmPassword'
    }
    
    return fieldMapping[apiField] || null
  }

  const handleAdd = () => {
    setNewUser({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
    setValidationErrors({})
    setAddModal(true)
    // Force re-render after modal opens
    setTimeout(() => {
      console.log('Modal opened, validation errors reset')
    }, 100)
  }

  const handleSaveAdd = async () => {
    // Validate form before submitting
    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)
      setError('')
      setValidationErrors({}) // Clear previous validation errors
      await createNewUser(newUser)
      // Reload users list after successful creation
      const response = await fetchUsers()
      setUsers(response.data)
      setAddModal(false)
      setNewUser({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' })
      setValidationErrors({})
    } catch (err: any) {
      // Handle API validation errors
      if (err.response?.data?.errors) {
        const apiErrors: ValidationErrors = {}
        
        // Parse API error messages and map to form fields
        Object.keys(err.response.data.errors).forEach(apiField => {
          const errorMessage = err.response.data.errors[apiField]
          const formField = mapApiFieldToFormField(apiField)
          
          if (formField) {
            if (Array.isArray(errorMessage)) {
              // If error is an array, take the first message
              apiErrors[formField] = errorMessage[0]
            } else {
              // If error is a string
              apiErrors[formField] = errorMessage
            }
          }
        })
        
        setValidationErrors(apiErrors)
      } else {
        // Handle general errors
        setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo người dùng')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (id: string) => {
    // Chỉ cho phép kích hoạt người dùng (từ không hoạt động thành hoạt động)
    const user = users.find(u => u.id === id)
    if (!user || user.active) {
      return // Nếu user đã hoạt động thì không làm gì
    }

    if (window.confirm('Bạn có chắc muốn kích hoạt người dùng này?')) {
      try {
        setLoading(true)
        setError('')
        
        // Call API to activate user
        await updateUserProfile(id, { active: true })
        
        // Reload users list after successful activation
        const response = await fetchUsers()
        setUsers(response.data)
        
        // Show success message (optional)
        console.log('User activated successfully')
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Có lỗi xảy ra khi kích hoạt người dùng')
      } finally {
        setLoading(false)
      }
    }
  }

  // Filtering and pagination
  const roles = Array.from(new Set(users.map(u => u.role.name).filter(Boolean)))
  const filteredUsers = users.filter(user => {
    const matchName = user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchEmail = user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchRole = filterRole ? user.role.name === filterRole : true

    return (matchName || matchEmail) && matchRole
  })
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
        Quản lý người dùng
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

      <Box sx={{ display: 'flex', mb: 3, gap: 2, alignItems: 'flex-end' }}>
        <Button variant='contained' color='primary' onClick={handleAdd}>
          Thêm người dùng
        </Button>
        <Box>
          <TextField
            size='small'
            sx={{ width: 180, minWidth: 120 }}
            placeholder='Tìm kiếm theo tên hoặc email'
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </Box>
        <Box>
          <FormControl size='small' sx={{ width: 140, minWidth: 100 }}>
            <InputLabel>Vai trò</InputLabel>
            <Select
              value={filterRole}
              onChange={(e: SelectChangeEvent) => {
                setFilterRole(e.target.value)
                setCurrentPage(1)
              }}
              label='Vai trò'
            >
              <MenuItem value=''>Tất cả</MenuItem>
              {roles.map(role => (
                <MenuItem key={role} value={role}>
                  {role}
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
                    'Trạng thái',
                    'Avatar',
                    'Ngày sinh',
                    'Email',
                    'Họ tên',
                    'Giới tính',
                    'Số điện thoại',
                    'Vai trò',
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
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell sx={{ textAlign: 'center' }}>{user.id}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(user.created_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={user.created_by || 'N/A'}>
                          <span style={ellipsisStyle}>{user.created_by || 'N/A'}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(user.updated_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={user.updated_by || 'N/A'}>
                          <span style={ellipsisStyle}>{user.updated_by || 'N/A'}</span>
                        </Tooltip>
                      </TableCell>
                                              <ActiveCell active={user.active} onClick={() => handleToggleActive(user.id)} loading={loading} />
                      <AvatarCell src={user.avatar} alt={user.full_name} />
                      <TableCell sx={{ textAlign: 'center' }}>
                        {user.birthday ? formatDate(user.birthday) : 'N/A'}
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={user.email}>
                          <span style={ellipsisStyle}>{user.email}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={user.full_name}>
                          <span style={ellipsisStyle}>{user.full_name}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{user.gender || 'N/A'}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={user.phone}>
                          <span style={ellipsisStyle}>{user.phone}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Chip 
                          label={user.role.name} 
                          color={user.role.code === 'ADMIN' ? 'primary' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button variant='outlined' color='warning' size='small' onClick={() => handleEdit(user)}>
                            Sửa
                          </Button>
                                                     <Button
                             variant='outlined'
                             color='error'
                             size='small'
                             onClick={() => handleDelete(user.id)}
                             disabled={loading}
                           >
                             {loading ? 'Đang vô hiệu...' : 'Vô hiệu'}
                           </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={14} sx={{ textAlign: 'center' }}>
                      Không có người dùng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

                     {totalPages > 1 && (
             <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
               <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                 Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)} trong tổng số {filteredUsers.length} người dùng
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

      {/* Edit User Dialog */}
      <Dialog open={editModal} onClose={() => setEditModal(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Sửa thông tin người dùng</DialogTitle>
        <DialogContent>
          {editUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label='Họ tên'
                value={editUser.full_name || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, full_name: e.target.value })
                }
                fullWidth
                placeholder='Nhập họ tên mới'
              />
              <TextField
                label='Số điện thoại'
                value={editUser.phone || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, phone: e.target.value })
                }
                fullWidth
                placeholder='Nhập số điện thoại mới'
              />
              <TextField
                label='Avatar URL'
                value={editUser.avatar || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, avatar: e.target.value })
                }
                fullWidth
                placeholder='https://example.com/avatar.jpg'
              />
              <TextField
                label='Ngày sinh'
                type='date'
                value={editUser.birthday ? editUser.birthday.split('T')[0] : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const date = e.target.value
                  const isoDate = date ? new Date(date).toISOString() : ''
                  setEditUser({ ...editUser, birthday: isoDate })
                }}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={(() => {
                    // Map API gender format to Vietnamese display
                    if (editUser.gender === 'MALE') return 'Nam'
                    if (editUser.gender === 'FEMALE') return 'Nữ'
                    if (editUser.gender === 'OTHER') return 'Khác'
                    return ''
                  })()}
                  onChange={(e: SelectChangeEvent) => {
                    const gender = e.target.value
                    // Map Vietnamese gender to API format
                    const apiGender = gender === 'Nam' ? 'MALE' : gender === 'Nữ' ? 'FEMALE' : 'OTHER'
                    setEditUser({ ...editUser, gender: apiGender })
                  }}
                  label='Giới tính'
                >
                  <MenuItem value='Nam'>Nam</MenuItem>
                  <MenuItem value='Nữ'>Nữ</MenuItem>
                  <MenuItem value='Khác'>Khác</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModal(false)}>Huỷ</Button>
          <Button 
            onClick={handleSaveEdit} 
            variant='contained' 
            color='primary'
            disabled={loading}
          >
            {loading ? 'Đang cập nhật...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={addModal} onClose={() => setAddModal(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Thêm người dùng mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label='Họ tên'
              value={newUser.fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setNewUser({ ...newUser, fullName: value })
                // Trigger validation immediately
                setTimeout(() => validateField('fullName', value), 0)
              }}
              onBlur={(e) => validateField('fullName', e.target.value)}
              fullWidth
              required
              error={!!validationErrors.fullName}
              helperText={validationErrors.fullName || ' '}
              sx={{
                '& .MuiFormHelperText-root': {
                  color: validationErrors.fullName ? 'error.main' : 'text.secondary'
                }
              }}
            />
            <TextField
              label='Email'
              type='email'
              value={newUser.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setNewUser({ ...newUser, email: value })
                validateField('email', value)
              }}
              onBlur={(e) => validateField('email', e.target.value)}
              fullWidth
              required
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <TextField
              label='Số điện thoại'
              value={newUser.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setNewUser({ ...newUser, phone: value })
                validateField('phone', value)
              }}
              onBlur={(e) => validateField('phone', e.target.value)}
              fullWidth
              required
              error={!!validationErrors.phone}
              helperText={validationErrors.phone}
            />
            <TextField
              label='Mật khẩu'
              type='password'
              value={newUser.password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setNewUser({ ...newUser, password: value })
                validateField('password', value)
                // Re-validate confirm password when password changes
                if (newUser.confirmPassword) {
                  validateField('confirmPassword', newUser.confirmPassword)
                }
              }}
              onBlur={(e) => validateField('password', e.target.value)}
              fullWidth
              required
              error={!!validationErrors.password}
              helperText={validationErrors.password}
            />
            <TextField
              label='Xác nhận mật khẩu'
              type='password'
              value={newUser.confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value
                setNewUser({ ...newUser, confirmPassword: value })
                validateField('confirmPassword', value)
              }}
              onBlur={(e) => validateField('confirmPassword', e.target.value)}
              fullWidth
              required
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModal(false)}>Huỷ</Button>
          <Button 
            onClick={handleSaveAdd} 
            variant='contained' 
            color='primary'
            disabled={loading || Object.keys(validationErrors).some(key => validationErrors[key as keyof ValidationErrors])}
          >
            {loading ? 'Đang tạo...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageUserPage
