import axios, { AxiosInstance } from 'axios'
const baseURL =
  'https://uqf0jqfm77.execute-api.ap-east-1.amazonaws.com/prod/v1/building_board/building-notices'
const noticeHttp: AxiosInstance = axios.create({
  baseURL,
  timeout: 100000
})
// 请求拦截
noticeHttp.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    console.log(error)
  }
)
// 响应拦截
noticeHttp.interceptors.response.use((res) => {
  return res
})

export default noticeHttp
