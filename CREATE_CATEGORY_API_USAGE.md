# Hướng dẫn sử dụng Create Category API

## API Endpoint: POST /api/v0/categories/create-category

### Mô tả
API này được sử dụng để tạo phân loại mới trong hệ thống.

### Thông tin API
- **URL**: `POST /api/v0/categories/create-category`
- **Headers**: 
  - `Content-Type: application/json`
  - `Authorization: Bearer token`
- **Authentication**: Yêu cầu quyền admin (role = 1)
- **Method**: POST

### Request Body
```json
{
  "code": "ELECTRONICS",
  "name": "Điện tử"
}
```

### Response Format (Success)
```json
{
  "status": "success",
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "id": "5",
    "created_at": "2024-01-01T00:00:00.000Z",
    "created_by": "admin",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "updated_by": "admin",
    "code": "ELECTRONICS",
    "name": "Điện tử"
  },
  "error": null
}
```

### Response Format (Error)
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Category code already exists",
  "data": null,
  "error": "VALIDATION_ERROR"
}
```

## Cách sử dụng trong ứng dụng

### 1. Service Layer (src/services/category.ts)
```typescript
export const createCategory = async (categoryData: { code: string; name: string }) => {
  try {
    // Lấy token từ localStorage hoặc context
    const token = localStorage.getItem('accessToken')
    
    if (!token) {
      throw new Error('Không có token xác thực')
    }

    const res = await axios.post(CONFIG_API.CATEGORY.CREATE_CATEGORY, categoryData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return res.data
  } catch (error) {
    throw error
  }
}

export const categoryService = {
  getCategories,
  createCategory
}
```

### 2. Hook Layer (src/hooks/useCategory.tsx)
```typescript
const createCategory = useCallback(async (categoryData: { code: string; name: string }) => {
  setLoading(true)
  setError(null)
  
  try {
    const response = await categoryService.createCategory(categoryData)
    
    if (response.status === 'success') {
      // Refresh danh sách categories sau khi tạo thành công
      await fetchCategories()
      return response
    } else {
      setError(response.message || 'Có lỗi xảy ra khi tạo phân loại')
      throw new Error(response.message || 'Có lỗi xảy ra khi tạo phân loại')
    }
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tạo phân loại'
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
  createCategory
}
```

### 3. Component Layer (src/views/pages/manage-system/category/index.tsx)
```typescript
const handleSaveAdd = async () => {
  try {
    // Validate input
    if (!newCategory.code.trim() || !newCategory.name.trim()) {
      alert('Vui lòng nhập đầy đủ mã và tên phân loại')
      return
    }

    // Call API to create category
    await createCategory({
      code: newCategory.code.trim(),
      name: newCategory.name.trim()
    })

    // Close modal and reset form
    setAddModal(false)
    setNewCategory({ code: '', name: '' })
    
    // Show success message
    alert('Tạo phân loại thành công!')
    
  } catch (err: any) {
    console.error('Error creating category:', err)
    alert(err.message || 'Có lỗi xảy ra khi tạo phân loại')
  }
}
```

## Cấu hình API (src/configs/api.ts)
```typescript
CATEGORY: {
  INDEX: `${BASE_URL}/categories`,
  GET_CATEGORIES: `${BASE_URL}/categories/get-categories`,
  CREATE_CATEGORY: `${BASE_URL}/categories/create-category`
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
- Code không được để trống
- Name không được để trống
- Code và name phải được trim()

### Server-side validation:
- Code phải unique
- Name không được quá dài
- User phải có quyền admin

## Error Handling

### Các lỗi có thể xảy ra:
1. **401 Unauthorized**: Token không hợp lệ hoặc hết hạn
2. **403 Forbidden**: User không có quyền admin
3. **400 Bad Request**: Dữ liệu không hợp lệ
4. **409 Conflict**: Code đã tồn tại
5. **500 Internal Server Error**: Lỗi server

### Cách xử lý:
```typescript
try {
  await createCategory(categoryData)
  // Success handling
} catch (err: any) {
  if (err.response?.status === 401) {
    // Redirect to login
    window.location.href = '/login'
  } else if (err.response?.status === 403) {
    alert('Bạn không có quyền tạo phân loại')
  } else if (err.response?.status === 409) {
    alert('Mã phân loại đã tồn tại')
  } else {
    alert(err.message || 'Có lỗi xảy ra')
  }
}
```

## Test API

Sử dụng file `test-create-category-api.html` để test API:
1. Mở file trong trình duyệt
2. Nhập Bearer token
3. Nhập mã và tên phân loại
4. Click "Test API"
5. Kiểm tra kết quả

## Lưu ý

- API yêu cầu authentication với quyền admin
- Sau khi tạo thành công, danh sách categories sẽ được refresh
- Modal sẽ tự động đóng và form sẽ được reset
- Hiển thị thông báo thành công/thất bại cho user 