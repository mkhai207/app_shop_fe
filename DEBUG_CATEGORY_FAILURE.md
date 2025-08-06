# 🔍 Debug: Create Category Fail

## Vấn đề
Khi chạy trên `localhost:3000`, nút "Thêm phân loại" hiển thị lỗi "Create category fail".

## 🔧 Các bước debug

### 1. Kiểm tra Authentication
```javascript
// Mở Developer Tools (F12) và chạy trong Console:
console.log('Token:', localStorage.getItem('accessToken'));
console.log('User Data:', localStorage.getItem('USER_DATA'));
```

### 2. Kiểm tra Network Requests
1. Mở Developer Tools (F12)
2. Vào tab **Network**
3. Click nút "Thêm phân loại" và submit form
4. Kiểm tra request đến `/api/v0/categories/create-category`

### 3. Kiểm tra Console Errors
1. Mở Developer Tools (F12)
2. Vào tab **Console**
3. Tìm các error messages

## 🚨 Các nguyên nhân có thể

### 1. **Token không tồn tại**
- **Triệu chứng**: `localStorage.getItem('accessToken')` trả về `null`
- **Giải pháp**: Đăng nhập lại vào ứng dụng

### 2. **Token hết hạn**
- **Triệu chứng**: API trả về 401 Unauthorized
- **Giải pháp**: Refresh token hoặc đăng nhập lại

### 3. **Không có quyền admin**
- **Triệu chứng**: API trả về 403 Forbidden
- **Giải pháp**: Đăng nhập với tài khoản có role = 1

### 4. **Server không chạy**
- **Triệu chứng**: Network error hoặc CORS error
- **Giải pháp**: Kiểm tra backend server có đang chạy trên port 8080

### 5. **CORS Error**
- **Triệu chứng**: CORS policy error trong console
- **Giải pháp**: Kiểm tra CORS configuration trên backend

### 6. **500 Internal Server Error** ⚠️ **PHÁT HIỆN LỖI NÀY**
- **Triệu chứng**: API trả về 500 Internal Server Error
- **Nguyên nhân**: **ID Conflict** - Backend đang set ID = 1 thủ công thay vì để database tự generate
- **Giải pháp**: 
  - ✅ **Đã xác định nguyên nhân**: Backend set ID thủ công gây conflict với data có sẵn
  - ✅ **Cần sửa backend**: Xóa phần set ID thủ công, để database AUTO_INCREMENT
  - ✅ **Xem file**: `BACKEND_CATEGORY_ID_FIX.md` để biết chi tiết cách sửa

## 🔧 Các cải thiện đã thực hiện

### 1. **Cập nhật Service Layer**
```typescript
// Sử dụng helper function thay vì truy cập trực tiếp
import { getLocalUserData } from 'src/helpers/storage'

export const createCategory = async (categoryData: { code: string; name: string }) => {
  try {
    const { accessToken } = getLocalUserData()
    
    if (!accessToken) {
      throw new Error('Không có token xác thực. Vui lòng đăng nhập lại.')
    }

    // Thêm logging để debug
    console.log('Creating category with data:', categoryData)
    console.log('Using token:', accessToken ? 'Token exists' : 'No token')

    const res = await axios.post(CONFIG_API.CATEGORY.CREATE_CATEGORY, categoryData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    console.log('API Response:', res.data)
    return res.data
  } catch (error: any) {
    console.error('Create category error:', error)
    
    // Xử lý các loại lỗi cụ thể
    if (error.response) {
      const { status, data } = error.response
      
      if (status === 401) {
        throw new Error('Token không hợp lệ. Vui lòng đăng nhập lại.')
      } else if (status === 403) {
        throw new Error('Bạn không có quyền tạo phân loại.')
      } else if (status === 409) {
        throw new Error('Mã phân loại đã tồn tại.')
      } else if (status === 400) {
        throw new Error(data?.message || 'Dữ liệu không hợp lệ.')
      } else {
        throw new Error(data?.message || `Lỗi server: ${status}`)
      }
    } else if (error.request) {
      throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.')
    } else {
      throw new Error(error.message || 'Có lỗi xảy ra khi tạo phân loại.')
    }
  }
}
```

### 2. **Cập nhật Hook Layer**
```typescript
const createCategory = useCallback(async (categoryData: { code: string; name: string }) => {
  setLoading(true)
  setError(null)
  
  try {
    console.log('Hook: Creating category with data:', categoryData)
    
    const response = await categoryService.createCategory(categoryData)
    
    console.log('Hook: API response:', response)
    
    if (response.status === 'success') {
      await fetchCategories()
      return response
    } else {
      const errorMessage = response.message || 'Có lỗi xảy ra khi tạo phân loại'
      setError(errorMessage)
      throw new Error(errorMessage)
    }
  } catch (err: any) {
    console.error('Hook: Create category error:', err)
    
    const errorMessage = err.message || 'Có lỗi xảy ra khi tạo phân loại'
    setError(errorMessage)
    throw new Error(errorMessage)
  } finally {
    setLoading(false)
  }
}, [fetchCategories])
```

## 📋 Checklist Debug

### ✅ Kiểm tra trước khi test:
- [ ] Backend server đang chạy trên port 8080
- [ ] Đã đăng nhập với tài khoản admin
- [ ] Token tồn tại trong localStorage
- [ ] Không có CORS error

### ✅ Kiểm tra khi test:
- [ ] Mở Developer Tools (F12)
- [ ] Vào tab Console
- [ ] Click "Thêm phân loại"
- [ ] Kiểm tra console logs
- [ ] Kiểm tra Network tab

### ✅ Kiểm tra sau khi test:
- [ ] Console có hiển thị logs không?
- [ ] Network có request đến API không?
- [ ] Response status là gì?
- [ ] Error message cụ thể là gì?

## 🎯 Kết quả mong đợi

### ✅ Thành công:
```
Hook: Creating category with data: {code: "TEST", name: "Test Category"}
Using token: Token exists
API Response: {status: "success", data: {...}}
Hook: API response: {status: "success", data: {...}}
```

### ❌ Lỗi thường gặp:
```
Create category error: Token không hợp lệ. Vui lòng đăng nhập lại.
Create category error: Bạn không có quyền tạo phân loại.
Create category error: Không thể kết nối đến server.
Create category error: Lỗi server (500): [error message]. Vui lòng liên hệ admin hoặc thử lại sau.
```

## 📞 Hỗ trợ

Nếu vẫn gặp lỗi, hãy:
1. Copy toàn bộ console logs
2. Copy Network request/response
3. Cung cấp thông tin về user role và authentication status 