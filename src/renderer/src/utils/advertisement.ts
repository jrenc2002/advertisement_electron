import axios, { AxiosInstance } from 'axios'
const baseURL = 'http://localhost:8080'
const http: AxiosInstance = axios.create({
  baseURL,
  timeout: 100000
})
// 请求拦截
http.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token')
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    console.log(error)
  }
)
// 响应拦截
http.interceptors.response.use((res) => {
  return res
})

export default http
