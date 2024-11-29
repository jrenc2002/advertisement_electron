/*
 *download image
 */

import axios from 'axios'
import { adsStore } from '../stores/ads_store'
import { noticeStore } from '../stores/notice_store'
import { loginBuilding } from '@renderer/apis/building/buildings'
import { buildingStore } from '../stores/building_store'
import { getNotices } from '@renderer/apis/notice/notice'
import { useNotificationStore } from '../stores/noticefication_store'

export const downloadImage = async (ad, PathName) => {
  try {
    const response = await axios.get(ad.image_url, {
      responseType: 'blob',
      timeout: 1000
    })

    const contentType = response.headers['content-type']
    const extension = contentType.split('/').pop()

    const blob = new Blob([response.data], { type: contentType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    const filename = `${ad.ID}.${extension}`

    const result = await window.api.downloadImage(PathName, ad.image_url, filename)

    if (result.success) {
      adsStore().addAds_hasDownload({ Advertisement: ad, path: result.path })
      adsStore().addAds_hasDownload_path({ AdvertisementID: ad.ID, path: result.path })
      return { success: true, path: result.path }
    } else {
      console.error(`download image failed: ${result.error}`)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error(`download image ${ad.title} failed:`, error)
    useNotificationStore().addNotification(`下载图片失败: ${ad.title}`, 'error')
    return { success: false, error: error }
  }
}

export const downloadAllAds = async () => {
  const allAds = JSON.parse(JSON.stringify(adsStore().getAds))
  // console.log('allAds', allAds)

  // create all download tasks array
  const downloadTasks = allAds.map(async (ad) => {
    const adId = ad.advertisement_id

    try {
      let result: any = null

      if (ad.Advertisement.type === 'img') {
        result = await downloadImage(ad.Advertisement, 'img')
      } else if (ad.Advertisement.type === 'video') {
        result = await downloadVideo(ad.Advertisement, 'video')
      }

      if (result && result.success) {
        return { adId, status: 'success' }
      } else {
        console.error(`download ad ID=${adId} failed: ${result ? result.error : 'unknown error'}`)
        return { adId, status: 'failed', error: result ? result.error : 'unknown error' }
      }
    } catch (error: any) {
      console.error(`download ad ID=${adId} failed:`, error)
      return { adId, status: 'error', error: error || 'unknown error' }
    }
  })

  // execute all download tasks in parallel and wait for all tasks to complete
  const results = await Promise.allSettled(downloadTasks)

  // handle each task result
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { adId, status, error } = result.value
      if (status === 'success') {
        // already handled in task, no need extra operation
      } else if (status === 'failed') {
        // optional: record failed ad ID
        console.warn(`download ad ID=${adId} failed: ${error}`)
      }
    } else {
      // Promise rejected, record error
      console.error('download ad task error:', result.reason)
    }
  })

  // console.log('all ads download tasks completed')
}
/*
 *download video
 */
export const downloadVideo = async (ad, PathName) => {
  try {
    const response = await axios.get(ad.video_url, {
      responseType: 'blob',
      timeout: 10000
    })

    const contentType = response.headers['content-type']
    const extension = contentType.split('/').pop()

    const blob = new Blob([response.data], { type: contentType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    const filename = `${ad.ID}.${extension}`
    // console.log('filename video', filename)
    const result = await window.api.downloadVideo(PathName, ad.video_url, filename)

    if (result.success) {
      // console.log(`video ${filename} download success, path: ${result.path}`)
      adsStore().addAds_hasDownload({ Advertisement: ad, path: result.path })
      adsStore().addAds_hasDownload_path({ AdvertisementID: ad.ID, path: result.path })
      return { success: true, path: result.path }
    } else {
      console.error(`download video failed: ${result.error}`)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error(`download video ${ad.title} failed:`, error)
    useNotificationStore().addNotification(`下载视频失败: ${ad.title}`, 'error')
    return { success: false, error: error }
  }
}

// 下载单个PDF
export const downloadAndStorePDF = async (notice, PathName) => {
  try {
    const response = await axios.get(notice.mess_file, {
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const filename = notice.id + '.pdf'
    const result = await window.api.downloadPDF(PathName, notice.mess_file, filename)

    if (result.success) {
      switch (PathName) {
        case 'common':
          noticeStore().addNotices_hasDownload_common({ ...notice, path: result.path })
          // console.log(noticeStore().getNotices_hasDownload_common)
          break
        case 'adv':
          noticeStore().addNotices_hasDownload_adv({ ...notice, path: result.path })
          // console.log(noticeStore().getNotices_hasDownload_adv)
          break
      }
      // console.log(`PDF "${notice.mess_title}" 存储成功 at ${result.path}`)
    } else {
      console.error(`下载 PDF "${notice.mess_title}" 失败: ${result.error}`)
    }
  } catch (error) {
    useNotificationStore().addNotification(`下载PDF失败: ${notice.mess_title}`, 'error')
    console.error(`下载 PDF ${notice.mess_title} 失败:`, error)
  }
}

// 下载所有 PDF
//TODO:添加其他两种类型的pdf
export const downloadAllPDFs = async () => {
  const allCommonNotices = noticeStore().getNotices_common
  const allAdvNotices = noticeStore().getNotices_adv
  for (const notice of allCommonNotices) {
    if (noticeStore().getNotices_hasDownload_common.find((item) => item.id === notice.id)) {
      return
    }
    if (notice.mess_file) {
      await downloadAndStorePDF(notice, 'common')
    }
  }
  for (const notice of allAdvNotices) {
    if (noticeStore().getNotices_hasDownload_adv.find((item) => item.id === notice.id)) {
      return
    }
    if (notice.mess_file) {
      await downloadAndStorePDF(notice, 'adv')
    }
  }
}

export const timeTask = async () => {
  const user_name = localStorage.getItem('login-username')
  const password = localStorage.getItem('login-password')

  if (!user_name || !password) {
    useNotificationStore().addNotification('update failed: please login first', 'error')
    return
  }
  let blg_id = ''
  await loginBuilding({ user_name, password }).then((res) => {
    // console.log(res.data)
    adsStore().setAds(res.data.advertisements_buildings)
    // console.log(adsStore().getAds)
    downloadAllAds()
    buildingStore().setBuilding(adsStore().getAds[0].BuildingAdmin)
    blg_id = buildingStore().getBuilding.blg_id
  })

  await getNotices({ blg_id })
    .then((res) => {
      useNotificationStore().addNotification('更新成功', 'success')
      const notices = res.data
      const commonNotices = notices.filter((notice) => notice.mess_type === 'common')
      const advNotices = notices.filter((notice) => notice.mess_type === 'adv')
      noticeStore().setNotices_common(commonNotices)
      noticeStore().setNotices_adv(advNotices)
      noticeStore().setNotices(notices)
      // console.log(noticeStore().getNotices_common)
      // console.log(noticeStore().getNotices_adv)
      downloadAllPDFs()
    })
    .catch((error) => {
      console.error('auto update: get notices failed:', error)
      useNotificationStore().addNotification('更新失败', 'error')
    })
}
