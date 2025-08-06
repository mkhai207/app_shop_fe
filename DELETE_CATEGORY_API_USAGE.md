# Hướng dẫn sử dụng Delete Category API

## API Endpoint: DELETE /api/v0/categories/delete/:id

### Mô tả
API này được sử dụng để xóa phân loại khỏi hệ thống. **Đây là HARD DELETE** - xóa vĩnh viễn khỏi database và không thể khôi phục.

### Thông tin API
- **URL**: `DELETE /api/v0/categories/delete/:id`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer token`
- **Authentication**: Yêu cầu quyền admin (role = 1)
- **Method**: DELETE
- **URL Parameters**: `:id` - ID của phân loại cần xóa
- **Body**: Không cần body request

### Điều kiện xóa
1. **Chỉ admin (role = 1)** mới có thể xóa phân loại
2. **Phân loại phải tồn tại** với ID được cung cấp
3. **Không thể xóa** nếu có sản phẩm nào đang sử dụng phân loại đó
4. **Hard Delete** - Xóa thực sự khỏi database, không thể khôi phục

### Response Format (Success)
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Category deleted successfully",
  "data": {
    "id": 1,
    "code": "SHIRT",
    "name": "Áo sơ mi",
    "deleted_at": "2024-01-01T12:00:00.000Z"
  },
  "error": null
}
```

### Response Format (Error)
```json
{
  "status": "error",
  "statusCode": 409,
  "message": "Cannot delete category because it is being used by products",
  "data": null,
  "error": "CONFLICT"
}
```

## Cách sử dụng trong ứng dụng

### 1. Service Layer (src/services/category.ts)
```typescript
export const deleteCategory = async (id: number) => {
  try {
    // Lấy token từ helper function
    const { accessToken } = getLocalUserData()
    
    if (!accessToken) {
      throw new Error('Không có token xác thực. Vui lòng đăng nhập lại.')
    }

    console.log('Deleting category with ID:', id)
    console.log('Using token:', accessToken ? 'Token exists' : 'No token')

    const res = await axios.delete(`${CONFIG_API.CATEGORY.DELETE_CATEGORY}/${id}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    console.log('Delete API Response:', res.data)
    return res.data
  } catch (error: any) {
    console.error('Delete category error:', error)
    
    // Xử lý các loại lỗi cụ thể
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401) {
        throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại.')
      } else if (status === 403) {
        throw new Error('Bạn không có quyền xóa phân loại.')
      } else if (status === 404) {
        throw new Error('Không tìm thấy phân loại cần xóa.')
      } else if (status === 409) {
        throw new Error('Không thể xóa phân loại này vì có sản phẩm đang sử dụng.')
      } else if (status === 400) {
        throw new Error(data?.message || 'Dữ liệu không hợp lệ.')
      } else if (status === 500) {
        const serverError = data?.message || data?.error || 'Lỗi server nội bộ'
        throw new Error(`Lỗi server (500): ${serverError}. Vui lòng liên hệ admin hoặc thử lại sau.`)
      } else {
        throw new Error(data?.message || `Lỗi server: ${status}`)
      }
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.')
    } else {
      throw new Error(error.message || 'Có lỗi xảy ra khi xóa phân loại.')
    }
  }
}

