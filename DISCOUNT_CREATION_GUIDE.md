# 🎯 Hướng Dẫn Tạo Khuyến Mãi

## 📋 Tổng Quan

Chức năng tạo khuyến mãi đã được cập nhật để sử dụng API endpoint mới: `POST /api/v0/discounts/create-discount`

## 🔧 Các Thay Đổi Đã Thực Hiện

### 1. Cập Nhật API Configuration
- **File**: `src/configs/api.ts`
- **Thay đổi**: Thêm endpoint mới `CREATE_DISCOUNT: ${BASE_URL}/discounts/create-discount`

### 2. Cập Nhật Service
- **File**: `src/services/discount.ts`
- **Thay đổi**: Cập nhật method `createDiscount` để sử dụng endpoint mới

### 3. Cập Nhật Types
- **File**: `src/types/discount/index.ts`
- **Thay đổi**: `discount_value` từ `string` thành `number`

### 4. Cập Nhật Component
- **File**: `src/views/pages/manage-system/discount/index.tsx`
- **Thay đổi**:
  - Cập nhật state management cho `discount_value`
  - Thêm validation cho form
  - Thêm thông báo thành công/lỗi
  - Thêm loading state cho nút "Lưu"

## 🚀 Cách Sử Dụng

### 1. Truy Cập Trang Quản Lý Khuyến Mãi
- Đăng nhập với tài khoản có quyền admin
- Truy cập: `/manage-system/discount`

### 2. Tạo Khuyến Mãi Mới
1. Click nút **"Thêm khuyến mãi"**
2. Điền thông tin khuyến mãi:
   - **Mã khuyến mãi**: Mã duy nhất (VD: SUMMER2024)
   - **Tên khuyến mãi**: Tên mô tả (VD: Khuyến mãi mùa hè)
   - **Mô tả**: Mô tả chi tiết
   - **Loại giảm**: Chọn "Phần trăm" hoặc "Số tiền cố định"
   - **Giá trị giảm**: Nhập số (VD: 20 cho 20%)
   - **Hiệu lực từ**: Thời gian bắt đầu (Chỉ nhập số, tự động format: DD/MM/YYYY HH:mm)
   - **Hiệu lực đến**: Thời gian kết thúc (Chỉ nhập số, tự động format: DD/MM/YYYY HH:mm)
   - **Giá trị đơn hàng tối thiểu**: Số tiền tối thiểu để áp dụng
   - **Giá trị giảm tối đa**: Giới hạn số tiền giảm tối đa (tùy chọn)

3. Click **"Lưu"** để tạo khuyến mãi

### 3. Validation
Hệ thống sẽ kiểm tra:
- ✅ Mã khuyến mãi không được để trống
- ✅ Tên khuyến mãi không được để trống
- ✅ Giá trị giảm phải lớn hơn 0
- ✅ Thời gian hiệu lực phải được nhập theo định dạng DD/MM/YYYY HH:mm
- ✅ Thời gian kết thúc phải sau thời gian bắt đầu
- ✅ Định dạng ngày tháng phải hợp lệ (VD: 03/08/2025 00:00)

## 🔌 API Endpoint

### Request
```http
POST /api/v0/discounts/create-discount
Content-Type: application/json
Authorization: Bearer <admin_token>
```

### Request Body
```json
{
  "code": "SUMMER2024",
  "name": "Khuyến mãi mùa hè",
  "description": "Giảm giá cho tất cả sản phẩm mùa hè",
  "discount_value": 20,
  "discount_type": "PERCENTAGE",
  "valid_from": "2024-06-01T00:00:00.000Z",
  "valid_until": "2024-08-31T23:59:59.000Z",
  "minimum_order_value": 500000,
  "max_discount_amount": 200000
}
```

### Response Success
```json
{
  "status": "success",
  "statusCode": 201,
  "message": "Discount created successfully",
  "data": {
    "id": 1,
    "code": "SUMMER2024",
    "name": "Khuyến mãi mùa hè",
    "description": "Giảm giá cho tất cả sản phẩm mùa hè",
    "discount_value": 20,
    "discount_type": "PERCENTAGE",
    "valid_from": "2024-06-01T00:00:00.000Z",
    "valid_until": "2024-08-31T23:59:59.000Z",
    "minimum_order_value": 500000,
    "max_discount_amount": 200000,
    "created_at": "2024-01-15T10:30:00.000Z",
    "created_by": "admin@example.com",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "updated_by": "admin@example.com"
  }
}
```

