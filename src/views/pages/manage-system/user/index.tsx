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
  full_name: string
  email: string
  phone: string
  birthday: string
  gender: string
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
  // State declarations
  const { fetchUsers } = useAuth()
  const [users, setUsers] = useState<TUser[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [editUser, setEditUser] = useState<TUser | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [newUser, setNewUser] = useState<NewUser>({
    full_name: '',
    email: '',
    phone: '',
    birthday: '',
    gender: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Cố định 10 items mỗi trang

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
  const handleDelete = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xoá người dùng này?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  const handleEdit = (user: TUser) => {
    setEditUser(user)
    setEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editUser) {
      setUsers(
        users.map(u =>
          u.id === editUser.id ? { ...editUser, updated_at: new Date().toISOString(), updated_by: 'admin' } : u
        )
      )
      setEditModal(false)
    }
  }

  const handleAdd = () => {
    setNewUser({ full_name: '', email: '', phone: '', birthday: '', gender: '' })
    setAddModal(true)
  }

  const handleSaveAdd = () => {
    // Note: This is just for demo. In real app, you would call API to create user
    const userToAdd: TUser = {
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      created_by: 'admin',
      updated_at: new Date().toISOString(),
      updated_by: 'admin',
      active: true,
      avatar: null,
      birthday: newUser.birthday,
      email: newUser.email,
      full_name: newUser.full_name,
      gender: newUser.gender,
      phone: newUser.phone,
      role: {
        id: '2',
        code: 'USER',
        name: 'User'
      }
    }
    setUsers([...users, userToAdd])
    setAddModal(false)
  }

  const handleToggleActive = (id: string) => {
    setUsers(prev =>
      prev.map(user => (user.id === id ? { ...user, active: !user.active } : user))
    )
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
                      <ActiveCell active={user.active} onClick={() => handleToggleActive(user.id)} />
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
                          >
                            Xoá
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
                value={editUser.full_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, full_name: e.target.value })
                }
                fullWidth
              />
              <TextField
                label='Email'
                type='email'
                value={editUser.email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
                fullWidth
              />
              <TextField
                label='Số điện thoại'
                value={editUser.phone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, phone: e.target.value })
                }
                fullWidth
              />
              <TextField
                label='Ngày sinh'
                type='date'
                value={editUser.birthday || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditUser({ ...editUser, birthday: e.target.value })
                }
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  value={editUser.gender || ''}
                  onChange={(e: SelectChangeEvent) =>
                    setEditUser({ ...editUser, gender: e.target.value })
                  }
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
          <Button onClick={handleSaveEdit} variant='contained' color='primary'>
            Lưu
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
              value={newUser.full_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, full_name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label='Email'
              type='email'
              value={newUser.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              fullWidth
            />
            <TextField
              label='Số điện thoại'
              value={newUser.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, phone: e.target.value })
              }
              fullWidth
            />
            <TextField
              label='Ngày sinh'
              type='date'
              value={newUser.birthday}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewUser({ ...newUser, birthday: e.target.value })
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Giới tính</InputLabel>
              <Select
                value={newUser.gender}
                onChange={(e: SelectChangeEvent) =>
                  setNewUser({ ...newUser, gender: e.target.value })
                }
                label='Giới tính'
              >
                <MenuItem value='Nam'>Nam</MenuItem>
                <MenuItem value='Nữ'>Nữ</MenuItem>
                <MenuItem value='Khác'>Khác</MenuItem>
              </Select>
            </FormControl>
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

export default ManageUserPage
