# Hướng dẫn sử dụng trang Quản lý Đánh giá

## Tổng quan
Trang quản lý đánh giá cho phép admin xem, tìm kiếm, lọc và quản lý tất cả các đánh giá sản phẩm trong hệ thống.

## Tính năng chính

### 1. Hiển thị danh sách đánh giá
- Hiển thị tất cả đánh giá với thông tin chi tiết
- Phân trang tự động với 10 đánh giá mỗi trang
- Hiển thị thông tin: ID, Đánh giá (sao), Nội dung, Hình ảnh, Ngày tạo, Người tạo, Ngày cập nhật, Người cập nhật, User ID, Product ID

### 2. Tìm kiếm và lọc
- **Tìm kiếm theo nội dung**: Nhập từ khóa để tìm kiếm trong nội dung đánh giá
- **Lọc theo đánh giá**: Chọn số sao (1-5) để lọc đánh giá theo mức độ hài lòng

### 3. Phân trang
- Điều hướng bằng nút "Trước" và "Sau"
- Chuyển đến trang cụ thể bằng cách nhập số trang
- Hiển thị thông tin: "Hiển thị X - Y trong tổng số Z đánh giá"

### 4. Quản lý đánh giá
- **Thêm đánh giá mới**: Tạo đánh giá mới với rating, nội dung, user_id, product_id
- **Sửa đánh giá**: Chỉnh sửa thông tin đánh giá hiện có
- **Xóa đánh giá**: Xóa đánh giá khỏi hệ thống (có xác nhận)

### 5. Hiển thị hình ảnh
- Hiển thị tối đa 3 hình ảnh đầu tiên của mỗi đánh giá
- Nếu có nhiều hơn 3 hình, hiển thị chip "+X" để chỉ số hình còn lại
- Hình ảnh được hiển thị dưới dạng thumbnail 30x30px

## API Integration

### Endpoint
- **URL**: `http://localhost:8080/api/v0/reviews/get-reviews`
- **Method**: GET
- **Authentication**: Access Token được tích hợp tự động

### Parameters
- `page`: Số trang (mặc định: 1)
- `limit`: Số lượng item mỗi trang (mặc định: 10)
- `search`: Từ khóa tìm kiếm (optional)
- `rating`: Số sao để lọc (optional)

### Response Format
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Review retrieved successfully",
  "data": [
    {
      "id": 1,
      "created_at": "2024-01-15T10:30:00.000Z",
      "created_by": "user123",
      "updated_at": "2024-01-15T10:30:00.000Z",
      "updated_by": "user123",
      "rating": 4.5,
      "comment": "Sản phẩm rất đẹp, chất lượng tốt!",
      "images": "url1.jpg,url2.jpg,url3.jpg",
      "user_id": 1,
      "product_id": "PROD001"
    }
  ],
  "error": null,
  "meta": {
    "totalItems": 25,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 20
  }
}
```

## Error Handling
- Hiển thị thông báo lỗi khi API call thất bại
- Fallback về mock data nếu API không khả dụng
- Loading state khi đang tải dữ liệu

## Responsive Design
- Giao diện responsive, tương thích với các kích thước màn hình khác nhau
- Table có thể scroll ngang trên màn hình nhỏ
- Các nút và form được tối ưu cho mobile

## Cách sử dụng

1. **Truy cập trang**: Điều hướng đến `/manage-system/review`
2. **Xem danh sách**: Dữ liệu sẽ được tải tự động
3. **Tìm kiếm**: Nhập từ khóa vào ô tìm kiếm
4. **Lọc**: Chọn số sao từ dropdown
5. **Phân trang**: Sử dụng các nút điều hướng hoặc nhập số trang
6. **Thêm mới**: Click nút "Thêm đánh giá" và điền form
7. **Sửa**: Click nút "Sửa" trên dòng tương ứng
8. **Xóa**: Click nút "Xóa" và xác nhận

## Lưu ý
- Tất cả thao tác đều có xác nhận trước khi thực hiện
- Dữ liệu được cập nhật real-time sau mỗi thao tác
- Access token được tự động gửi kèm trong mọi request
- Hình ảnh được hiển thị dưới dạng URL được phân tách bằng dấu phẩy 