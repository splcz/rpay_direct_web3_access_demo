import axios from 'axios'

// API 配置
// 开发环境用 Vite proxy，生产环境用 Vercel rewrites，都使用相对路径
const BASE_URL = ''
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

// 通用响应结构
interface ApiResponse<T = unknown> {
  code: number
  data: T
  level: string | null
  msg: string
  success: boolean
}

// 响应拦截器 - 统一处理响应，直接返回 data 字段
apiClient.interceptors.response.use(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (response): any => {
    const res = response.data as ApiResponse
    if (res.success && res.code === 200) {
      return res.data
    }
    // 业务错误
    return Promise.reject(new Error(res.msg || 'Unknown error'))
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default apiClient
