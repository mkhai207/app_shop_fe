# Hướng dẫn sử dụng chức năng tạo đơn hàng mới

## Tổng quan
Chức năng tạo đơn hàng mới đã được thêm vào trang quản lý đơn hàng (`/manage-system/order`). Chức năng này cho phép admin tạo đơn hàng mới trực tiếp từ giao diện và lưu vào database thông qua API.

## Cách sử dụng

### 1. Truy cập trang quản lý đơn hàng
- Đăng nhập vào hệ thống với quyền admin
- Truy cập vào trang `/manage-system/order`

### 2. Tạo đơn hàng mới
- Nhấn nút **"Thêm đơn hàng"** ở góc trên bên trái
- Điền đầy đủ thông tin trong form:
  - **Tên khách hàng** (bắt buộc)
  - **Số điện thoại** (bắt buộc)
  - **Địa chỉ giao hàng** (bắt buộc)
  - **Phương thức thanh toán** (bắt buộc): CASH hoặc ONLINE
  - **Mã giảm giá** (tùy chọn)

### 3. Thêm chi tiết đơn hàng
- Trong phần "Chi tiết đơn hàng":
  - Nhập **ID biến thể sản phẩm** (product_variant_id)
  - Nhập **Số lượng** sản phẩm
  - Có thể thêm nhiều sản phẩm bằng nút "Thêm sản phẩm"
  - Có thể xóa sản phẩm bằng nút "Xóa"

### 4. Lưu đơn hàng
- Nhấn nút **"Lưu"** để tạo đơn hàng
- Hệ thống sẽ gọi API và hiển thị thông báo kết quả

## API Specification

### Endpoint
```
POST /api/v0/orders/create
```

### Headers
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Request Body
```json
{
  "orderDetails": [
    {
      "product_variant_id": 1,
      "quantity": 2
    }
  ],
  "name": "Tên người nhận",
  "phone": "Số điện thoại",
  "shipping_address": "Địa chỉ giao hàng",
  "paymentMethod": "CASH" | "ONLINE",
  "discount_code": "MÃ_GIẢM_GIÁ" // tùy chọn
}
```

### Response
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Order created successfully",
  "data": {
    "id": 123,
    "name": "Tên người nhận",
    "phone": "Số điện thoại",
    "shipping_address": "Địa chỉ giao hàng",
    "payment_method": "CASH",
    "status": "PENDING",
    "total_money": 100000,
    "discount_id": null,
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z",
    "created_by": "admin",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "updated_by": "admin"
  },
  "error": null
}
```

## Validation

### Validation phía frontend
- Tên khách hàng không được để trống
- Số điện thoại không được để trống
- Địa chỉ giao hàng không được để trống
- Phương thức thanh toán phải được chọn
- Phải có ít nhất một sản phẩm trong đơn hàng
- ID biến thể sản phẩm và số lượng phải là số dương

### Validation phía backend
- Kiểm tra quyền truy cập (authentication)
- Validate dữ liệu đầu vào
- Kiểm tra tồn tại của product_variant_id
- Kiểm tra mã giảm giá (nếu có)

## Error Handling

### Lỗi thường gặp
1. **401 Unauthorized**: Chưa đăng nhập hoặc token hết hạn
2. **400 Bad Request**: Dữ liệu đầu vào không hợp lệ
3. **404 Not Found**: Product variant không tồn tại
4. **500 Internal Server Error**: Lỗi server

### Xử lý lỗi trong UI
- Hiển thị thông báo lỗi cụ thể
- Disable nút "Lưu" khi đang xử lý
- Hiển thị loading indicator

## Testing

### File test API
Sử dụng file `test-create-order-api.html` để test API trực tiếp:
1. Mở file trong trình duyệt
2. Điền thông tin test
3. Nhấn "Tạo đơn hàng"
4. Kiểm tra kết quả trong console và UI

### Test cases
1. Tạo đơn hàng với đầy đủ thông tin
2. Tạo đơn hàng với mã giảm giá
3. Tạo đơn hàng với nhiều sản phẩm
4. Test validation (để trống trường bắt buộc)
5. Test với token không hợp lệ

## Files đã được cập nhật

### 1. Service Layer
- `src/services/order.ts`: Thêm function `createOrder`

### 2. Hook Layer
- `src/hooks/useOrder.tsx`: Thêm function `createNewOrder`

### 3. UI Layer
- `src/views/pages/manage-system/order/index.tsx`: Cập nhật form tạo đơn hàng

### 4. Test Files
- `test-create-order-api.html`: File test API

## Lưu ý quan trọng

1. **Authentication**: Cần đăng nhập và có token hợp lệ
2. **Product Variant ID**: Phải sử dụng ID thực tế từ database
3. **Discount Code**: Mã giảm giá phải tồn tại trong hệ thống
4. **Payment Method**: Chỉ hỗ trợ CASH và ONLINE
5. **Order Status**: Đơn hàng mới sẽ có status mặc định là PENDING

## Troubleshooting

### Lỗi "Product variant not found"
- Kiểm tra lại product_variant_id có tồn tại trong database
- Sử dụng API lấy danh sách product variants để lấy ID chính xác

### Lỗi "Invalid discount code"
- Kiểm tra mã giảm giá có tồn tại và còn hiệu lực
- Để trống trường này nếu không có mã giảm giá

### Lỗi "Unauthorized"
- Đăng xuất và đăng nhập lại
- Kiểm tra token trong localStorage
- Kiểm tra quyền truy cập của user 