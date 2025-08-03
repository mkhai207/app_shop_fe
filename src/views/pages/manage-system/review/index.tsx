import React, { useState, useEffect } from 'react'
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
  SelectChangeEvent,
  Rating,
  Chip,
  Typography,
  Alert,
  InputAdornment
} from '@mui/material'
import { NextPage } from 'next'
import { reviewService } from 'src/services/review'
import { TReview } from 'src/types/review'

// Types

interface NewReview {
  rating: string
  comment: string
  product_id: string
  order_id: string
  images: string
}

// Mock data
const mockReviews: TReview[] = [
  {
    id: 1,
    created_at: '2024-01-15T10:30:00Z',
    created_by: 'user123',
    updated_at: '2024-01-15T10:30:00Z',
    updated_by: 'user123',
    rating: 5,
    comment: 'Sản phẩm rất tốt, chất lượng cao, giao hàng nhanh chóng. Rất hài lòng với dịch vụ!',
    user_id: 1,
    product_id: 'PROD001',
    images: 'https://via.placeholder.com/100/4CAF50/FFFFFF?text=IMG1,https://via.placeholder.com/100/2196F3/FFFFFF?text=IMG2'
  },
  {
    id: 2,
    created_at: '2024-01-16T14:20:00Z',
    created_by: 'user456',
    updated_at: '2024-01-16T14:20:00Z',
    updated_by: 'user456',
    rating: 4,
    comment: 'Sản phẩm đẹp, vừa vặn. Tuy nhiên màu sắc hơi khác so với hình ảnh.',
    user_id: 2,
    product_id: 'PROD002',
    images: 'https://via.placeholder.com/100/FF9800/FFFFFF?text=IMG3'
  },
  {
    id: 3,
    created_at: '2024-01-17T09:15:00Z',
    created_by: 'user789',
    updated_at: '2024-01-17T09:15:00Z',
    updated_by: 'user789',
    rating: 3,
    comment: 'Chất lượng sản phẩm tạm được, nhưng giá hơi cao so với chất lượng.',
    user_id: 3,
    product_id: 'PROD003',
    images: ''
  },
  {
    id: 4,
    created_at: '2024-01-18T16:45:00Z',
    created_by: 'user101',
    updated_at: '2024-01-18T16:45:00Z',
    updated_by: 'user101',
    rating: 5,
    comment: 'Tuyệt vời! Sản phẩm đúng như mô tả, giao hàng đúng hẹn. Sẽ mua lại!',
    user_id: 4,
    product_id: 'PROD001',
    images: 'https://via.placeholder.com/100/E91E63/FFFFFF?text=IMG4,https://via.placeholder.com/100/9C27B0/FFFFFF?text=IMG5'
  },
  {
    id: 5,
    created_at: '2024-01-19T11:30:00Z',
    created_by: 'user202',
    updated_at: '2024-01-19T11:30:00Z',
    updated_by: 'user202',
    rating: 2,
    comment: 'Sản phẩm không như mong đợi, chất lượng kém, không khuyến khích mua.',
    user_id: 5,
    product_id: 'PROD004',
    images: 'https://via.placeholder.com/100/F44336/FFFFFF?text=IMG6'
  },
  {
    id: 6,
    created_at: '2024-01-20T13:20:00Z',
    created_by: 'user303',
    updated_at: '2024-01-20T13:20:00Z',
    updated_by: 'user303',
    rating: 4,
    comment: 'Sản phẩm tốt, thiết kế đẹp. Giao hàng nhanh, nhân viên phục vụ nhiệt tình.',
    user_id: 6,
    product_id: 'PROD005',
    images: 'https://via.placeholder.com/100/607D8B/FFFFFF?text=IMG7'
  }
]

type TProps = {}

