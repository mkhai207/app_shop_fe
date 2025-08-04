# Hướng dẫn sử dụng API kích hoạt người dùng

## Tổng quan
API này cho phép kích hoạt người dùng (thay đổi trạng thái từ không hoạt động thành hoạt động) trong hệ thống. API yêu cầu access token với quyền admin để xác thực.

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
- `:id` - ID của người dùng cần kích hoạt

## Body Request
```json
{
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
    "updated_at": "2025-01-27T12:30:00.000Z",
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
import { updateUser } from 'src/services/auth'

const handleActivateUser = async (id: string) => {
  try {
    const response = await updateUser(id, { active: true })
    console.log('User activated:', response.data)
  } catch (error) {
    console.error('Error activating user:', error)
  }
}
```

### 2. Sử dụng hook useAuth
```typescript
import { useAuth } from 'src/hooks/useAuth'

const MyComponent = () => {
  const { updateUserProfile } = useAuth()
  
  const handleActivateUser = async (id: string) => {
    try {
      const response = await updateUserProfile(id, { active: true })
      console.log('User activated:', response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  return (
    <button onClick={() => handleActivateUser("24")}>
      Kích hoạt người dùng
    </button>
  )
}
```

### 3. Sử dụng trong trang quản lý người dùng
API đã được tích hợp sẵn trong trang quản lý người dùng (`/manage-system/user`). Khi click vào ô trạng thái "Không hoạt động":
1. Hiển thị confirmation dialog: "Bạn có chắc muốn kích hoạt người dùng này?"
2. Nếu user confirm, gọi API kích hoạt người dùng
3. Sau khi kích hoạt thành công, reload danh sách người dùng
4. Hiển thị thông báo lỗi nếu có

## Types

### ActivateUserResponse
```typescript
type ActivateUserResponse = {
  status: string
  statusCode: number
  message: string
  data: {
    id: string
    created_at: string
    created_by: string
    updated_at: string
    updated_by: string
    active: true
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
- User phải có quyền admin (role = 1) để thực hiện kích hoạt
- Chỉ có thể kích hoạt người dùng có trạng thái `active: false`

## UI Behavior
- **Chỉ click được khi trạng thái là "Không hoạt động"**: Người dùng đã hoạt động không thể click
- **Tooltip**: Hiển thị "Click để kích hoạt" khi hover vào trạng thái "Không hoạt động"
- **Loading State**: Hiển thị "Đang kích hoạt..." khi đang thực hiện API call
- **Confirmation**: Yêu cầu xác nhận trước khi kích hoạt
- **Auto Reload**: Tự động reload danh sách sau khi kích hoạt thành công

## Lưu ý
- API yêu cầu người dùng đã đăng nhập và có access token hợp lệ với quyền admin (role = 1)
- Access token sẽ được tự động thêm vào header thông qua axios interceptor
- Sau khi kích hoạt thành công, người dùng sẽ có thể đăng nhập lại
- Danh sách người dùng sẽ được tự động reload sau khi kích hoạt thành công
- Nếu có lỗi, thông báo lỗi sẽ được hiển thị cho người dùng
- Chỉ người dùng có trạng thái "Không hoạt động" mới có thể được kích hoạt

## Security Considerations
- Chỉ admin mới có quyền kích hoạt người dùng
- Cần confirmation dialog để tránh kích hoạt nhầm
- Log lại thông tin người kích hoạt và thời gian kích hoạt
- Chỉ cho phép kích hoạt người dùng đã bị vô hiệu hóa trước đó

## Demo
Truy cập trang `/manage-system/user` và click vào ô trạng thái "Không hoạt động" trên bất kỳ người dùng nào để xem demo chức năng kích hoạt người dùng. 