## 🧪 Test API

### Sử Dụng File Test
1. Mở file `test-create-discount-api.html` trong trình duyệt
2. Nhập Bearer Token của admin
3. Điền thông tin khuyến mãi
4. Click "Tạo Khuyến Mãi" để test

### Sử Dụng Postman/Curl
```bash
curl -X POST http://localhost:8080/api/v0/discounts/create-discount \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "code": "SUMMER2024",
    "name": "Khuyến mãi mùa hè",
    "description": "Giảm giá cho tất cả sản phẩm mùa hè",
    "discount_value": 20,
    "discount_type": "PERCENTAGE",
    "valid_from": "2024-06-01T00:00:00.000Z",
    "valid_until": "2024-08-31T23:59:59.000Z",
    "minimum_order_value": 500000,
    "max_discount_amount": 200000
  }'
```

## ⚠️ Lưu Ý Quan Trọng

### 1. Quyền Truy Cập
- Chỉ admin mới có thể tạo khuyến mãi
- Token phải có quyền admin hợp lệ

### 2. Validation
- Mã khuyến mãi phải là duy nhất
- Thời gian hiệu lực phải hợp lệ
- Giá trị giảm phải phù hợp với loại giảm

### 3. Data Types
- `discount_value`: number (không phải string)
- `valid_from` và `valid_until`: ISO string format
- `minimum_order_value` và `max_discount_amount`: number

## 🐛 Troubleshooting

### Lỗi Thường Gặp

1. **401 Unauthorized**
   - Kiểm tra Bearer Token
   - Đảm bảo token có quyền admin

2. **400 Bad Request**
   - Kiểm tra format dữ liệu
   - Đảm bảo các trường bắt buộc đã được điền

3. **409 Conflict**
   - Mã khuyến mãi đã tồn tại
   - Thay đổi mã khuyến mãi

4. **500 Internal Server Error**
   - Kiểm tra server logs
   - Đảm bảo database connection

5. **MUI Color Error**
   - Lỗi: "Unsupported color" trong Alert component
   - **Giải pháp**: Đã thay thế Alert component bằng custom notification
   - **Nguyên nhân**: MUI Alert không xử lý được một số giá trị màu

### Debug
- Mở Developer Tools (F12)
- Xem tab Console để kiểm tra lỗi
- Xem tab Network để kiểm tra request/response
- Sử dụng file `test-discount-form.html` để test validation

## 📝 Changelog

### Version 1.0.3
- ✨ Thêm input field với auto-format placeholder
- ✨ Người dùng chỉ cần nhập số, hệ thống tự động format
- ✨ Placeholder hiển thị: DD/MM/YYYY HH:mm
- ✨ Tự động thay thế ký tự placeholder khi nhập
- 🔧 Cải thiện UX với font monospace cho dễ đọc

### Version 1.0.2
- ✨ Thêm hỗ trợ format ngày tháng DD/MM/YYYY HH:mm
- ✨ Tự động chuyển đổi format ngày tháng sang ISO string
- ✨ Cải thiện UX với placeholder và helper text
- 🔧 Cập nhật validation cho format ngày tháng mới
- ✅ Cập nhật file test để hỗ trợ format mới

### Version 1.0.1
- 🔧 Sửa lỗi MUI Alert color error
- 🔧 Thay thế Alert component bằng custom notification
- 🔧 Cải thiện state management cho snackbar
- ✅ Tạo file test form validation

### Version 1.0.0
- ✅ Thêm endpoint mới `/discounts/create-discount`
- ✅ Cập nhật types cho `discount_value`
- ✅ Thêm validation cho form
- ✅ Thêm thông báo thành công/lỗi
- ✅ Thêm loading state
- ✅ Tạo file test API
- ✅ Tạo hướng dẫn sử dụng

---

**Ngày cập nhật**: 15/01/2024  
**Phiên bản**: 1.0.0  
**Tác giả**: Development Team 