const ManageReviewPage: NextPage<TProps> = () => {
  // State declarations
  const [reviews, setReviews] = useState<TReview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editModal, setEditModal] = useState(false)
  const [editReview, setEditReview] = useState<TReview | null>(null)
  const [addModal, setAddModal] = useState(false)
  const [newReview, setNewReview] = useState<NewReview>({
    rating: '',
    comment: '',
    product_id: '',
    order_id: '',
    images: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [addingReview, setAddingReview] = useState(false)
  const itemsPerPage = 10

  // Reset currentPage when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterRating])

  // Load reviews from API
  useEffect(() => {
    const loadReviews = async () => {
      console.log('🔄 Loading reviews...')
      console.log('📊 Current state:', { currentPage, searchTerm, filterRating, itemsPerPage })
      
      setLoading(true)
      setError('')
      try {
        const response = await reviewService.getReviews({
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm || undefined,
          rating: filterRating ? Number(filterRating) : undefined
        })
        
        console.log('✅ Reviews loaded successfully:', response)
        console.log('📋 Reviews data:', response.data)
        console.log('📊 Meta data:', response.meta)
        
        setReviews(response.data)
        setTotalItems(response.meta.totalItems)
        setTotalPages(response.meta.totalPages)
        
        console.log('🎯 State updated:', {
          reviewsCount: response.data.length,
          totalItems: response.meta.totalItems,
          totalPages: response.meta.totalPages
        })
      } catch (err: any) {
        console.error('❌ Error loading reviews:', err)
        setError(err.message || 'Failed to fetch reviews')
        // Fallback to mock data if API fails
        console.log('🔄 Falling back to mock data...')
        setReviews(mockReviews)
        setTotalItems(mockReviews.length)
        setTotalPages(Math.ceil(mockReviews.length / itemsPerPage))
      } finally {
        setLoading(false)
        console.log('🏁 Loading completed')
      }
    }

    loadReviews()
  }, [currentPage, searchTerm, filterRating])

  // Debug render
  useEffect(() => {
    console.log('🎨 Render debug - Loading:', loading, 'Reviews count:', reviews.length, 'Error:', error)
  }, [loading, reviews.length, error])

  // Handlers
  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc muốn xoá đánh giá này?')) {
      setReviews(reviews.filter(r => r.id !== id))
    }
  }

  const handleEdit = (review: TReview) => {
    setEditReview(review)
    setEditModal(true)
  }

  const handleSaveEdit = () => {
    if (editReview) {
      setReviews(
        reviews.map(r =>
          r.id === editReview.id ? { ...editReview, updated_at: new Date().toISOString(), updated_by: 'admin' } : r
        )
      )
      setEditModal(false)
    }
  }

  const handleAdd = () => {
    setNewReview({ rating: '', comment: '', product_id: '', order_id: '', images: '' })
    setAddModal(true)
  }

  const handleSaveAdd = async () => {
    // Validation
    if (!newReview.rating || !newReview.comment || !newReview.product_id) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc (Đánh giá, Nội dung, Product ID)')
      return
    }
    
    if (Number(newReview.rating) < 1 || Number(newReview.rating) > 5) {
      alert('Đánh giá phải từ 1 đến 5 sao')
      return
    }
    
    setAddingReview(true)
    
    try {
      console.log('🔄 Adding new review:', newReview)
      
      const reviewData = {
        rating: Number(newReview.rating),
        comment: newReview.comment,
        product_id: newReview.product_id,
        order_id: newReview.order_id ? Number(newReview.order_id) : undefined,
        images: newReview.images || ''
      }
      
      const response = await reviewService.createReview(reviewData)
      console.log('✅ Review added successfully:', response)
      
      // Refresh the reviews list
      const updatedResponse = await reviewService.getReviews({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm || undefined,
        rating: filterRating ? Number(filterRating) : undefined
      })
      
      setReviews(updatedResponse.data)
      setTotalItems(updatedResponse.meta.totalItems)
      setTotalPages(updatedResponse.meta.totalPages)
      
      setAddModal(false)
      
      // Show success message
      alert('Thêm đánh giá thành công!')
    } catch (error: any) {
      console.error('❌ Failed to add review:', error)
      alert('Lỗi khi thêm đánh giá: ' + (error.message || 'Unknown error'))
    } finally {
      setAddingReview(false)
    }
  }

  // Filtering and pagination
  const ratings = [1, 2, 3, 4, 5]

  // Styles
  const ellipsisStyle: React.CSSProperties = {
    maxWidth: 150,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    verticalAlign: 'middle'
  }

  const formatDate = (dateString: string) => {
    console.log('📅 Formatting date:', dateString)
    return new Date(dateString).toLocaleDateString('vi-VN')
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
      <Typography variant='h5' fontWeight='bold' mb={3}>
        Quản lý đánh giá
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

      <Box sx={{ display: 'flex', mb: 3, gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <Button variant='contained' color='primary' onClick={handleAdd}>
          Thêm đánh giá
        </Button>
        <Box>
          <TextField
            size='small'
            sx={{ width: 200, minWidth: 150 }}
            placeholder='Tìm kiếm theo nội dung'
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value)
            }}
          />
        </Box>
        <Box>
          <label style={{ marginRight: '0.5rem' }}>Đánh giá:</label>
          <Select
            size='small'
            sx={{ width: 120, minWidth: 100 }}
            value={filterRating}
            onChange={(e: SelectChangeEvent) => {
              setFilterRating(e.target.value)
            }}
          >
            <MenuItem value=''>Tất cả</MenuItem>
            {ratings.map(rating => (
              <MenuItem key={rating} value={rating}>
                {rating} sao
              </MenuItem>
            ))}
          </Select>
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
            <Table>
              <TableHead>
                <TableRow>
                                     {[
                     'ID',
                     'Đánh giá',
                     'Nội dung',
                     'Hình ảnh',
                     'Ngày tạo',
                     'Người tạo',
                     'Ngày cập nhật',
                     'Người cập nhật',
                     'Order ID',
                     'Product ID',
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
                {reviews.length > 0 ? (
                  reviews.map((review: TReview) => (
                    <TableRow key={review.id}>
                      <TableCell sx={{ textAlign: 'center' }}>{review.id}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={`${review.rating} sao`}>
                          <Rating value={review.rating} readOnly size='small' />
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={review.comment}>
                          <span style={{ ...ellipsisStyle, cursor: 'pointer' }}>{review.comment}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                          {review.images ? (
                            (() => {
                              const imageArray = review.images.split(',').filter(img => img.trim() !== '')
                              return imageArray.length > 0 ? (
                                <>
                                  {imageArray.slice(0, 3).map((image, index) => (
                                    <Tooltip key={index} title={`Hình ảnh ${index + 1}`}>
                                      <img
                                        src={image.trim()}
                                        alt={`Review image ${index + 1}`}
                                        width={30}
                                        height={30}
                                        style={{ objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
                                      />
                                    </Tooltip>
                                  ))}
                                  {imageArray.length > 3 && (
                                    <Tooltip title={`Và ${imageArray.length - 3} hình khác`}>
                                      <Chip label={`+${imageArray.length - 3}`} size='small' />
                                    </Tooltip>
                                  )}
                                </>
                              ) : (
                                <span style={{ color: 'gray', fontSize: '0.8rem' }}>Không có</span>
                              )
                            })()
                          ) : (
                            <span style={{ color: 'gray', fontSize: '0.8rem' }}>Không có</span>
                          )}
                        </Box>
                      </TableCell>
                      
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(review.created_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={review.created_by}>
                          <span style={ellipsisStyle}>{review.created_by}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{formatDate(review.updated_at)}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Tooltip title={review.updated_by}>
                          <span style={ellipsisStyle}>{review.updated_by}</span>
                        </Tooltip>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{review.order_id || review.user_id || 'N/A'}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>{review.product_id}</TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <Button variant='outlined' color='warning' size='small' onClick={() => handleEdit(review)}>
                            Sửa
                          </Button>
                          <Button
                            variant='outlined'
                            color='error'
                            size='small'
                            onClick={() => handleDelete(review.id)}
                          >
                            Xoá
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                                 ) : (
                   <TableRow>
                     <TableCell colSpan={11} sx={{ textAlign: 'center' }}>
                       Không có đánh giá nào
                     </TableCell>
                   </TableRow>
                 )}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ mt: 4, mb: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} trong tổng số {totalItems} đánh giá
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Trước
                </Button>
                
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "contained" : "outlined"}
                    onClick={() => setCurrentPage(pageNum)}
                    sx={{ minWidth: 40 }}
                  >
                    {pageNum}
                  </Button>
                ))}
                
                <Button
                  variant="outlined"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
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
                  onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
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
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">/ {totalPages}</InputAdornment>,
                  }}
                />
              </Box>
            </Box>
          )}
        </>
      )}

      {/* Edit Review Dialog */}
      <Dialog open={editModal} onClose={() => setEditModal(false)} maxWidth='md' fullWidth>
        <DialogTitle>Sửa đánh giá</DialogTitle>
        <DialogContent>
          {editReview && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <span>Đánh giá:</span>
                <Rating
                  value={editReview.rating}
                  onChange={(event, newValue) => {
                    if (newValue !== null) {
                      setEditReview({ ...editReview, rating: newValue })
                    }
                  }}
                />
              </Box>
              <TextField
                label='Nội dung đánh giá'
                value={editReview.comment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditReview({ ...editReview, comment: e.target.value })
                }
                multiline
                rows={4}
                fullWidth
              />
              <TextField
                label='Order ID'
                type='number'
                value={editReview.order_id || editReview.user_id || ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditReview({ ...editReview, order_id: Number(e.target.value) })
                }
                fullWidth
              />
              <TextField
                label='Product ID'
                value={editReview.product_id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditReview({ ...editReview, product_id: e.target.value })
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

      {/* Add Review Dialog */}
      <Dialog open={addModal} onClose={() => setAddModal(false)} maxWidth='md' fullWidth>
        <DialogTitle>Thêm đánh giá mới</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <span>Đánh giá:</span>
              <Rating
                value={Number(newReview.rating)}
                onChange={(event, newValue) => {
                  if (newValue !== null) {
                    setNewReview({ ...newReview, rating: newValue.toString() })
                  }
                }}
              />
            </Box>
            <TextField
              label='Nội dung đánh giá'
              value={newReview.comment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
              multiline
              rows={4}
              fullWidth
            />
            <TextField
              label='Product ID'
              value={newReview.product_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewReview({ ...newReview, product_id: e.target.value })
              }
              fullWidth
            />
            <TextField
              label='Order ID'
              type='number'
              value={newReview.order_id}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewReview({ ...newReview, order_id: e.target.value })
              }
              fullWidth
            />
            <TextField
              label='Images (URLs separated by commas)'
              value={newReview.images}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewReview({ ...newReview, images: e.target.value })
              }
              placeholder='url1,url2,url3'
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddModal(false)} disabled={addingReview}>
            Huỷ
          </Button>
          <Button 
            onClick={handleSaveAdd} 
            variant='contained' 
            color='primary'
            disabled={addingReview}
          >
            {addingReview ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ManageReviewPage 