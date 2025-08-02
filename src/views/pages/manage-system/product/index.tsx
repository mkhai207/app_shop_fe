import React, { useState } from 'react'
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  SelectChangeEvent
} from '@mui/material'
import CustomPagination from 'src/components/custom-pagination'
import { PAGE_SIZE_OPTION } from 'src/configs/gridConfig'
import { NextPage } from 'next'

// Types
interface TProduct {
  id: number
  name: string
  price: number
  category: string
  stock: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  description: string
  gender: string
  status: 'active' | 'inactive'
  thumbnail: string
  category_id: number
  brand_id: number
  rating: number
  sold: number
}

interface NewProduct {
  name: string
  price: string
  category: string
  stock: string
}

// Mock data
const mockProducts: TProduct[] = [
  {
    id: 1,
    name: 'Áo thun nam basic',
    price: 250000,
    category: 'Áo thun',
    stock: 50,
    created_at: '2024-01-15T10:30:00Z',
    created_by: 'admin',
    updated_at: '2024-01-20T14:45:00Z',
    updated_by: 'admin',
    description: 'Áo thun nam chất liệu cotton 100% thoáng mát',
    gender: 'Nam',
    status: 'active',
    thumbnail: 'https://via.placeholder.com/40/4CAF50/FFFFFF?text=AT',
    category_id: 1,
    brand_id: 1,
    rating: 4.5,
    sold: 120
  },
  {
    id: 2,
    name: 'Quần jean nữ skinny',
    price: 450000,
    category: 'Quần jean',
    stock: 30,
    created_at: '2024-01-16T09:15:00Z',
    created_by: 'manager',
    updated_at: '2024-01-22T11:20:00Z',
    updated_by: 'admin',
    description: 'Quần jean nữ form skinny thời trang, co giãn tốt',
    gender: 'Nữ',
    status: 'active',
    thumbnail: 'https://via.placeholder.com/40/2196F3/FFFFFF?text=QJ',
    category_id: 2,
    brand_id: 2,
    rating: 4.2,
    sold: 85
  },
  {
    id: 3,
    name: 'Giày sneaker unisex',
    price: 750000,
    category: 'Giày',
    stock: 25,
    created_at: '2024-01-18T13:45:00Z',
    created_by: 'staff',
    updated_at: '2024-01-25T16:30:00Z',
    updated_by: 'manager',
    description: 'Giày sneaker phong cách thể thao, phù hợp mọi giới tính',
    gender: 'Unisex',
    status: 'active',
    thumbnail: 'https://via.placeholder.com/40/FF9800/FFFFFF?text=GS',
    category_id: 3,
    brand_id: 1,
    rating: 4.8,
    sold: 200
  },
  {
    id: 4,
    name: 'Váy midi nữ',
    price: 380000,
    category: 'Váy',
    stock: 15,
    created_at: '2024-01-20T08:30:00Z',
    created_by: 'admin',
    updated_at: '2024-01-28T12:15:00Z',
    updated_by: 'staff',
    description: 'Váy midi thanh lịch cho nữ, phù hợp đi làm và dạo phố',
    gender: 'Nữ',
    status: 'inactive',
    thumbnail: 'https://via.placeholder.com/40/E91E63/FFFFFF?text=VM',
    category_id: 4,
    brand_id: 3,
    rating: 4.0,
    sold: 45
  },
  {
    id: 5,
    name: 'Áo khoác hoodie',
    price: 520000,
    category: 'Áo khoác',
    stock: 40,
    created_at: '2024-01-22T15:20:00Z',
    created_by: 'manager',
    updated_at: '2024-01-30T10:45:00Z',
    updated_by: 'admin',
    description: 'Áo khoác hoodie ấm áp, thiết kế hiện đại',
    gender: 'Unisex',
    status: 'active',
    thumbnail: 'https://via.placeholder.com/40/9C27B0/FFFFFF?text=AK',
    category_id: 5,
    brand_id: 2,
    rating: 4.6,
    sold: 95
  },
  {
    id: 6,
    name: 'Túi xách nữ',
    price: 680000,
    category: 'Phụ kiện',
    stock: 20,
    created_at: '2024-01-25T11:10:00Z',
    created_by: 'staff',
    updated_at: '2024-02-01T14:25:00Z',
    updated_by: 'manager',
    description: 'Túi xách nữ cao cấp, thiết kế sang trọng',
    gender: 'Nữ',
    status: 'active',
    thumbnail: 'https://via.placeholder.com/40/795548/FFFFFF?text=TX',
    category_id: 6,
    brand_id: 1,
    rating: 4.3,
    sold: 65
  }
]

