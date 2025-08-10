import { yupResolver } from '@hookform/resolvers/yup'
import { Add as AddIcon } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  colors,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  Menu,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { createAddress, deleteAddressById, getAddressesByUserId, updateAddressById } from 'src/services/address'
import { TAddress } from 'src/types/address'
import * as yup from 'yup'

interface AddressFormData {
  recipient_name: string
  phone_number: string
  street: string
  ward: string
  district: string
  city: string
  is_default: boolean
}

const AddressPage = () => {
  // States
  const [addresses, setAddresses] = useState<TAddress[]>([])
  const [loading, setLoading] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<TAddress | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<TAddress | null>(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedContact, setSelectedContact] = useState<string | null>(null)

  // Form validation schema
  const schema = yup.object({
    recipient_name: yup.string().required('Tên người nhận là bắt buộc'),
    phone_number: yup
      .string()
      .required('Số điện thoại là bắt buộc')
      .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
    street: yup.string().required('Địa chỉ đường/số nhà là bắt buộc'),
    ward: yup.string().required('Phường/xã là bắt buộc'),
    district: yup.string().required('Quận/huyện là bắt buộc'),
    city: yup.string().required('Tỉnh/thành phố là bắt buộc'),
    is_default: yup.boolean().default(false)
  })

  const defaultValues: AddressFormData = {
    recipient_name: '',
    phone_number: '',
    street: '',
    ward: '',
    district: '',
    city: '',
    is_default: false
  }

  const { handleSubmit, control, reset } = useForm<AddressFormData>({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  // Load addresses on component mount
  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    setLoading(true)
    try {
      const response = await getAddressesByUserId()
      if (response?.status === 'success' && response?.data) {
        setAddresses(response.data)
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Có lỗi khi tải danh sách địa chỉ')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (address: TAddress | null = null) => {
    if (address) {
      setEditingAddress(address)
      reset({
        recipient_name: address.recipient_name,
        phone_number: address.phone_number,
        street: address.street,
        ward: address.ward,
        district: address.district,
        city: address.city,
        is_default: address.is_default
      })
    } else {
      setEditingAddress(null)
      reset(defaultValues)
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingAddress(null)
    reset(defaultValues)
  }

  const onSubmit = async (data: AddressFormData) => {
    try {
      let response
      if (editingAddress) {
        response = await updateAddressById(parseInt(editingAddress.id), data)
        if (response?.status === 'success') {
          toast.success('Cập nhật địa chỉ thành công')
        }
      } else {
        response = await createAddress(data)
        if (response?.status === 'success') {
          toast.success('Thêm địa chỉ mới thành công')
        }
      }

      if (response?.status === 'success') {
        handleCloseDialog()
        fetchAddresses()
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Có lỗi xảy ra, vui lòng thử lại')
    }
  }

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return

    try {
      const response = await deleteAddressById(parseInt(addressToDelete.id))
      if (response?.status === 'success') {
        toast.success('Xóa địa chỉ thành công')
        fetchAddresses()
      } else {
        toast.error('Có lỗi khi xóa địa chỉ')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Có lỗi khi xóa địa chỉ')
    } finally {
      setDeleteConfirmOpen(false)
      setAddressToDelete(null)
    }
  }

  const handleOpenDeleteConfirm = (address: TAddress) => {
    setAddressToDelete(address)
    setDeleteConfirmOpen(true)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, addressId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedContact(addressId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedContact(null)
  }

  const handleSetDefault = async () => {
    const address = addresses.find(addr => addr.id === selectedContact)
    if (address) {
      try {
        const response = await updateAddressById(parseInt(address.id), {
          ...address,
          is_default: true
        })
        if (response?.status === 'success') {
          toast.success('Đã thiết lập làm địa chỉ mặc định')
          fetchAddresses()
        }
      } catch (error) {
        console.error('Error setting default:', error)
        toast.error('Có lỗi khi thiết lập mặc định')
      }
    }
    handleMenuClose()
  }

  const handleDelete = () => {
    const address = addresses.find(addr => addr.id === selectedContact)
    if (address) {
      handleOpenDeleteConfirm(address)
    }
    handleMenuClose()
  }

  return (
    <Container maxWidth='md' sx={{ py: 2 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333' }}>
          Địa chỉ của tôi
        </Typography>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          sx={{
            bgcolor: colors.lightBlue,
            '&:hover': {
              bgcolor: colors.lightBlue
            },
            borderRadius: '8px',
            textTransform: 'none',
            px: 3
          }}
          onClick={() => handleOpenDialog()}
        >
          Thêm địa chỉ mới
        </Button>
      </Box>

      <Typography variant='h6' sx={{ mb: 2, color: '#666' }}>
        Địa chỉ
      </Typography>

      {/* Contact List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : addresses.length === 0 ? (
          <Alert severity='info'>Chưa có địa chỉ nào. Hãy thêm địa chỉ mới.</Alert>
        ) : (
          addresses.map(address => (
            <Card
              key={address.id}
              sx={{
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    {/* Name and Phone */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#333' }}>
                        {address.recipient_name}
                      </Typography>
                      <Typography variant='body2' sx={{ color: '#666' }}>
                        {address.phone_number}
                      </Typography>
                    </Box>

                    {/* Address */}
                    <Typography
                      variant='body2'
                      sx={{
                        color: '#666',
                        lineHeight: 1.5,
                        mb: 2
                      }}
                    >
                      {address.street}, {address.ward}, {address.district}, {address.city}
                    </Typography>

                    {/* Tags and Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {address.is_default && (
                          <Chip
                            label='Mặc định'
                            size='small'
                            sx={{
                              bgcolor: '#ffebee',
                              color: '#d32f2f',
                              border: '1px solid #ffcdd2',
                              height: '24px',
                              fontSize: '12px'
                            }}
                          />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography
                          variant='caption'
                          sx={{ color: '#2196f3', cursor: 'pointer' }}
                          onClick={() => handleOpenDialog(address)}
                        >
                          Cập nhật
                        </Typography>
                        {!address.is_default && (
                          <Typography
                            variant='caption'
                            sx={{ color: '#f44336', cursor: 'pointer' }}
                            onClick={() => handleOpenDeleteConfirm(address)}
                          >
                            Xóa
                          </Typography>
                        )}
                        {!address.is_default && (
                          <Button
                            variant='outlined'
                            size='small'
                            sx={{
                              textTransform: 'none',
                              minWidth: 'auto',
                              px: 2,
                              py: 0.5,
                              fontSize: '12px',
                              color: '#666',
                              borderColor: '#ddd',
                              '&:hover': {
                                borderColor: '#bbb',
                                bgcolor: '#f5f5f5'
                              }
                            }}
                            onClick={e => handleMenuClick(e, address.id)}
                          >
                            Thiết lập mặc định
                          </Button>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '150px'
          }
        }}
      >
        <MenuItem onClick={handleSetDefault}>Thiết lập mặc định</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#f44336' }}>
          Xóa
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth='md' fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>{editingAddress ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Controller
                name='recipient_name'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField {...field} label='Tên người nhận' fullWidth error={!!error} helperText={error?.message} />
                )}
              />

              <Controller
                name='phone_number'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField {...field} label='Số điện thoại' fullWidth error={!!error} helperText={error?.message} />
                )}
              />

              <Controller
                name='street'
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label='Địa chỉ (số nhà, tên đường)'
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Controller
                    name='ward'
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label='Phường/Xã' fullWidth error={!!error} helperText={error?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name='district'
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField {...field} label='Quận/Huyện' fullWidth error={!!error} helperText={error?.message} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller
                    name='city'
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        label='Tỉnh/Thành phố'
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Controller
                name='is_default'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={<Checkbox checked={field.value} onChange={field.onChange} />}
                    label='Đặt làm địa chỉ mặc định'
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button type='submit' variant='contained'>
              {editingAddress ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>Bạn có chắc chắn muốn xóa địa chỉ của {addressToDelete?.recipient_name}?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Hủy</Button>
          <Button onClick={handleDeleteAddress} color='error' variant='contained'>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default AddressPage
