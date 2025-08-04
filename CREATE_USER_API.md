# Hướng dẫn sử dụng API tạo người dùng mới

## Tổng quan
API này cho phép tạo người dùng mới trong hệ thống. API yêu cầu access token để xác thực.

## Endpoint
```
POST http://localhost:8080/api/v0/auth/register
```

## Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Body Request
```json
{
  "fullName": "Nguyễn Văn A",
  "phone": "0123456789",
  "email": "nguyenvana@example.com",
  "password": "123456",
  "confirmPassword": "123456"
}
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "24",
    "created_at": "2025-01-27T10:30:00.000Z",
    "created_by": "admin",
    "updated_at": "2025-01-27T10:30:00.000Z",
    "updated_by": "admin",
    "active": true,
    "avatar": null,
    "birthday": null,
    "email": "nguyenvana@example.com",
    "full_name": "Nguyễn Văn A",
    "gender": null,
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
    "fullName": "Full name must be at least 6 characters long",
    "email": "Email is already taken",
    "phone": "Phone number must be exactly 10 digits",
    "password": "Password must contain at least one uppercase letter",
    "confirmPassword": "Password confirmation does not match"
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
import { createUser } from 'src/services/auth'

const handleCreateUser = async (userData: TRegisterAuth) => {
  try {
    const response = await createUser(userData)
    console.log('User created:', response.data)
  } catch (error) {
    console.error('Error creating user:', error)
  }
}
```

### 2. Sử dụng hook useAuth
```typescript
import { useAuth } from 'src/hooks/useAuth'

const MyComponent = () => {
  const { createNewUser } = useAuth()
  
  const handleCreateUser = async (userData: TRegisterAuth) => {
    try {
      const response = await createNewUser(userData)
      console.log('User created:', response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  return (
    <button onClick={() => handleCreateUser({
      fullName: "Nguyễn Văn A",
      phone: "0123456789",
      email: "nguyenvana@example.com",
      password: "123456",
      confirmPassword: "123456"
    })}>
      Tạo người dùng mới
    </button>
  )
}
```

### 3. Sử dụng trong trang quản lý người dùng
API đã được tích hợp sẵn trong trang quản lý người dùng (`/manage-system/user`). Khi click nút "Thêm người dùng", form sẽ hiển thị với các trường:
- Họ tên (fullName)
- Email
- Số điện thoại (phone)
- Mật khẩu (password)
- Xác nhận mật khẩu (confirmPassword)

## Types

### TRegisterAuth
```typescript
type TRegisterAuth = {
  fullName: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}
```

## Validation Rules
- `fullName`: Bắt buộc, không được để trống, tối thiểu 2 ký tự
- `email`: Bắt buộc, phải là email hợp lệ (định dạng: example@domain.com), không được trùng lặp
- `phone`: Bắt buộc, phải là số điện thoại hợp lệ (10-11 chữ số)
- `password`: Bắt buộc, tối thiểu 6 ký tự
- `confirmPassword`: Bắt buộc, phải khớp với password

### Real-time Validation
Form sẽ hiển thị lỗi validation ngay lập tức khi người dùng:
- Nhập sai định dạng email
- Nhập số điện thoại không đúng định dạng
- Nhập mật khẩu quá ngắn
- Nhập mật khẩu xác nhận không khớp
- Để trống các trường bắt buộc

Lỗi sẽ được hiển thị dưới mỗi trường input với màu đỏ và nút "Lưu" sẽ bị disable khi có lỗi validation.

### API Error Handling
Khi API trả về lỗi validation, các thông báo lỗi sẽ được hiển thị trực tiếp trên form:
- **Lỗi từ backend**: Ví dụ "Full name must be at least 6 characters long" sẽ hiển thị dưới trường "Họ tên"
- **Mapping tự động**: Hệ thống tự động map các field names từ API response về form fields
- **Hỗ trợ nhiều format**: Xử lý cả lỗi dạng string và array từ API
- **Field mapping**: 
  - `fullName` / `full_name` → trường "Họ tên"
  - `email` → trường "Email"
  - `phone` → trường "Số điện thoại"
  - `password` → trường "Mật khẩu"
  - `confirmPassword` / `confirm_password` → trường "Xác nhận mật khẩu"

## Lưu ý
- API yêu cầu người dùng đã đăng nhập và có access token hợp lệ
- Access token sẽ được tự động thêm vào header thông qua axios interceptor
- Sau khi tạo thành công, danh sách người dùng sẽ được tự động reload
- Nếu có lỗi, thông báo lỗi sẽ được hiển thị cho người dùng
- Người dùng mới được tạo sẽ có role mặc định là "USER"

## Demo
Truy cập trang `/manage-system/user` và click nút "Thêm người dùng" để xem demo form tạo người dùng mới. 