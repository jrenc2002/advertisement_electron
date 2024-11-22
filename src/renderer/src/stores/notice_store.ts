import { defineStore } from 'pinia'

export interface Notice {
  id: number
  mess_title: string
  mess_type: string
  mess_file: string
}
// {
//   "id": 771,
//   "mess_title": "訪客須知",
//   "mess_type": "common",
//   "mess_file": "https://72ismart.s3.amazonaws.com/blg_mess/0038300/pdf/a9934c3885ae4f30ab6269eb9e75a0be_05_%E8%A8%AA%E5%AE%A2%E9%A0%88%E7%9F%A5_%E4%B8%AD%E6%96%87%E7%89%88_%E8%AD%A6%E5%8B%99%E8%99%95.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIA6HKTBTYTEZNANK7Z%2F20241122%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20241122T161601Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Security-Token=IQoJb3JpZ2luX2VjECgaCWFwLWVhc3QtMSJHMEUCIQDLQPm%2FP1SMtyt7QmgtD0Q31D3fnchn5aR8UoAzRy2doAIgTUrar22dMfWf8RU%2FVYIA%2FvnJj08n2qEIRwNCa2TId7cqjwMIwf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARADGgw5Nzc4MTYxMDAzOTAiDDdUaJXwbJ6clqrq5yrjAqSDx9LRZmKbKlN5Srh3thLTlZK7f6fpvtoJUWHf1hObuoRR2C59AAZ5aPNAsTiAZgahP%2F6qKHMt1%2Bbp8FP4BOZycCsBfXOA3I4Loetz8TPQNhpNMU8oAFw1Z1ks9eb9gvQVjC5k%2Bf8LpiBz2Ph5rJVeWOO9MkxqHTGGIFa8q8OyDKjYTZLaTs2hSEPoUtHYWb5peP%2FOrNGykiu665FXt5Rut2dif%2BHO13qHz%2BJUDw%2BTVaAYQk%2BNQLbGVyrBUpgXhtXHZDApQ%2FcJWgLthiJrWrvkbH8LyI4ZnP9ITrpnKcsMQcJ%2BXey%2BLOl5%2BTATpJJt224VHFJz2yS73%2Fq9ZiDUsPuPowPLOms93flO03U4j6uLyNi3B7ElhOZjY9aZYgGhDW3iZYYE3ONJ7%2F6lbcQl5pj9yM%2B9zs6KJkGTVoj9R5qioVPtJPdfDeaLcsCKC%2FjlK6FsOLgXq3B4B0UPIb%2FRkvyWyPowvdyCugY6ngFwIfOSo3kKz35%2FTsvoZmU524TgfCNPWmwml1eXBqTU%2F4BBXorV6Eu72tFRm0GPhDilcfw6SS%2BDyszMKUPMnMWGbLpxJm0hqTnyHNNFCHECu4AMFeRRUCVqtwwt3TsXhRwP6o3InJYxv3ksf69TjTfGoaJmo4UeLDYJ9NC0TpVFGfZWRSszKubQBtDNiuyGQsymfrqGQGR5GE0YMuTvyA%3D%3D&X-Amz-Signature=03c0f5134c78efebef14183d1c0778a42b998c8d19bc89c7146fe50ae565733e"
// },
// {
export const noticeStore = defineStore('notice', {
  state: () => {
    return {
      notices_common: [] as Notice[],
      notices_adv: [] as Notice[]
    }
  },
  getters: {
    getNotices_common: (state) => state.notices_common,
    getNotices_adv: (state) => state.notices_adv
  },
  actions: {
    setNotices_common(notices: Notice[]) {
      this.notices_common = notices
    },
    setNotices_adv(notices: Notice[]) {
      this.notices_adv = notices
    }
  },
  persist: true
})
