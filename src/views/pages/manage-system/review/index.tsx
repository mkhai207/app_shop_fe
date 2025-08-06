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
  SelectChangeEvent,
  Rating,
  Chip,
  Typography,
  InputAdornment
} from '@mui/material'
import { NextPage } from 'next'
import { reviewService } from 'src/services/review'
import { TReview } from 'src/types/review'

// Types

type TProps = {}

const ManageReviewPage: NextPage<TProps> = () => {
  // State declarations
  const [reviews, setReviews] = useState<TReview[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [filterRating, setFilterRating] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const itemsPerPage = 10

  // Reset currentPage when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterRating])

  // Load reviews from API
  useEffect(() => {
    const loadReviews = async () => {
      console.log('🔄 Loading reviews from API...')
      console.log('📊 Request params:', { 
        page: currentPage, 
        limit: itemsPerPage, 
        search: searchTerm || 'none', 
        rating: filterRating || 'all' 
      })
      
      setLoading(true)
      setError('')
      
      try {
        // Call API without authentication requirement
        const queryParams: any = {
          page: currentPage,
          limit: itemsPerPage
        }
        
        // Add optional parameters only if they have values
        if (searchTerm && searchTerm.trim()) {
          queryParams.search = searchTerm.trim()
        }
        
        if (filterRating) {
          queryParams.rating = Number(filterRating)
        }
        
        console.log('🚀 Calling API with params:', queryParams)
        const response = await reviewService.getReviews(queryParams)
        
        console.log('✅ API Response received:', {
          status: response.status,
          statusCode: response.statusCode,
          message: response.message,
          dataLength: response.data?.length || 0,
          meta: response.meta,
          hasData: !!response.data,
          hasMeta: !!response.meta
        })
        
        // Handle successful response
        if (response.status === 'success' || response.statusCode === 200) {
          const reviewData = response.data || []
          const metaData = response.meta || { totalItems: 0, totalPages: 1, currentPage: 1 }
          
          setReviews(reviewData)
          setTotalItems(metaData.totalItems || 0)
          setTotalPages(metaData.totalPages || 1)
          
          console.log('🎯 Reviews state updated:', {
            reviewsCount: reviewData.length,
            totalItems: metaData.totalItems || 0,
            totalPages: metaData.totalPages || 1,
            currentPage: metaData.currentPage || currentPage
          })
        } else {
          // Handle API error response
          console.warn('⚠️ API returned error:', response.message)
          setError(response.message || 'API returned an error')
          setReviews([])
          setTotalItems(0)
          setTotalPages(0)
        }
        
      } catch (err: any) {
        console.error('❌ API call failed:', {
          message: err.message,
          status: err.status,
          response: err.response?.data
        })
        
        setError(`Lỗi kết nối API: ${err.message || 'Unknown error'}`)
        setReviews([])
        setTotalItems(0)
        setTotalPages(0)
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
  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xoá đánh giá này?')) {
      return
    }
    
    setDeletingId(id)
    try {
      console.log('🔄 Deleting review with id:', id)
      await reviewService.deleteReview(id)
      console.log('✅ Review deleted successfully')
      
      // Refresh the reviews list after successful deletion
      const queryParams: any = {
        page: currentPage,
        limit: itemsPerPage
      }
      
      if (searchTerm && searchTerm.trim()) {
        queryParams.search = searchTerm.trim()
      }
      
      if (filterRating) {
        queryParams.rating = Number(filterRating)
      }
      
      const response = await reviewService.getReviews(queryParams)
      
      // Handle refresh response
      if (response.status === 'success' || response.statusCode === 200) {
        const reviewData = response.data || []
        const metaData = response.meta || { totalItems: 0, totalPages: 1, currentPage: 1 }
        
        setReviews(reviewData)
        setTotalItems(metaData.totalItems || 0)
        setTotalPages(metaData.totalPages || 1)
        
        console.log('🔄 Reviews refreshed after delete:', {
          remainingReviews: reviewData.length,
          totalItems: metaData.totalItems || 0
        })
      }
      
      // Show success message
      alert('Xóa đánh giá thành công!')
    } catch (error: any) {
      console.error('❌ Failed to delete review:', error)
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        alert('Lỗi xác thực: Vui lòng đăng nhập lại với quyền admin')
      } else if (error.response?.status === 403) {
        alert('Lỗi quyền truy cập: Bạn không có quyền xóa đánh giá này')
      } else if (error.response?.status === 404) {
        alert('Lỗi: Không tìm thấy đánh giá cần xóa')
      } else {
        alert('Lỗi khi xóa đánh giá: ' + (error.message || 'Unknown error'))
      }
    } finally {
      setDeletingId(null)
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

       {/* Debug Info */}
       <Box 
         sx={{ 
           mb: 2,
           p: 2,
           borderRadius: 1,
           backgroundColor: '#f5f5f5',
           border: '1px solid #ddd',
           fontSize: '0.85rem'
         }}
       >
         <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
           Debug Info:
         </Typography>
         <Typography variant="body2">
           Loading: {loading ? 'Yes' : 'No'} | 
           Reviews Count: {reviews.length} | 
           Total Items: {totalItems} | 
           Total Pages: {totalPages} | 
           Current Page: {currentPage} | 
           Error: {error || 'None'}
         </Typography>
         <Typography variant="body2" sx={{ mt: 1, fontSize: '0.75rem', color: '#666' }}>
           API Endpoint: /api/v0/reviews/get-reviews | 
           Delete API: /api/v0/reviews/delete-review/:id | 
           Search Term: {searchTerm || 'None'} | 
           Filter Rating: {filterRating || 'All'}
         </Typography>
       </Box>

      <Box sx={{ display: 'flex', mb: 3, gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
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
                        <Button
                          variant='outlined'
                          color='error'
                          size='small'
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                        >
                          {deletingId === review.id ? 'Đang xóa...' : 'Xóa'}
                        </Button>
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


    </Box>
  )
}

export default ManageReviewPage 