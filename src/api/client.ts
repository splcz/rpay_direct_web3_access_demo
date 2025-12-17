import axios from 'axios'

// API 配置
// 开发环境使用代理，生产环境使用实际地址
const BASE_URL = import.meta.env.DEV ? '' : 'http://api.rp-2023app.com'
const AUTH_TOKEN = '48bd9a71-4289-450d-b005-620726617fba'

// 创建 axios 实例
export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加 Authorization header
apiClient.interceptors.request.use(
  (config) => {
    config.headers['X-Token'] = `${AUTH_TOKEN}`
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理响应
apiClient.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default apiClient
