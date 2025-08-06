# Hướng dẫn sử dụng Update Category API

## API Endpoint: PUT /api/v0/categories/update/:id

### Mô tả
API này được sử dụng để cập nhật thông tin phân loại trong hệ thống.

### Thông tin API
- **URL**: `PUT /api/v0/categories/update/:id`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer token`
- **Authentication**: Yêu cầu quyền admin (role = 1)
- **Method**: PUT
- **URL Parameters**: `:id` - ID của phân loại cần cập nhật

### Request Body (Tất cả các trường đều tùy chọn)
```json
{
  "name": "Áo thun nam",
  "code": "TSHIRT_MALE"
}
```

### Response Format (Success)
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Category updated successfully",
  "data": {
    "id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "created_by": "admin",
    "updated_at": "2024-01-01T12:00:00.000Z",
    "updated_by": "admin",
    "code": "TSHIRT_MALE",
    "name": "Áo thun nam"
  },
  "error": null
}
```

### Response Format (Error)
```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Category not found",
  "data": null,
  "error": "NOT_FOUND"
}
```

## Cách sử dụng trong ứng dụng

### 1. Service Layer (src/services/category.ts)
```typescript
export const updateCategory = async (id: number, categoryData: { code?: string; name?: string }) => {
  try {
    // Lấy token từ helper function
    const { accessToken } = getLocalUserData()
    
    if (!accessToken) {
      throw new Error('Không có token xác thực. Vui lòng đăng nhập lại.')
    }

    console.log('Updating category with ID:', id)
    console.log('Update data:', categoryData)
    console.log('Using token:', accessToken ? 'Token exists' : 'No token')

    const res = await axios.put(`${CONFIG_API.CATEGORY.UPDATE_CATEGORY}/${id}`, categoryData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    console.log('Update API Response:', res.data)
    return res.data
  } catch (error: any) {
    console.error('Update category error:', error)
    
    // Xử lý các loại lỗi cụ thể
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401) {
        throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại.')
      } else if (status === 403) {
        throw new Error('Bạn không có quyền cập nhật phân loại.')
      } else if (status === 404) {
        throw new Error('Không tìm thấy phân loại cần cập nhật.')
      } else if (status === 409) {
        throw new Error('Mã phân loại đã tồn tại.')
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
      throw new Error(error.message || 'Có lỗi xảy ra khi cập nhật phân loại.')
    }
  }
}

export const categoryService = {
  getCategories,
  createCategory,
  updateCategory
}
```

### 2. Hook Layer (src/hooks/useCategory.tsx)
```typescript
const updateCategory = useCallback(async (id: number, categoryData: { code?: string; name?: string }) => {
  setLoading(true)
  setError(null)
  
  try {
    console.log('Hook: Updating category with ID:', id)
    console.log('Hook: Update data:', categoryData)
    
    const response = await categoryService.updateCategory(id, categoryData)
    
    console.log('Hook: Update API response:', response)
    
    if (response.status === 'success') {
      // Refresh danh sách categories sau khi cập nhật thành công
      await fetchCategories()
      return response
    } else {
      const errorMessage = response.message || 'Có lỗi xảy ra khi cập nhật phân loại'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  } catch (err: any) {
    console.error('Hook: Update category error:', err)
    
    const errorMessage = err.message || 'Có lỗi xảy ra khi cập nhật phân loại'
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
  updateCategory
}
```

### 3. Component Layer (src/views/pages/manage-system/category/index.tsx)
```typescript
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
```

## Cấu hình API (src/configs/api.ts)
```typescript
CATEGORY: {
  INDEX: `${BASE_URL}/categories`,
  GET_CATEGORIES: `${BASE_URL}/categories/get-categories`,
  CREATE_CATEGORY: `${BASE_URL}/categories/create-category`,
  UPDATE_CATEGORY: `${BASE_URL}/categories/update`
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
- Kiểm tra có thay đổi gì không trước khi gửi request
- Validate input trước khi submit
- Chỉ gửi các trường có thay đổi

### Server-side validation:
- Kiểm tra category có tồn tại không
- Validate dữ liệu đầu vào
- Kiểm tra quyền admin
- Kiểm tra code có unique không (nếu thay đổi code)

## Error Handling

### Các lỗi có thể xảy ra:
1. **401 Unauthorized**: Token không hợp lệ hoặc hết hạn
2. **403 Forbidden**: User không có quyền admin
3. **404 Not Found**: Category không tồn tại
4. **400 Bad Request**: Dữ liệu không hợp lệ
5. **409 Conflict**: Code đã tồn tại (nếu thay đổi code)
6. **500 Internal Server Error**: Lỗi server

### Cách xử lý:
```typescript
try {
  await updateCategory(categoryId, updateData)
  // Success handling
} catch (err: any) {
  if (err.response?.status === 401) {
    // Redirect to login
    window.location.href = '/login'
  } else if (err.response?.status === 403) {
    alert('Bạn không có quyền cập nhật phân loại')
  } else if (err.response?.status === 404) {
    alert('Không tìm thấy phân loại cần cập nhật')
  } else if (err.response?.status === 409) {
    alert('Mã phân loại đã tồn tại')
  } else {
    alert(err.message || 'Có lỗi xảy ra')
  }
}
```

## Test API

Sử dụng file `test-update-category-api.html` để test API:
1. Mở file trong trình duyệt
2. Nhập Bearer token
3. Nhập ID phân loại cần cập nhật
4. Nhập các trường cần cập nhật (tùy chọn)
5. Click "Test API"
6. Kiểm tra kết quả

## Lưu ý

- API yêu cầu authentication với quyền admin
- Tất cả các trường trong request body đều tùy chọn
- Chỉ gửi các trường có thay đổi để tối ưu performance
- Sau khi cập nhật thành công, danh sách categories sẽ được refresh
- Modal sẽ tự động đóng và hiển thị thông báo thành công
- Có validation để kiểm tra có thay đổi gì không trước khi gửi request 