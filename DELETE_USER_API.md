# Hướng dẫn sử dụng API vô hiệu hóa người dùng

## Tổng quan
API này cho phép vô hiệu hóa người dùng (soft delete) trong hệ thống. Người dùng sẽ không thể đăng nhập nhưng dữ liệu vẫn được giữ lại. API yêu cầu access token với quyền admin để xác thực.

## Endpoint
```
PUT http://localhost:8080/api/v0/users/update/:id
```

## Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## URL Parameters
- `:id` - ID của người dùng cần vô hiệu hóa

## Body Request
```json
{
  "active": false
}
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "User updated successfully",
  "data": {
    "id": "24",
    "created_at": "2025-01-27T10:30:00.000Z",
    "created_by": "admin",
    "updated_at": "2025-01-27T12:30:00.000Z",
    "updated_by": "admin",
    "active": false,
    "avatar": "https://example.com/avatar.jpg",
    "birthday": "1985-05-15T00:00:00.000Z",
    "email": "nguyenvanc@example.com",
    "full_name": "Nguyễn Văn C",
    "gender": "FEMALE",
    "phone": "0123456789",
    "role": {
      "id": "2",
      "code": "USER",
      "name": "User"
    }
  }
}
```

### Error Response (User not found)
```json
{
  "status": "error",
  "statusCode": 404,
  "message": "User not found"
}
```

### Error Response (General Error)
```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Cách sử dụng trong code

### 1. Sử dụng service trực tiếp
```typescript
import { deleteUser } from 'src/services/auth'

const handleDeactivateUser = async (id: string) => {
  try {
    const response = await deleteUser(id)
    console.log('User deactivated:', response.data)
  } catch (error) {
    console.error('Error deactivating user:', error)
  }
}
```

### 2. Sử dụng hook useAuth
```typescript
import { useAuth } from 'src/hooks/useAuth'

const MyComponent = () => {
  const { deleteUserProfile } = useAuth()
  
  const handleDeactivateUser = async (id: string) => {
    try {
      const response = await deleteUserProfile(id)
      console.log('User deactivated:', response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  return (
    <button onClick={() => handleDeactivateUser("24")}>
      Vô hiệu hóa người dùng
    </button>
  )
}
```

### 3. Sử dụng trong trang quản lý người dùng
API đã được tích hợp sẵn trong trang quản lý người dùng (`/manage-system/user`). Khi click nút "Vô hiệu" trên bảng người dùng:
1. Hiển thị confirmation dialog: "Bạn có chắc muốn vô hiệu hóa người dùng này? (Người dùng sẽ không thể đăng nhập nhưng dữ liệu vẫn được giữ lại)"
2. Nếu user confirm, gọi API vô hiệu hóa người dùng
3. Sau khi vô hiệu hóa thành công, reload danh sách người dùng
4. Hiển thị thông báo lỗi nếu có

## Types

### DeactivateUserResponse
```typescript
type DeactivateUserResponse = {
  status: string
  statusCode: number
  message: string
  data: {
    id: string
    created_at: string
    created_by: string
    updated_at: string
    updated_by: string
    active: false
    avatar?: string
    birthday?: string
    email: string
    full_name: string
    gender?: string
    phone?: string
    role: {
      id: string
      code: string
      name: string
    }
  }
}
```

## Validation Rules
- `id`: Bắt buộc, phải là ID hợp lệ của người dùng tồn tại
- User phải có quyền admin (role = 1) để thực hiện vô hiệu hóa
- Không thể vô hiệu hóa chính mình (admin không thể vô hiệu hóa tài khoản của mình)

## Lưu ý
- API yêu cầu người dùng đã đăng nhập và có access token hợp lệ với quyền admin (role = 1)
- Access token sẽ được tự động thêm vào header thông qua axios interceptor
- Sau khi vô hiệu hóa thành công, người dùng sẽ không thể đăng nhập nhưng dữ liệu vẫn được giữ lại
- Danh sách người dùng sẽ được tự động reload sau khi vô hiệu hóa thành công
- Nếu có lỗi, thông báo lỗi sẽ được hiển thị cho người dùng
- Nút "Vô hiệu" sẽ bị disable khi đang thực hiện vô hiệu hóa và hiển thị "Đang vô hiệu..."

## Security Considerations
- Chỉ admin mới có quyền vô hiệu hóa người dùng
- Cần confirmation dialog để tránh vô hiệu hóa nhầm
- Log lại thông tin người vô hiệu hóa và thời gian vô hiệu hóa
- Soft delete giúp dễ dàng khôi phục người dùng nếu cần

## Demo
Truy cập trang `/manage-system/user` và click nút "Vô hiệu" trên bất kỳ người dùng nào để xem demo chức năng vô hiệu hóa người dùng. 