# Quản lý Khuyến mãi

## Tổng quan

Trang quản lý khuyến mãi đã được tích hợp với API backend để thực hiện các chức năng CRUD (Create, Read, Update, Delete) cho các mã khuyến mãi.

## Tính năng

### 1. Hiển thị danh sách khuyến mãi
- Hiển thị tất cả thông tin khuyến mãi trong bảng
- Phân trang với 10 items mỗi trang
- Tìm kiếm theo mã khuyến mãi hoặc tên
- Lọc theo loại giảm (Phần trăm/Số tiền cố định)
- Hiển thị trạng thái khuyến mãi (Đang hiệu lực/Chưa hiệu lực/Hết hạn)

### 2. Thêm khuyến mãi mới
- Form nhập liệu đầy đủ thông tin
- Validation dữ liệu
- Hỗ trợ 2 loại giảm: Phần trăm và Số tiền cố định
- Chọn thời gian hiệu lực từ/đến

### 3. Chỉnh sửa khuyến mãi
- Cập nhật thông tin khuyến mãi
- Giữ nguyên các thông tin không thay đổi
- Validation dữ liệu

### 4. Xóa khuyến mãi
- Xác nhận trước khi xóa
- Xóa vĩnh viễn khỏi hệ thống

## Cấu trúc dữ liệu

### TDiscount Interface
```typescript
interface TDiscount {
  id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  code: string
  name: string
  description: string
  discount_value: string
  discount_type: 'PERCENTAGE' | 'FIXED'
  valid_from: string
  valid_until: string
  minimum_order_value: number
  max_discount_amount: number | null
}
```

### API Endpoints
- `GET /discounts/get-discounts` - Lấy danh sách khuyến mãi
- `GET /discounts/{id}` - Lấy thông tin khuyến mãi theo ID
- `POST /discounts` - Tạo khuyến mãi mới
- `PUT /discounts/{id}` - Cập nhật khuyến mãi
- `DELETE /discounts/{id}` - Xóa khuyến mãi

## Cách sử dụng

### 1. Truy cập trang
- Đăng nhập vào hệ thống với quyền admin
- Vào menu "Quản trị sản phẩm" > "Khuyến mãi"

### 2. Xem danh sách
- Trang sẽ tự động tải danh sách khuyến mãi
- Sử dụng thanh tìm kiếm để lọc theo mã hoặc tên
- Sử dụng dropdown để lọc theo loại giảm
- Sử dụng phân trang để xem các trang khác (chỉ hiển thị khi có nhiều hơn 1 trang)
- Khi không có dữ liệu: hiển thị thông báo "Chưa có khuyến mãi nào trong hệ thống"
- Khi không tìm thấy kết quả: hiển thị thông báo "Không tìm thấy khuyến mãi nào phù hợp với bộ lọc" và nút "Xóa bộ lọc"

### 3. Thêm khuyến mãi mới
- Click nút "Thêm khuyến mãi"
- Điền đầy đủ thông tin trong form
- Click "Lưu" để tạo khuyến mãi

### 4. Chỉnh sửa khuyến mãi
- Click nút "Sửa" trong hàng tương ứng
- Thay đổi thông tin cần thiết
- Click "Lưu" để cập nhật

### 5. Xóa khuyến mãi
- Click nút "Xóa" trong hàng tương ứng
- Xác nhận trong hộp thoại
- Khuyến mãi sẽ bị xóa vĩnh viễn

## Trạng thái khuyến mãi

Hệ thống tự động tính toán và hiển thị trạng thái khuyến mãi:

- **Đang hiệu lực** (màu xanh): Thời gian hiện tại nằm trong khoảng hiệu lực
- **Chưa hiệu lực** (màu vàng): Thời gian hiện tại chưa đến thời gian bắt đầu
- **Hết hạn** (màu đỏ): Thời gian hiện tại đã qua thời gian kết thúc

## Lưu ý

1. **Access Token**: Tất cả API calls đều yêu cầu access token hợp lệ
2. **Validation**: Dữ liệu được validate trước khi gửi lên server
3. **Error Handling**: Lỗi được hiển thị rõ ràng cho người dùng
4. **Loading States**: Hiển thị trạng thái loading khi thực hiện API calls
5. **Responsive**: Giao diện responsive, hoạt động tốt trên mobile

## Testing

Sử dụng file `test-discount-api.html` để test API trực tiếp:

1. Mở file trong trình duyệt
2. Thay đổi `ACCESS_TOKEN` thành token hợp lệ
3. Test các chức năng CRUD

## Troubleshooting

### Lỗi thường gặp

1. **401 Unauthorized**: Access token không hợp lệ hoặc đã hết hạn
2. **404 Not Found**: API endpoint không tồn tại
3. **400 Bad Request**: Dữ liệu gửi lên không đúng format
4. **500 Internal Server Error**: Lỗi server

### Cách khắc phục

1. Kiểm tra access token trong localStorage
2. Đảm bảo server đang chạy trên port 8080
3. Kiểm tra format dữ liệu gửi lên
4. Liên hệ admin để kiểm tra logs server 