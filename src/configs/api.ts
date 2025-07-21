const BASE_URL = process.env.APP_API_URL || 'http://localhost:8080/api/v0'

export const CONFIG_API = {
  AUTH: {
    INDEX: `${BASE_URL}/auth/login`
  }
}
