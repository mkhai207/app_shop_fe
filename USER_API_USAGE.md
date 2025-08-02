# Hướng dẫn sử dụng API lấy danh sách người dùng

## Tổng quan
API này cho phép lấy thông tin của tất cả người dùng trong hệ thống. API yêu cầu access token để xác thực.

## Endpoint
```
GET http://localhost:8080/api/v0/users/get-users
```

## Headers
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

## Response Format
```json
{
    "status": "success",
    "statusCode": 200,
    "message": "User retrieved successfully",
    "data": [
        {
            "id": "23",
            "created_at": "2025-07-26T15:15:11.318Z",
            "created_by": null,
            "updated_at": "2025-07-26T15:15:11.318Z",
            "updated_by": null,
            "active": true,
            "avatar": null,
            "birthday": null,
            "email": "admin@gmail.com",
            "full_name": "Nguyễn Thị Admin",
            "gender": null,
            "phone": "0326026333",
            "role": {
                "id": "1",
                "code": "ADMIN",
                "name": "Admin"
            }
        }
    ]
}
```

## Cách sử dụng trong code

### 1. Sử dụng service trực tiếp
```typescript
import { getUsers } from 'src/services/auth'

const fetchUsers = async () => {
  try {
    const response = await getUsers()
    console.log('Users:', response.data)
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}
```

### 2. Sử dụng hook useAuth
```typescript
import { useAuth } from 'src/hooks/useAuth'

const MyComponent = () => {
  const { fetchUsers } = useAuth()
  
  const handleFetchUsers = async () => {
    try {
      const response = await fetchUsers()
      console.log('Users:', response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  
  return (
    <button onClick={handleFetchUsers}>
      Lấy danh sách người dùng
    </button>
  )
}
```

### 3. Sử dụng component UserList
```typescript
import UserList from 'src/components/user-list'

const UsersPage = () => {
  return (
    <div>
      <h1>Quản lý người dùng</h1>
      <UserList />
    </div>
  )
}
```

## Types

### TUser
```typescript
type TUser = {
  id: string
  created_at: string
  created_by: string | null
  updated_at: string
  updated_by: string | null
  active: boolean
  avatar: string | null
  birthday: string | null
  email: string
  full_name: string
  gender: string | null
  phone: string
  role: TUserRole
}
```

### TUserRole
```typescript
type TUserRole = {
  id: string
  code: string
  name: string
}
```

### TGetUsersResponse
```typescript
type TGetUsersResponse = {
  status: string
  statusCode: number
  message: string
  data: TUser[]
}
```

## Lưu ý
- API yêu cầu người dùng đã đăng nhập và có access token hợp lệ
- Access token sẽ được tự động thêm vào header thông qua axios interceptor
- Nếu token hết hạn, hệ thống sẽ tự động refresh token hoặc redirect về trang login
- Component UserList đã được tích hợp sẵn loading state và error handling

## Demo
Truy cập trang `/users` để xem demo component UserList hoạt động. 