import http from '../../request'

export const getAds = () => {
  return http.get('/ads')
}
