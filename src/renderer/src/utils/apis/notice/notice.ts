import noticeHttp from '../../notice'

export const getNotices = (data: any) => {
  return noticeHttp.post('', data)
}
// {"blg_id":"0314100"}