type TProps = {}

const ManageProductPage: NextPage<TProps> = () => {
  // State declarations
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTION[0])
  const [page, setPage] = useState(1)
  const [products, setProducts] = useState<TProduct[]>(mockProducts)
  const [loading] = useState(false)
  const [error] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [editProduct, setEditProduct] = useState<TProduct | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '',
    price: '',
    category: '',
    stock: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Handlers
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xoá sản phẩm này?')) {
      setProducts(products.filter(p => p.id !== id))
    }
  }

  const handleEdit = (product: TProduct) => {
    setEditProduct(product)
    setEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editProduct) {
      setProducts(
        products.map(p =>
          p.id === editProduct.id ? { ...editProduct, updated_at: new Date().toISOString(), updated_by: 'admin' } : p
        )
      )
      setEditModal(false)
    }
  }

  const handleAdd = () => {
    setNewProduct({ name: '', price: '', category: '', stock: '' })
    setAddModal(true)
  }

  const handleSaveAdd = () => {
    const maxId = products.length > 0 ? Math.max(...products.map(p => p.id)) : 0
    const productToAdd: TProduct = {
      ...newProduct,
      id: maxId + 1,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      created_at: new Date().toISOString(),
      created_by: 'admin',
      updated_at: new Date().toISOString(),
      updated_by: 'admin',
      description: '',
      gender: 'Unisex',
      status: 'active',
      thumbnail: 'https://via.placeholder.com/40/607D8B/FFFFFF?text=NEW',
      category_id: 1,
      brand_id: 1,
      rating: 0,
      sold: 0
    }
    setProducts([...products, productToAdd])
    setAddModal(false)
  }

  // Filtering and pagination
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)))
  const filteredProducts = products.filter(product => {
    const matchName = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = filterCategory ? product.category === filterCategory : true

    return matchName && matchCategory
  })
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Styles
  const ellipsisStyle: React.CSSProperties = {
    maxWidth: 120,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    verticalAlign: 'middle'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const handleOnchangePagination = (page: number, pageSize: number) => {
    setPage(page)
    setPageSize(pageSize)
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        maxWidth: '100vw',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}
    >
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>Quản lý sản phẩm</h2>

      <Box sx={{ display: 'flex', mb: 3, gap: 2, alignItems: 'flex-end' }}>
        <Button variant='contained' color='primary' onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
        <Box>
          <TextField
            size='small'
            sx={{ width: 180, minWidth: 120 }}
            placeholder='Nhập tên sản phẩm'
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </Box>
        <Box>
                          <label style={{ marginRight: '0.5rem' }}>Phân loại:</label>
          <Select
            size='small'
            sx={{ width: 140, minWidth: 100 }}
            value={filterCategory}
            onChange={(e: SelectChangeEvent) => {
              setFilterCategory(e.target.value)
              setCurrentPage(1)
            }}
          >
            <MenuItem value=''>Tất cả</MenuItem>
            {categories.map(cat => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Box sx={{ color: 'red' }}>{error}</Box>
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
            <Table>
              <TableHead>
                <TableRow>
                  {[
                    'ID',
                    'Ảnh',
                    'Tên sản phẩm',
                    'Mô tả',
                    'Giá',
                    'Giới tính',
                    'Trạng thái',
                    'Đánh giá',
                    'Đã bán',
                    'Ngày tạo',
                    'Người tạo',
                    'Ngày cập nhật',
                    'Người cập nhật',
                    'Category ID',
                    'Brand ID',
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
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((product: TProduct) => (
                    <TableRow key={product.id}>
                      <TableCell sx={{ textAlign: 'center' }}>{product.id}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title='Ảnh sản phẩm'>
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            width={40}
                            height={40}
                            style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={product.name}>
                          <span
                            style={{
                              ...ellipsisStyle,
                              cursor: 'pointer',
                              textDecoration: 'underline',
                              color: '#1976d2'
                            }}
                          >
                            {product.name}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={product.description}>
                          <span style={{ ...ellipsisStyle, cursor: 'pointer' }}>{product.description}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title='Giá bán (VNĐ)'>
                          <span style={{ cursor: 'pointer' }}>{product.price.toLocaleString()}đ</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={`Dành cho: ${product.gender}`}>
                          <span style={{ ...ellipsisStyle, cursor: 'pointer' }}>{product.gender}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}>
                          <span
                            style={{
                              color: product.status === 'active' ? 'green' : 'gray',
                              cursor: 'pointer',
                              fontWeight: 'bold'
                            }}
                          >
                            {product.status === 'active' ? 'Đang bán' : 'Ngừng bán'}
                          </span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={`Đánh giá trung bình: ${product.rating}★`}>
                          <span style={{ cursor: 'pointer' }}>{product.rating} ★</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title='Số lượng đã bán'>
                          <span style={{ cursor: 'pointer' }}>{product.sold}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(product.created_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={product.created_by}>
                          <span style={ellipsisStyle}>{product.created_by}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(product.updated_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={product.updated_by}>
                          <span style={ellipsisStyle}>{product.updated_by}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{product.category_id}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{product.brand_id}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button variant='outlined' color='warning' size='small' onClick={() => handleEdit(product)}>
                            Sửa
                          </Button>
                          <Button
                            variant='outlined'
                            color='error'
                            size='small'
                            onClick={() => handleDelete(product.id)}
                          >
                            Xoá
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={16} sx={{ textAlign: 'center' }}>
                      Không có sản phẩm nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            // <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            //   <Pagination
            //     count={totalPages}
            //     page={currentPage}
            //     onChange={(e, page) => setCurrentPage(page)}
            //     color='primary'
            //   />
            // </Box>
            <Box sx={{ mt: 4, mb: 4 }}>
              <CustomPagination
                onChangePagination={handleOnchangePagination}
                pageSizeOptions={PAGE_SIZE_OPTION}
                pageSize={pageSize}
                totalPages={totalPages}
                page={page}
                rowLength={10}
                isHideShowed
              />
            </Box>
          )}
        </>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={editModal} onClose={() => setEditModal(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Sửa sản phẩm</DialogTitle>
        <DialogContent>
          {editProduct && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label='Tên sản phẩm'
                value={editProduct.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditProduct({ ...editProduct, name: e.target.value })
                }
                fullWidth
              />
              <TextField
                label='Giá'
                type='number'
                value={editProduct.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditProduct({ ...editProduct, price: Number(e.target.value) })
                }
                fullWidth
              />
              <TextField
                label='Phân loại'
                value={editProduct.category || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditProduct({ ...editProduct, category: e.target.value })
                }
                fullWidth
              />
              <TextField
                label='Số lượng'
                type='number'
                value={editProduct.stock}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditProduct({ ...editProduct, stock: Number(e.target.value) })
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

      {/* Add Product Dialog */}
      <Dialog open={addModal} onClose={() => setAddModal(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label='Tên sản phẩm'
              value={newProduct.name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewProduct({ ...newProduct, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label='Giá'
              type='number'
              value={newProduct.price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewProduct({ ...newProduct, price: e.target.value })
              }
              fullWidth
            />
            <TextField
              label='Phân loại'
              value={newProduct.category}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewProduct({ ...newProduct, category: e.target.value })
              }
              fullWidth
            />
            <TextField
              label='Số lượng'
              type='number'
              value={newProduct.stock}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewProduct({ ...newProduct, stock: e.target.value })
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

export default ManageProductPage
