import axios from 'axios';

const BASE_URL = '/api'

// 类型定义
interface LoginRequest {
  ismartId: string
  password: string
}

interface LoginResponse {
  data: {
    id: number
    ismartId: string
    name: string
    remark: string
  }
  message: string
  token: string
}

interface FileInfo {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: null | string
  size: number
  md5: string
  path: string
  mimeType: string
  oss: 'local' | 'aws' | string
  uploader: string
  uploaderId: number
  uploaderType: string
}

interface Advertisement {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: null | string
  title: string
  description: string
  type: 'video' | 'image'
  status: string
  duration: number
  startTime: number
  display: 'full' | 'top' | 'topfull'
  fileId: number
  file: FileInfo
  isPublic: boolean
}

interface Notice {
  id: number
  createdAt: string
  updatedAt: string
  deletedAt: null | string
  title: string
  description: string
  type: 'urgent' | 'common' | 'government' | 'system'
  isPublic: boolean
  fileId: number | null
  file: FileInfo
  fileType: string
}

interface ApiResponse<T> {
  data: T
  message: string
}

// API 实现
const api = {
  /**
   * 登录接口
   * @param credentials 登录凭证
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(
      `${BASE_URL}/api/admin/building/login`,
      credentials
    )
    return response.data
  },

  /**
   * 获取广告列表
   * @param token Bearer token (可选，如果不传则从localStorage获取)
   */
  getAdvertisements: async (token?: string): Promise<ApiResponse<Advertisement[]>> => {
    const authToken = token || getStoredToken();
    if (!authToken) {
      throw new Error('No token available');
    }

    const response = await axios.get<ApiResponse<Advertisement[]>>(
      `${BASE_URL}/api/admin/building/client/advertisements`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    )
    return response.data
  },

  /**
   * 获取通知列表
   * @param token Bearer token (可选，如果不传则从localStorage获取)
   */
  getNotices: async (token?: string): Promise<ApiResponse<Notice[]>> => {
    const authToken = token || getStoredToken();
    if (!authToken) {
      throw new Error('No token available');
    }

    const response = await axios.get<ApiResponse<Notice[]>>(
      `${BASE_URL}/api/admin/building/client/notices`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      }
    )
    return response.data
  }
}

// 创建axios实例
const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

// 在现有代码的合适位置添加
const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
}

// 导出getStoredToken函数以便其他地方使用
export { getStoredToken };

export default api
export type {
  Advertisement,
  ApiResponse,
  FileInfo,
  LoginRequest,
  LoginResponse,
  Notice,
};
