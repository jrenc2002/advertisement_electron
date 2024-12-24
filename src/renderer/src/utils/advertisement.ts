import axios, { AxiosInstance } from 'axios';

const baseURL = 'http://121.40.160.35:10080'

const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 100000
})

// 请求拦截
http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截
http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default http
