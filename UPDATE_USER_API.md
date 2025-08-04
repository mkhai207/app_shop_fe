# Hướng dẫn sử dụng API sửa người dùng

## Tổng quan
API này cho phép cập nhật thông tin người dùng trong hệ thống. API yêu cầu access token với quyền admin để xác thực.

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
- `:id` - ID của người dùng cần sửa

## Body Request (tất cả các trường đều tùy chọn)
```json
{
  "fullname": "Nguyễn Văn C",
  "phone": "0123456789",
  "avatar": "https://example.com/avatar.jpg",
  "birthday": "1985-05-15T00:00:00.000Z",
  "gender": "FEMALE",
  "active": true
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
    "updated_at": "2025-01-27T11:30:00.000Z",
    "updated_by": "admin",
    "active": true,
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

### Error Response (Validation Errors)
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "fullname": "Full name must be at least 6 characters long",
    "phone": "Phone number must be exactly 10 digits",
    "gender": "Gender must be one of: MALE, FEMALE, OTHER"
  }
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
import { updateUser } from 'src/services/auth'

const handleUpdateUser = async (id: string, userData: {
  fullname?: string
  phone?: string
  avatar?: string
  birthday?: string
  gender?: string
  active?: boolean
}) => {
  try {
    const response = await updateUser(id, userData)
    console.log('User updated:', response.data)
  } catch (error) {
    console.error('Error updating user:', error)
  }
}
```

### 2. Sử dụng hook useAuth
```typescript
import { useAuth } from 'src/hooks/useAuth'

const MyComponent = () => {
  const { updateUserProfile } = useAuth()
  
  const handleUpdateUser = async (id: string, userData: {
    fullname?: string
    phone?: string
    avatar?: string
    birthday?: string
    gender?: string
    active?: boolean
  }) => {
    try {
      const response = await updateUserProfile(id, userData)
      console.log('User updated:', response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  return (
    <button onClick={() => handleUpdateUser("24", {
      fullname: "Nguyễn Văn C",
      phone: "0123456789",
      avatar: "https://example.com/avatar.jpg",
      birthday: "1985-05-15T00:00:00.000Z",
      gender: "FEMALE",
      active: true
    })}>
      Cập nhật người dùng
    </button>
  )
}
```

### 3. Sử dụng trong trang quản lý người dùng
API đã được tích hợp sẵn trong trang quản lý người dùng (`/manage-system/user`). Khi click nút "Sửa" trên bảng người dùng, form sẽ hiển thị với các trường:
- Họ tên (fullname)
- Số điện thoại (phone)
- Avatar URL (avatar)
- Ngày sinh (birthday)
- Giới tính (gender)

## Types

### UpdateUserData
```typescript
type UpdateUserData = {
  fullname?: string
  phone?: string
  avatar?: string
  birthday?: string
  gender?: string
  active?: boolean
}
```

## Validation Rules
- `fullname`: Tùy chọn, nếu có thì phải có ít nhất 6 ký tự
- `phone`: Tùy chọn, nếu có thì phải là số điện thoại hợp lệ
- `avatar`: Tùy chọn, nếu có thì phải là URL hợp lệ
- `birthday`: Tùy chọn, nếu có thì phải là định dạng ISO date
- `gender`: Tùy chọn, nếu có thì phải là một trong: "MALE", "FEMALE", "OTHER"
- `active`: Tùy chọn, boolean

## Gender Mapping
- **Display**: "Nam" → **API**: "MALE"
- **Display**: "Nữ" → **API**: "FEMALE"  
- **Display**: "Khác" → **API**: "OTHER"

## Lưu ý
- API yêu cầu người dùng đã đăng nhập và có access token hợp lệ với quyền admin (role = 1)
- Access token sẽ được tự động thêm vào header thông qua axios interceptor
- Chỉ các trường được thay đổi mới được gửi lên API
- Sau khi cập nhật thành công, danh sách người dùng sẽ được tự động reload
- Nếu có lỗi, thông báo lỗi sẽ được hiển thị cho người dùng
- Form sẽ tự động map giới tính từ API format sang Vietnamese display

## Demo
Truy cập trang `/manage-system/user` và click nút "Sửa" trên bất kỳ người dùng nào để xem demo form sửa người dùng. 