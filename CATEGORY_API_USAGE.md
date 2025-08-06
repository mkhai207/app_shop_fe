# Hướng dẫn sử dụng Category API

## API Endpoint: GET /api/v0/categories/get-categories

### Mô tả
API này được sử dụng để lấy tất cả thông tin phân loại (categories) từ hệ thống.

### Thông tin API
- **URL**: `GET /api/v0/categories/get-categories`
- **Headers**: `Content-Type: application/json`
- **Authentication**: Không yêu cầu
- **Method**: GET

### Response Format
```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Lấy danh sách phân loại thành công",
  "data": [
    {
      "id": 1,
      "created_at": "2024-01-01T00:00:00.000Z",
      "created_by": "admin",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "updated_by": "admin",
      "code": "CAT001",
      "name": "Thời trang nam"
    }
  ],
  "error": null,
  "meta": {
    "totalItems": 10,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10
  }
}
```

### Cách sử dụng trong ứng dụng

#### 1. Service Layer (src/services/category.ts)
```typescript
import axios from 'axios'
import { CONFIG_API } from 'src/configs/api'
import { CategoryResponse } from 'src/types/category'

export const getCategories = async () => {
  try {
    const res = await axios.get(CONFIG_API.CATEGORY.GET_CATEGORIES, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return res.data
  } catch (error) {
    throw error
  }
}

export const categoryService = {
  getCategories
}
```

#### 2. Hook Layer (src/hooks/useCategory.tsx)
```typescript
import { useState, useCallback } from 'react'
import { categoryService } from 'src/services/category'
import { TCategory, CategoryResponse } from 'src/types/category'

export const useCategory = () => {
  const [categories, setCategories] = useState<TCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response: CategoryResponse = await categoryService.getCategories()
      
      if (response.status === 'success' && response.data) {
        setCategories(response.data)
      } else {
        setError(response.message || 'Có lỗi xảy ra khi tải danh sách phân loại')
      }
      
      return response
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi tải danh sách phân loại'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories
  }
}
```

#### 3. Component Layer (src/views/pages/manage-system/category/index.tsx)
```typescript
import React, { useEffect } from 'react'
import { useCategory } from 'src/hooks/useCategory'

const ManageCategoryPage: React.FC = () => {
  const { fetchCategories, categories, loading, error } = useCategory()

  useEffect(() => {
    const loadCategories = async () => {
      try {
        await fetchCategories()
      } catch (err: any) {
        console.error('Error loading categories:', err)
      }
    }

    loadCategories()
  }, [fetchCategories])

  // Render component với data từ API
  return (
    <div>
      {loading && <div>Đang tải...</div>}
      {error && <div>Lỗi: {error}</div>}
      {categories.map(category => (
        <div key={category.id}>
          {category.name} - {category.code}
        </div>
      ))}
    </div>
  )
}
```

### Type Definitions (src/types/category/index.ts)
```typescript
export interface TCategory {
  id: number
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  code: string
  name: string
}

export interface CategoryResponse {
  status: string
  statusCode: number
  message: string
  data: TCategory[]
  error: null | string
  meta: {
    totalItems: number
    totalPages: number
    currentPage: number
    limit: number
  }
}
```

### Cấu hình API (src/configs/api.ts)
```typescript
export const CONFIG_API = {
  // ... other configs
  CATEGORY: {
    INDEX: `${BASE_URL}/categories`,
    GET_CATEGORIES: `${BASE_URL}/categories/get-categories`
  }
}
```

### Test API
Sử dụng file `test-category-api.html` để test API endpoint:
1. Mở file trong trình duyệt
2. Click nút "Test API"
3. Kiểm tra kết quả trả về

### Lưu ý
- API không yêu cầu authentication
- Đảm bảo server backend đang chạy trên port 8080
- Kiểm tra CORS configuration nếu có lỗi cross-origin
- Response data sẽ được hiển thị trong bảng quản lý phân loại 