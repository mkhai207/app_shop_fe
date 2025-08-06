# API Cập Nhật Thương Hiệu - Hướng Dẫn Sử Dụng

## Thông Tin API

**Endpoint:** `PUT /api/v0/brands/update/:id`

**Headers cần thiết:**
- `Authorization: Bearer token` (cần đăng nhập với quyền admin - role = 1)
- `Content-Type: application/json`

**URL Parameters:**
- `:id` - ID của thương hiệu cần cập nhật

**Body request (tùy chọn):**
```json
{
  "name": "Nike Sport"
}
```

## Cách Sử Dụng

### 1. Trong Frontend (React/Next.js)

#### Service Layer (`src/services/brand.ts`)
```typescript
import instanceAxios from 'src/helpers/axios'
import { CONFIG_API } from 'src/configs/api'
import { TUpdateBrand } from 'src/types/brand'

export const updateBrand = async (id: string, data: TUpdateBrand) => {
  try {
    const res = await instanceAxios.put(`${CONFIG_API.BRAND.INDEX}/update/${id}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return res.data
  } catch (error) {
    return error
  }
}
```

#### Hook (`src/hooks/useBrand.tsx`)
```typescript
import { useCallback } from 'react'
import { updateBrand } from 'src/services/brand'
import { TUpdateBrand } from 'src/types/brand'

export const useBrand = () => {
  const updateExistingBrand = useCallback(async (id: string, data: TUpdateBrand) => {
    return await updateBrand(id, data)
  }, [])

  return {
    updateExistingBrand
  }
}
```

#### Component Usage
```typescript
const { updateExistingBrand } = useBrand()

const handleUpdateBrand = async (brandId: string, newName: string) => {
  try {
    const response = await updateExistingBrand(brandId, { 
      id: brandId, 
      name: newName 
    })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
    
    // Handle success
    console.log('Brand updated successfully:', response)
  } catch (error) {
    // Handle error
    console.error('Error updating brand:', error)
  }
}
```

### 2. Test với cURL

```bash
curl -X PUT http://localhost:8080/api/v0/brands/update/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Nike Sport"
  }'
```

### 3. Test với JavaScript/Fetch

```javascript
const updateBrand = async (brandId, newName, token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/v0/brands/update/${brandId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newName
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update brand')
    }
    
    return data
  } catch (error) {
    throw error
  }
}

// Sử dụng
updateBrand('1', 'Nike Sport', 'your-admin-token')
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error))
```

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "Brand updated successfully",
  "data": {
    "id": "1",
    "name": "Nike Sport",
    "created_at": "2024-01-01T00:00:00Z",
    "created_by": "admin",
    "updated_at": "2024-01-15T10:30:00Z",
    "updated_by": "admin"
  }
}
```

### Error Response (400/401/403/404/500)
```json
{
  "success": false,
  "message": "Error message",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

## Các Lỗi Thường Gặp

### 1. Unauthorized (401)
- **Nguyên nhân:** Token không hợp lệ hoặc thiếu token
- **Giải pháp:** Đảm bảo đăng nhập với tài khoản admin và token còn hiệu lực

### 2. Forbidden (403)
- **Nguyên nhân:** Không có quyền admin (role != 1)
- **Giải pháp:** Sử dụng tài khoản có role = 1

### 3. Not Found (404)
- **Nguyên nhân:** ID thương hiệu không tồn tại
- **Giải pháp:** Kiểm tra ID thương hiệu có đúng không

### 4. Bad Request (400)
- **Nguyên nhân:** 
  - Thiếu trường `name`
  - Tên thương hiệu rỗng
  - Tên thương hiệu đã tồn tại
- **Giải pháp:** Kiểm tra dữ liệu đầu vào

### 5. Internal Server Error (500)
- **Nguyên nhân:** Lỗi server
- **Giải pháp:** Liên hệ admin để kiểm tra logs

## Validation Rules

1. **ID thương hiệu:**
   - Bắt buộc (required)
   - Phải tồn tại trong hệ thống
   - Định dạng hợp lệ

2. **Tên thương hiệu (`name`):**
   - Bắt buộc (required)
   - Không được rỗng
   - Độ dài tối đa: 255 ký tự
   - Không được trùng với thương hiệu khác

## Security Considerations

1. **Authentication:** Luôn sử dụng Bearer token hợp lệ
2. **Authorization:** Chỉ admin (role = 1) mới có quyền cập nhật thương hiệu
3. **Input Validation:** Validate dữ liệu đầu vào ở cả frontend và backend
4. **ID Validation:** Kiểm tra ID thương hiệu có tồn tại không
5. **Rate Limiting:** Có thể áp dụng rate limiting để tránh spam

## Testing

Sử dụng file `test-update-brand-api.html` để test API:

1. Mở file trong trình duyệt
2. Nhập Base URL: `http://localhost:8080/api/v0`
3. Nhập Bearer Token của admin
4. Nhập ID thương hiệu cần cập nhật
5. Nhập tên thương hiệu mới
6. Click "Test Cập Nhật Thương Hiệu"

## Implementation Status

✅ **Đã hoàn thành:**
- Service layer (`src/services/brand.ts`)
- Hook (`src/hooks/useBrand.tsx`)
- Component integration (`src/views/pages/manage-system/brand/index.tsx`)
- Test file (`test-update-brand-api.html`)
- Documentation

🔄 **Đang phát triển:**
- Delete brand API
- Bulk operations
- Advanced filtering và search
- Export/Import functionality 