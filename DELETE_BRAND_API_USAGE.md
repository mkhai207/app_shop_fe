# API Xóa Thương Hiệu - Hướng Dẫn Sử Dụng

## Thông Tin API

**Endpoint:** `DELETE /api/v0/brands/delete/:id`

**Headers cần thiết:**
- `Authorization: Bearer token` (cần đăng nhập với quyền admin - role = 1)
- `Content-Type: application/json`

**URL Parameters:**
- `:id` - ID của thương hiệu cần xóa

**Body request:**
Không cần body request

## Điều Kiện Và Cảnh Báo

### ⚠️ Điều Kiện Bắt Buộc:
1. **Quyền Admin:** Chỉ admin (role = 1) mới có thể xóa thương hiệu
2. **Thương Hiệu Tồn Tại:** Thương hiệu phải tồn tại với ID được cung cấp
3. **Không Có Sản Phẩm Sử Dụng:** Không thể xóa thương hiệu nếu có sản phẩm nào đang sử dụng thương hiệu đó

### 🚨 Cảnh Báo Quan Trọng:
- **Hard Delete:** Xóa thực sự khỏi database, không thể khôi phục
- **Không Thể Hoàn Tác:** Hành động này không thể hoàn tác
- **Ảnh Hưởng Dữ Liệu:** Có thể ảnh hưởng đến các sản phẩm liên quan

## Cách Sử Dụng

### 1. Trong Frontend (React/Next.js)

#### Service Layer (`src/services/brand.ts`)
```typescript
import instanceAxios from 'src/helpers/axios'
import { CONFIG_API } from 'src/configs/api'

export const deleteBrand = async (id: string) => {
  try {
    const res = await instanceAxios.delete(`${CONFIG_API.BRAND.INDEX}/delete/${id}`, {
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
import { deleteBrand } from 'src/services/brand'

export const useBrand = () => {
  const deleteExistingBrand = useCallback(async (id: string) => {
    return await deleteBrand(id)
  }, [])

  return {
    deleteExistingBrand
  }
}
```

#### Component Usage
```typescript
const { deleteExistingBrand } = useBrand()

const handleDeleteBrand = async (brandId: string, brandName: string) => {
  // Double confirmation
  if (!window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu "${brandName}"? Hành động này không thể hoàn tác.`)) {
    return
  }

  try {
    const response = await deleteExistingBrand(brandId)
    
    if (response.error) {
      throw new Error(response.error.message)
    }
    
    // Handle success
    console.log('Brand deleted successfully:', response)
  } catch (error) {
    // Handle error
    console.error('Error deleting brand:', error)
  }
}
```

### 2. Test với cURL

```bash
curl -X DELETE http://localhost:8080/api/v0/brands/delete/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 3. Test với JavaScript/Fetch

```javascript
const deleteBrand = async (brandId, token) => {
  try {
    const response = await fetch(`http://localhost:8080/api/v0/brands/delete/${brandId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete brand')
    }
    
    return data
  } catch (error) {
    throw error
  }
}

// Sử dụng
deleteBrand('1', 'your-admin-token')
  .then(result => console.log('Success:', result))
  .catch(error => console.error('Error:', error))
```

## Response Format

### Success Response (200)
```json
{
  "success": true,
  "message": "Brand deleted successfully",
  "data": {
    "id": "1",
    "name": "Nike",
    "deleted_at": "2024-01-15T10:30:00Z",
    "deleted_by": "admin"
  }
}
```

### Error Response (400/401/403/404/409/500)
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

### 4. Conflict (409)
- **Nguyên nhân:** Thương hiệu đang được sử dụng bởi sản phẩm
- **Giải pháp:** Xóa hoặc chuyển đổi tất cả sản phẩm sử dụng thương hiệu này trước

### 5. Bad Request (400)
- **Nguyên nhân:** 
  - ID thương hiệu không hợp lệ
  - Thiếu thông tin cần thiết
- **Giải pháp:** Kiểm tra dữ liệu đầu vào

### 6. Internal Server Error (500)
- **Nguyên nhân:** Lỗi server
- **Giải pháp:** Liên hệ admin để kiểm tra logs

## Validation Rules

1. **ID thương hiệu:**
   - Bắt buộc (required)
   - Phải tồn tại trong hệ thống
   - Định dạng hợp lệ

2. **Quyền truy cập:**
   - Chỉ admin (role = 1) mới có quyền xóa
   - Token phải hợp lệ và còn hiệu lực

3. **Ràng buộc dữ liệu:**
   - Không có sản phẩm nào đang sử dụng thương hiệu
   - Không có dữ liệu liên quan khác

## Security Considerations

1. **Authentication:** Luôn sử dụng Bearer token hợp lệ
2. **Authorization:** Chỉ admin (role = 1) mới có quyền xóa thương hiệu
3. **Confirmation:** Luôn yêu cầu xác nhận trước khi xóa
4. **Audit Trail:** Ghi lại thông tin người xóa và thời gian xóa
5. **Data Integrity:** Kiểm tra ràng buộc dữ liệu trước khi xóa
6. **Backup:** Đảm bảo có backup trước khi thực hiện hard delete

## Testing

Sử dụng file `test-delete-brand-api.html` để test API:

1. Mở file trong trình duyệt
2. Nhập Base URL: `http://localhost:8080/api/v0`
3. Nhập Bearer Token của admin
4. Nhập ID thương hiệu cần xóa
5. Nhập tên thương hiệu để xác nhận
6. Click "Test Xóa Thương Hiệu"
7. Xác nhận bằng cách nhập "DELETE"

## Implementation Status

✅ **Đã hoàn thành:**
- Service layer (`src/services/brand.ts`)
- Hook (`src/hooks/useBrand.tsx`)
- Component integration (`src/views/pages/manage-system/brand/index.tsx`)
- Test file (`test-delete-brand-api.html`)
- Documentation
- Double confirmation UI
- Loading states và error handling
- Success/error notifications

🔄 **Đang phát triển:**
- Bulk delete operations
- Soft delete option
- Advanced filtering và search
- Export/Import functionality
- Audit trail cho các thay đổi
- Version control cho thương hiệu 