export const categoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
}
```

### 2. Hook Layer (src/hooks/useCategory.tsx)
```typescript
const deleteCategory = useCallback(async (id: number) => {
  setLoading(true)
  setError(null)
  
  try {
    console.log('Hook: Deleting category with ID:', id)
    
    const response = await categoryService.deleteCategory(id)
    
    console.log('Hook: Delete API response:', response)
    
    if (response.status === 'success') {
      // Refresh danh sách categories sau khi xóa thành công
      await fetchCategories()
      return response
    } else {
      const errorMessage = response.message || 'Có lỗi xảy ra khi xóa phân loại'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  } catch (err: any) {
    console.error('Hook: Delete category error:', err)
    
    const errorMessage = err.message || 'Có lỗi xảy ra khi xóa phân loại'
    setError(errorMessage)
    throw new Error(errorMessage)
  } finally {
    setLoading(false)
  }
}, [fetchCategories])

return {
  categories,
  loading,
  error,
  fetchCategories,
  updateCategories,
  createCategory,
  updateCategory,
  deleteCategory
}
```

### 3. Component Layer (src/views/pages/manage-system/category/index.tsx)
```typescript
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
```

## Cấu hình API (src/configs/api.ts)
```typescript
CATEGORY: {
  INDEX: `${BASE_URL}/categories`,
  GET_CATEGORIES: `${BASE_URL}/categories/get-categories`,
  CREATE_CATEGORY: `${BASE_URL}/categories/create-category`,
  UPDATE_CATEGORY: `${BASE_URL}/categories/update`,
  DELETE_CATEGORY: `${BASE_URL}/categories/delete`
}
```

## Authentication

### Lấy token:
1. Đăng nhập vào ứng dụng với tài khoản admin
2. Mở Developer Tools (F12)
3. Vào tab Application/Storage
4. Tìm localStorage > accessToken
5. Copy giá trị token

### Kiểm tra quyền:
- User phải có role = 1 (admin)
- Token phải còn hiệu lực
- Token phải được gửi trong header Authorization

## Validation

### Client-side validation:
- Hiển thị confirm dialog với thông tin chi tiết
- Cảnh báo về tính chất vĩnh viễn của thao tác
- Hiển thị tên và mã phân loại trong confirm dialog

### Server-side validation:
- Kiểm tra category có tồn tại không
- Kiểm tra quyền admin
- Kiểm tra có sản phẩm nào đang sử dụng không
- Thực hiện hard delete

## Error Handling

### Các lỗi có thể xảy ra:
1. **401 Unauthorized**: Token không hợp lệ hoặc hết hạn
2. **403 Forbidden**: User không có quyền admin
3. **404 Not Found**: Category không tồn tại
4. **409 Conflict**: Không thể xóa vì có sản phẩm đang sử dụng
5. **500 Internal Server Error**: Lỗi server

### Cách xử lý:
```typescript
try {
  await deleteCategory(categoryId)
  // Success handling
} catch (err: any) {
  if (err.response?.status === 401) {
    // Redirect to login
    window.location.href = '/login'
  } else if (err.response?.status === 403) {
    alert('Bạn không có quyền xóa phân loại')
  } else if (err.response?.status === 404) {
    alert('Không tìm thấy phân loại cần xóa')
  } else if (err.response?.status === 409) {
    alert('Không thể xóa phân loại này vì có sản phẩm đang sử dụng')
  } else {
    alert(err.message || 'Có lỗi xảy ra')
  }
}
```

## Test API

Sử dụng file `test-delete-category-api.html` để test API:
1. Mở file trong trình duyệt
2. Nhập Bearer token
3. Nhập ID phân loại cần xóa
4. Click "Test Delete API"
5. Xác nhận thao tác xóa
6. Kiểm tra kết quả

## Lưu ý quan trọng

### ⚠️ CẢNH BÁO:
- **HARD DELETE**: Dữ liệu sẽ bị xóa vĩnh viễn khỏi database
- **Không thể khôi phục**: Sau khi xóa sẽ mất hẳn
- **Kiểm tra sản phẩm**: Chỉ xóa được khi không có sản phẩm nào sử dụng
- **Quyền admin**: Chỉ admin mới có thể xóa
- **Test cẩn thận**: Nên test trên dữ liệu test trước

### UI/UX:
- Hiển thị confirm dialog với thông tin chi tiết
- Cảnh báo về tính chất vĩnh viễn
- Hiển thị tên và mã phân loại trong confirm
- Refresh data sau khi xóa thành công
- Hiển thị thông báo thành công/thất bại

### Security:
- Kiểm tra token authentication
- Yêu cầu quyền admin (role = 1)
- Validate category tồn tại
- Kiểm tra ràng buộc với sản phẩm 