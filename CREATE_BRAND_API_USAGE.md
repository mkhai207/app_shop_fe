# API Tạo Thương Hiệu - Hướng Dẫn Sử Dụng

## Thông Tin API

**Endpoint:** `POST /api/v0/brands/create-brand`

**Headers cần thiết:**
- `Authorization: Bearer token` (cần đăng nhập với quyền admin - role = 1)
- `Content-Type: application/json`

**Body request:**
```json
{
  "name": "Nike"
}
```

## Cách Sử Dụng

### 1. Trong Frontend (React/Next.js)

#### Service Layer (`src/services/brand.ts`)
```typescript
import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'
import { TCreateBrand } from 'src/types/brand'

export const createBrand = async (data: TCreateBrand) => {
  try {
    const res = await axios.post(`${CONFIG_API.BRAND.INDEX}/create-brand`, data, {
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
import { createBrand } from 'src/services/brand'
import { TCreateBrand } from 'src/types/brand'

export const useBrand = () => {
  const createNewBrand = useCallback(async (data: TCreateBrand) => {
    return await createBrand(data)
  }, [])

  return {
    createNewBrand
  }
}
```

#### Component Usage
```typescript
const { createNewBrand } = useBrand()

const handleCreateBrand = async () => {
  try {
    const response = await createNewBrand({ name: "Nike" })
    
    if (response.error) {
      throw new Error(response.error.message)
    }
    
    // Handle success
    console.log('Brand created successfully:', response)
  } catch (error) {
    // Handle error
    console.error('Error creating brand:', error)
  }
}
```

### 2. Test với cURL

```bash
curl -X POST http://localhost:8080/api/v0/brands/create-brand \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Nike"
  }'
```

### 3. Test với JavaScript/Fetch

```javascript
const createBrand = async (brandName, token) => {
  try {
    const response = await fetch('http://localhost:8080/api/v0/brands/create-brand', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: brandName
      })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to create brand')
    }
    
    return data
  } catch (error) {
    throw error
  }
}

// Sử dụng
createBrand('Nike', 'your-admin-token')
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error))
```

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "Brand created successfully",
  "data": {
    "id": "1",
    "name": "Nike",
    "created_at": "2024-01-01T00:00:00Z",
    "created_by": "admin",
    "updated_at": "2024-01-01T00:00:00Z",
    "updated_by": "admin"
  }
}
```

### Error Response (400/401/403/500)
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

### 3. Bad Request (400)
- **Nguyên nhân:** 
  - Thiếu trường `name`
  - Tên thương hiệu rỗng
  - Tên thương hiệu đã tồn tại
- **Giải pháp:** Kiểm tra dữ liệu đầu vào

### 4. Internal Server Error (500)
- **Nguyên nhân:** Lỗi server
- **Giải pháp:** Liên hệ admin để kiểm tra logs

## Validation Rules

1. **Tên thương hiệu (`name`):**
   - Bắt buộc (required)
   - Không được rỗng
   - Độ dài tối đa: 255 ký tự
   - Không được trùng với thương hiệu đã tồn tại

## Security Considerations

1. **Authentication:** Luôn sử dụng Bearer token hợp lệ
2. **Authorization:** Chỉ admin (role = 1) mới có quyền tạo thương hiệu
3. **Input Validation:** Validate dữ liệu đầu vào ở cả frontend và backend
4. **Rate Limiting:** Có thể áp dụng rate limiting để tránh spam

## Testing

Sử dụng file `test-create-brand-api.html` để test API:

1. Mở file trong trình duyệt
2. Nhập Base URL: `http://localhost:8080/api/v0`
3. Nhập Bearer Token của admin
4. Nhập tên thương hiệu cần tạo
5. Click "Test Tạo Thương Hiệu"

## Implementation Status

✅ **Đã hoàn thành:**
- Service layer (`src/services/brand.ts`)
- Hook (`src/hooks/useBrand.tsx`)
- Component integration (`src/views/pages/manage-system/brand/index.tsx`)
- Test file (`test-create-brand-api.html`)
- Documentation

🔄 **Đang phát triển:**
- Update brand API
- Delete brand API
- Error handling improvements
- Loading states
- Success notifications 