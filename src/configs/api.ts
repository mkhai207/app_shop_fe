export const BASE_URL = process.env.NEXT_PUBLIC_API_HOST || 'http://localhost:8080/api/v0'
export const AI_URL = 'http://localhost:8000'

export const CONFIG_API = {
  AUTH: {
    INDEX: `${BASE_URL}/auth`,
    AUTH_ME: `${BASE_URL}/auth/me`
  },
  MANAGE_PRODUCT: {
    PRODUCT: {
      INDEX: `${BASE_URL}/products`,
      GET_ALL_PRODUCTS_PUBLIC: `${BASE_URL}/products/get-products`,
      GET_DETAIL_PRODUCT_PUBLIC: `${BASE_URL}/products/get-product`
    }
  },
  CART: {
    INDEX: `${BASE_URL}/carts`
  },
  ORDER: {
    INDEX: `${BASE_URL}/orders`
  },
  CATEGORY: {
    INDEX: `${BASE_URL}/categories`
  },
  BRAND: {
    INDEX: `${BASE_URL}/brands`
  },
  PRODUCT: {
    INDEX: `${BASE_URL}/products`
  },
  FILE: {
    UPLOAD: `${BASE_URL}/upload`
  },
  AI_RECOMMEND: {
    INDEX: `${AI_URL}/recommendations`,
    GET_SIMILAR_PRODUCTS: `${AI_URL}/recommendations_by_product`
  }
}
