import http from '@renderer/utils/advertisement'

export const getAds = () => {
  return http.get('/ads')
}
