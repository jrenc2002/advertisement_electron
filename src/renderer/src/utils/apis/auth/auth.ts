import http from '../../request'

export const login = (data: any) => {
  return http.post('/admin/login', data)
}
