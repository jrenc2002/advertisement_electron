/*
 *download image
 */

import axios from 'axios'
import { adsStore } from '../stores/ads_store'
import { noticeStore } from '../stores/notice_store'

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
    console.log('filename image', filename)
    const result = await window.api.downloadImage(PathName, ad.image_url, filename)

    if (result.success) {
      console.log(`image ${filename} download success, path: ${result.path}`)
      adsStore().addAds_hasDownload({ Advertisement: ad, path: result.path })
      adsStore().addAds_hasDownload_path({ AdvertisementID: ad.ID, path: result.path })
      return { success: true, path: result.path }
    } else {
      console.error(`download image failed: ${result.error}`)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error(`download image ${ad.title} failed:`, error)
    return { success: false, error: error }
  }
}

export const downloadAllAds = async () => {
  const allAds = JSON.parse(JSON.stringify(adsStore().getAds))
  console.log('allAds', allAds)

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

  console.log('all ads download tasks completed')
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
    console.log('filename video', filename)
    const result = await window.api.downloadVideo(PathName, ad.video_url, filename)

    if (result.success) {
      console.log(`video ${filename} download success, path: ${result.path}`)
      adsStore().addAds_hasDownload({ Advertisement: ad, path: result.path })
      adsStore().addAds_hasDownload_path({ AdvertisementID: ad.ID, path: result.path })
      return { success: true, path: result.path }
    } else {
      console.error(`download video failed: ${result.error}`)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error(`download video ${ad.title} failed:`, error)
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
          console.log(noticeStore().getNotices_hasDownload_common)
          break
        case 'adv':
          noticeStore().addNotices_hasDownload_adv({ ...notice, path: result.path })
          console.log(noticeStore().getNotices_hasDownload_adv)
          break
      }
      console.log(`PDF "${notice.mess_title}" 存储成功 at ${result.path}`)
    } else {
      console.error(`下载 PDF "${notice.mess_title}" 失败: ${result.error}`)
    }
  } catch (error) {
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
