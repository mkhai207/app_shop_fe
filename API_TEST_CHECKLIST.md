# Checklist Kiểm tra API và Hiển thị Dữ liệu

## 🔍 Bước 1: Kiểm tra API Call

### 1.1 Mở Developer Tools
- [ ] Mở Chrome DevTools (F12)
- [ ] Chuyển sang tab Console
- [ ] Chuyển sang tab Network

### 1.2 Truy cập trang Review
- [ ] Điều hướng đến `/manage-system/review`
- [ ] Kiểm tra console logs:
  - [ ] `🔄 Loading reviews...`
  - [ ] `📊 Current state: {...}`
  - [ ] `🔄 Calling API getReviews with params: {...}`

### 1.3 Kiểm tra Network Request
- [ ] Trong tab Network, tìm request đến `/reviews/get-reviews`
- [ ] Kiểm tra:
  - [ ] Request URL: `http://localhost:8080/api/v0/reviews/get-reviews?page=1&limit=10`
  - [ ] Request Headers có `Authorization: Bearer <token>`
  - [ ] Response Status: 200 OK

### 1.4 Kiểm tra API Response
- [ ] Console log `✅ API Response: {...}`
- [ ] Kiểm tra cấu trúc response:
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Review retrieved successfully",
    "data": [...],
    "meta": {
      "totalItems": 25,
      "totalPages": 2,
      "currentPage": 1,
      "limit": 20
    }
  }
  ```

## 🔍 Bước 2: Kiểm tra Xử lý Dữ liệu

### 2.1 Kiểm tra State Updates
- [ ] Console log `✅ Reviews loaded successfully: {...}`
- [ ] Console log `📋 Reviews data: [...]`
- [ ] Console log `📊 Meta data: {...}`
- [ ] Console log `🎯 State updated: {...}`

### 2.2 Kiểm tra Render
- [ ] Console log `🎨 Render debug - Loading: false, Reviews count: X, Error: ""`
- [ ] Kiểm tra bảng hiển thị dữ liệu

## 🔍 Bước 3: Kiểm tra Hiển thị UI

### 3.1 Kiểm tra Loading State
- [ ] Trang hiển thị spinner khi loading
- [ ] Spinner biến mất sau khi load xong

### 3.2 Kiểm tra Bảng Dữ liệu
- [ ] Bảng hiển thị đúng số cột
- [ ] Dữ liệu hiển thị đúng format:
  - [ ] ID: số
  - [ ] Đánh giá: Rating component
  - [ ] Nội dung: text (có tooltip nếu dài)
  - [ ] Hình ảnh: thumbnails hoặc "Không có"
  - [ ] Ngày tạo: format dd/mm/yyyy
  - [ ] User ID: số
  - [ ] Product ID: string

### 3.3 Kiểm tra Phân trang
- [ ] Hiển thị thông tin: "Hiển thị X - Y trong tổng số Z đánh giá"
- [ ] Nút "Trước" và "Sau" hoạt động
- [ ] Số trang hiển thị đúng
- [ ] Input chuyển trang hoạt động

## 🔍 Bước 4: Kiểm tra Tính năng

### 4.1 Tìm kiếm
- [ ] Nhập từ khóa vào ô tìm kiếm
- [ ] Kiểm tra API call với parameter `search`
- [ ] Kết quả được lọc đúng

### 4.2 Lọc theo Rating
- [ ] Chọn rating từ dropdown
- [ ] Kiểm tra API call với parameter `rating`
- [ ] Kết quả được lọc đúng

### 4.3 Phân trang
- [ ] Click nút "Sau" → API call với `page=2`
- [ ] Click nút "Trước" → API call với `page=1`
- [ ] Nhập số trang → API call với `page=X`

## 🔍 Bước 5: Kiểm tra Error Handling

### 5.1 API Error
- [ ] Tắt server backend
- [ ] Refresh trang
- [ ] Kiểm tra console log `❌ API Error: {...}`
- [ ] Kiểm tra fallback về mock data
- [ ] Kiểm tra hiển thị error message

### 5.2 Network Error
- [ ] Tắt internet
- [ ] Refresh trang
- [ ] Kiểm tra error handling

## 🔍 Bước 6: Test Create Review

### 6.1 Test Create Review API
- [ ] Mở file `test-create-review.html` trong browser
- [ ] Điền thông tin form:
  - [ ] Product ID: "PROD001"
  - [ ] Rating: 4.5
  - [ ] Comment: "Sản phẩm rất tốt, giao hàng nhanh"
  - [ ] Images: "url1,url2,url3"
  - [ ] Order ID: 123
- [ ] Click "Create Review"
- [ ] Kiểm tra response thành công

### 6.2 Test Create Review trong App
- [ ] Truy cập `/manage-system/review`
- [ ] Click nút "Thêm đánh giá"
- [ ] Điền form:
  - [ ] Rating: chọn 4 sao
  - [ ] Comment: nhập nội dung
  - [ ] Product ID: "PROD001"
  - [ ] Order ID: 123
  - [ ] Images: "url1,url2,url3"
- [ ] Click "Lưu"
- [ ] Kiểm tra:
  - [ ] Loading state hiển thị
  - [ ] API call thành công
  - [ ] Danh sách được refresh
  - [ ] Đánh giá mới xuất hiện trong bảng

## 🔍 Bước 7: Test Component

### 7.1 Truy cập Test Page
- [ ] Điều hướng đến `/test-api`
- [ ] Click nút "Test API Call"
- [ ] Kiểm tra response hiển thị

## 📝 Ghi chú

### Console Logs cần có:

**Get Reviews:**
```
🔄 Loading reviews...
📊 Current state: {currentPage: 1, searchTerm: "", filterRating: "", itemsPerPage: 10}
🔄 Calling API getReviews with params: {page: 1, limit: 10}
✅ API Response: {...}
✅ Reviews loaded successfully: {...}
📋 Reviews data: [...]
📊 Meta data: {...}
🎯 State updated: {reviewsCount: X, totalItems: Y, totalPages: Z}
🎨 Render debug - Loading: false, Reviews count: X, Error: ""
🏁 Loading completed
```

**Create Review:**
```
🔄 Adding new review: {rating: "4", comment: "...", product_id: "PROD001", ...}
🔄 Calling API createReview with data: {rating: 4, comment: "...", product_id: "PROD001", ...}
✅ Create review successful: {...}
✅ Review added successfully: {...}
🔄 Loading reviews... (refresh)
✅ Reviews loaded successfully: {...}
```

### Network Request cần có:
- **URL**: `GET http://localhost:8080/api/v0/reviews/get-reviews?page=1&limit=10`
- **Headers**: 
  - `Authorization: Bearer <access_token>`
  - `Content-Type: application/json`
- **Status**: 200 OK
- **Response**: JSON với cấu trúc đúng

### Các trường hợp cần test:
1. ✅ API hoạt động bình thường
2. ❌ API trả về lỗi
3. 🌐 Network không khả dụng
4. 🔍 Tìm kiếm và lọc
5. 📄 Phân trang
6. 🔄 Refresh trang 