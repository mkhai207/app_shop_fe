import React, { useState, useRef, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  LinearProgress,
  Alert
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import CloseIcon from '@mui/icons-material/Close'
import { TProduct, TBrand, TCategory } from 'src/types/product'
import { getCategories } from 'src/services/category'
import { getBrands } from 'src/services/brand'

import { useFileUpload } from 'src/hooks/useFileUpload'

type TVariant = {
  hex_code: string
  inventory: {
    size: string
    quantity: number
  }[]
}

interface EditProductModalProps {
  open: boolean
  onClose: () => void
  product: TProduct | null
  variants: TVariant[]
  onProductChange: (product: TProduct) => void
  onVariantsChange: (variants: TVariant[]) => void
  onSave: () => void
  loading?: boolean
}

// Hàm kiểm tra màu HEX hợp lệ
const isValidHexColor = (color: string) => {
  if (!color || typeof color !== 'string') return false
  const trimmedColor = color.trim()
  const hexPattern = /^#([0-9a-f]{3}){1,2}$/i

  return hexPattern.test(trimmedColor)
}

// Hàm lấy màu an toàn cho MUI
const getSafeColor = (color: string) => {
  if (!color || typeof color !== 'string') {
    return '#000000'
  }
  const trimmedColor = color.trim()

  return isValidHexColor(trimmedColor) ? trimmedColor : '#000000'
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  open,
  onClose,
  product,
  variants,
  onProductChange,
  onVariantsChange,
  onSave,
  loading = false
}) => {
  const [categories, setCategories] = useState<TCategory[]>([])
  const [brands, setBrands] = useState<TBrand[]>([])

  // Sử dụng hook upload ảnh
  const { uploadFile, uploadMultipleFiles, isUploading, uploadProgress, error } = useFileUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sliderFileInputRef = useRef<HTMLInputElement>(null)

  const fetchGetCategories = async () => {
    const response = await getCategories()
    if (response.status === 'success') {
      setCategories(response.data)
    }
  }

  const fetchGetBrands = async () => {
    const response = await getBrands()
    if (response.status === 'success') {
      setBrands(response.data)
    }
  }

  const handleAddVariant = () => {
    onVariantsChange([
      ...variants,
      {
        hex_code: '#000000',
        inventory: [
          { size: 'S', quantity: 0 },
          { size: 'M', quantity: 0 },
          { size: 'L', quantity: 0 }
        ]
      }
    ])
  }

  useEffect(() => {
    fetchGetCategories()
    fetchGetBrands()
  }, [])

  if (!product) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth='lg' fullWidth>
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        Sửa sản phẩm
        <IconButton
          onClick={onClose}
          sx={{
            color: 'grey.500',
            '&:hover': {
              color: 'grey.700'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pt: 3, maxHeight: '80vh', overflow: 'auto' }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#1976D2', mb: 3 }}>
              Thông tin cơ bản
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label='Tên sản phẩm'
                  value={product.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onProductChange({ ...product, name: e.target.value })
                  }
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label='Giá (VNĐ)'
                  type='number'
                  value={product.price}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onProductChange({ ...product, price: Number(e.target.value) })
                  }
                  fullWidth
                  required
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label='Mô tả'
                  value={product.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onProductChange({ ...product, description: e.target.value })
                  }
                  fullWidth
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    value={product.gender}
                    label='Giới tính'
                    onChange={e =>
                      onProductChange({ ...product, gender: e.target.value as 'MALE' | 'FEMALE' | 'UNISEX' })
                    }
                  >
                    <MenuItem value='MALE'>Nam</MenuItem>
                    <MenuItem value='FEMALE'>Nữ</MenuItem>
                    <MenuItem value='UNISEX'>Unisex</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={product.category_id || ''}
                    label='Danh mục'
                    onChange={e => onProductChange({ ...product, category_id: e.target.value })}
                  >
                    {categories.map(category => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Thương hiệu</InputLabel>
                  <Select
                    value={product.brand_id || ''}
                    label='Thương hiệu'
                    onChange={e => onProductChange({ ...product, brand_id: e.target.value })}
                  >
                    {brands.map(brand => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label='Số lượng đã bán'
                  type='number'
                  value={product.sold || 0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    onProductChange({ ...product, sold: Number(e.target.value) })
                  }
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={product.status}
                      onChange={e => onProductChange({ ...product, status: e.target.checked })}
                    />
                  }
                  label='Trạng thái hoạt động'
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                    Ảnh đại diện
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant='outlined'
                      startIcon={<CloudUploadIcon />}
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      Chọn ảnh
                    </Button>

                    {product.thumbnail && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                          component='img'
                          src={product.thumbnail}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                            border: '1px solid #ccc'
                          }}
                        />
                        <IconButton
                          size='small'
                          color='error'
                          onClick={() => onProductChange({ ...product, thumbnail: '' })}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                    )}
                  </Box>

                  {isUploading && (
                    <Box sx={{ width: '100%' }}>
                      <LinearProgress variant='determinate' value={uploadProgress} />
                      <Typography variant='caption' sx={{ mt: 1 }}>
                        Đang upload... {uploadProgress}%
                      </Typography>
                    </Box>
                  )}

                  {error && (
                    <Alert severity='error' sx={{ mt: 1 }}>
                      {error}
                    </Alert>
                  )}

                  <input
                    ref={fileInputRef}
                    type='file'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={async e => {
                      const file = e.target.files?.[0]
                      if (file) {
                        try {
                          const response = await uploadFile(file)
                          const imageUrl = response.data?.url || URL.createObjectURL(file)
                          onProductChange({ ...product, thumbnail: imageUrl })
                        } catch (error) {
                          console.error('Upload failed:', error)
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                    Ảnh slider
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Button
                      variant='outlined'
                      startIcon={<CloudUploadIcon />}
                      onClick={() => sliderFileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      Chọn nhiều ảnh
                    </Button>
                  </Box>

                  {product.slider && Array.isArray(product.slider) && product.slider.length > 0 && (
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {product.slider.map((url: string, index: number) => (
                        <Box key={index} sx={{ position: 'relative' }}>
                          <Box
                            component='img'
                            src={url}
                            sx={{
                              width: 60,
                              height: 60,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid #ccc'
                            }}
                          />
                          <IconButton
                            size='small'
                            color='error'
                            sx={{
                              position: 'absolute',
                              top: -8,
                              right: -8,
                              backgroundColor: 'error.main',
                              color: 'white',
                              '&:hover': {
                                backgroundColor: 'error.dark'
                              }
                            }}
                            onClick={() => {
                              const urls = product.slider?.filter((_: string, i: number) => i !== index) || []
                              onProductChange({ ...product, slider: urls })
                            }}
                          >
                            <CloseIcon fontSize='small' />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  )}

                  <input
                    ref={sliderFileInputRef}
                    type='file'
                    accept='image/*'
                    multiple
                    style={{ display: 'none' }}
                    onChange={async e => {
                      const files = Array.from(e.target.files || [])
                      if (files.length > 0) {
                        try {
                          const response = await uploadMultipleFiles(files)
                          const urls = response.data?.urls || []
                          const currentUrls = product.slider || []
                          onProductChange({
                            ...product,
                            slider: [...currentUrls, ...urls]
                          })
                        } catch (error) {
                          console.error('Upload failed:', error)
                        }
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#1976D2' }}>
                Mã màu & Tồn kho
              </Typography>
              <Button startIcon={<AddIcon />} variant='contained' size='small' onClick={handleAddVariant}>
                Thêm màu mới
              </Button>
            </Box>

            {variants.map((variant, index) => (
              <Card key={index} sx={{ mb: 3, border: '1px solid #e0e0e0', borderRadius: 2 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant='h6' sx={{ color: '#607D8B' }}>
                      Màu #{index + 1}
                    </Typography>
                    {variants.length > 1 && (
                      <IconButton
                        color='error'
                        size='small'
                        sx={{ border: '1px solid', borderColor: '#D32F2F' }}
                        onClick={() => {
                          const updated = variants.filter((_, i) => i !== index)
                          onVariantsChange(updated)
                        }}
                      >
                        <CloseIcon />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label='Mã màu HEX để hiển thị'
                          fullWidth
                          required
                          disabled
                          placeholder='#000000'
                          value={variant.hex_code}
                          onChange={e => {
                            const updated = [...variants]
                            updated[index].hex_code = e.target.value
                            onVariantsChange(updated)
                          }}
                        />

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                            Màu hiển thị:
                          </Typography>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              backgroundColor: getSafeColor(variant.hex_code),
                              border: '2px solid #ccc',
                              borderRadius: 1,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant='subtitle2' sx={{ fontWeight: 'bold' }}>
                            Nhập mã màu nhanh:
                          </Typography>
                          <TextField
                            size='small'
                            placeholder='#FFFFFF'
                            sx={{ width: 120 }}
                            onKeyPress={e => {
                              if (e.key === 'Enter') {
                                const input = e.target as HTMLInputElement
                                const newColor = input.value.trim()
                                if (isValidHexColor(newColor)) {
                                  const updated = [...variants]
                                  updated[index].hex_code = newColor
                                  onVariantsChange(updated)
                                  input.value = ''
                                }
                              }
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant='subtitle2' sx={{ fontWeight: 'bold', mb: 2 }}>
                      Quản lý tồn kho theo size
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {variant.inventory.map((item, itemIndex) => (
                        <Box key={itemIndex} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Chip
                            label={item.size}
                            size='small'
                            sx={{
                              backgroundColor: 'primary.main',
                              color: 'white',
                              minWidth: 60
                            }}
                          />
                          <TextField
                            size='small'
                            type='number'
                            label='Số lượng'
                            value={item.quantity}
                            onChange={e => {
                              const updated = [...variants]
                              updated[index].inventory[itemIndex].quantity = parseInt(e.target.value) || 0
                              onVariantsChange(updated)
                            }}
                            InputProps={{ inputProps: { min: 0 } }}
                            sx={{ width: 120 }}
                          />
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => {
                              if (variant.inventory.length > 1) {
                                const updated = [...variants]
                                updated[index].inventory = variant.inventory.filter((_, i) => i !== itemIndex)
                                onVariantsChange(updated)
                              }
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </Box>
                      ))}

                      <Button
                        size='small'
                        variant='outlined'
                        startIcon={<AddIcon />}
                        onClick={() => {
                          const newSize = prompt('Nhập kích thước mới:')
                          if (newSize && newSize.trim()) {
                            const updated = [...variants]
                            const existingSizes = updated[index].inventory.map(item => item.size)
                            if (!existingSizes.includes(newSize.trim())) {
                              updated[index].inventory.push({
                                size: newSize.trim(),
                                quantity: 0
                              })
                              onVariantsChange(updated)
                            }
                          }
                        }}
                      >
                        Thêm size
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant='outlined' disabled={loading}>
          Huỷ
        </Button>
        <Button onClick={onSave} variant='contained' color='primary' disabled={loading}>
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditProductModal
