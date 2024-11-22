import http from '../../advertisement'

export const getAds = () => {
  return http.get('/ads')
}
