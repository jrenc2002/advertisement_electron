/*
 * 下载图片和视频的工具函数
 * 主要功能包括:
 * 1. 下载并存储广告图片
 * 2. 下载并存储广告视频
 * 3. 下载并存储PDF通知文件
 * 4. 定时任务执行函数
 */

import axios from 'axios';

import { useAdsStore } from '@renderer/stores/ads_store';
import { useNoticeStore } from '@renderer/stores/notice_store';
import { useBuildingStore } from '@renderer/stores/building_store';
import { useNotificationStore } from '@renderer/stores/noticefication_store';


/**
 * 下载单个广告图片
 * @param ad - 广告对象
 * @param PathName - 存储路径名称
 * @returns {Promise<{success: boolean, path?: string, error?: any}>} 
 */
export const downloadImage = async (ad, PathName) => {
  const adsStore = useAdsStore();
  
  try {
    // 使用axios下载图片，设置1秒超时
    const response = await axios.get(ad.image_url, {
      responseType: 'blob',
      timeout: 1000
    })

    // 获取文件类型和扩展名
    const contentType = response.headers['content-type']
    const extension = contentType.split('/').pop()

    // 创建Blob对象和临时下载链接
    const blob = new Blob([response.data], { type: contentType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    // 使用广告ID作为文件名
    const filename = `${ad.ID}.${extension}`

    // 调用electron的API进行实际下载
    const result = await window.api.downloadImage(PathName, ad.image_url, filename)

    if (result.success && result.path) {
      adsStore.addDownloadedAd(ad, result.path);
      return { success: true, path: result.path }
    } else {
      console.error(`download image failed: ${result.error}`)
      return { success: false, error: result.error }
    }
  } catch (error) {
    // 下载失败，显示通知并返回错误信息
    console.error(`download image ${ad.title} failed:`, error)
    useNotificationStore().addNotification(`下載圖片失敗: ${ad.title}`, 'error')
    return { success: false, error: error }
  }
}

/**
 * 下载所有未下载的广告
 * 包括图片和视频广告
 */
export const downloadAllAds = async () => {
  const adsStore = useAdsStore();
  
  // 深拷贝所有广告数据
  const allAds = JSON.parse(JSON.stringify(adsStore.getAllAds));
  // 获取已下载广告的ID列表
  const downloadedAds = adsStore.getDownloadedAds.map(item => item.advertisement.id);

  // 过滤出未下载的广告
  const adsToDownload = allAds.filter(ad => !downloadedAds.includes(ad.id));
  console.log('adsToDownload', adsToDownload)

  // 创建下载任务数组
  const downloadTasks = adsToDownload.map(async (ad) => {
    const adId = ad.advertisement_id

    try {
      let result: any = null
      let status = 'noskip'

      // 根据广告类型和状态决定下载��式
      if (ad.Advertisement.type === 'img' && ad.Advertisement.status === 'active') {
        result = await downloadImage(ad.Advertisement, 'img')
      } else if (ad.Advertisement.type === 'video' && ad.Advertisement.status === 'active') {
        result = await downloadVideo(ad.Advertisement, 'video')
      } else {
        status = 'skip'
      }

      // 处理下载结果
      if (status === 'noskip') {
        if (result && result.success) {
          return { adId, status: 'success' }
        } else {
          console.log(`download ad ID=${adId} failed: ${result ? result.error : 'unknown error'}`)
          return { adId, status: 'failed', error: result ? result.error : 'unknown error' }
        }
      }

      return { adId, status: 'skipped' }
    } catch (error: any) {
      console.error(`download ad ID=${adId} failed:`, error)
      return { adId, status: 'error', error: error || 'unknown error' }
    }
  })

  // 并行执行所有下载任务
  const results = await Promise.allSettled(downloadTasks)

  // 处理每个任务的结果
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { adId, status, error } = result.value
      if (status === 'failed') {
        console.warn(`download ad ID=${adId} failed: ${error}`)
      }
    } else {
      console.error('download ad task error:', result.reason)
    }
  })
}

/**
 * 下载单个视频广告
 * @param ad - 广告对象
 * @param PathName - 存储路径名称
 * @returns {Promise<{success: boolean, path?: string, error?: any}>}
 */
export const downloadVideo = async (ad, PathName) => {
  const adsStore = useAdsStore();
  
  try {
    // 使用axios下载视频，设置10秒超时
    const response = await axios.get(ad.video_url, {
      responseType: 'blob',
      timeout: 10000
    })

    // 获取文件类型和扩展名
    const contentType = response.headers['content-type']
    const extension = contentType.split('/').pop()

    // 创建Blob对象和临时下载链接
    const blob = new Blob([response.data], { type: contentType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    const filename = `${ad.ID}.${extension}`
    const result = await window.api.downloadVideo(PathName, ad.video_url, filename)

    if (result.success && result.path) {
      adsStore.addDownloadedAd(ad, result.path);
      return { success: true, path: result.path }
    } else {
      console.error(`download video failed: ${result.error}`)
      return { success: false, error: result.error }
    }
  } catch (error) {
    // 下载失败，显示通知并返回错误信息
    console.error(`download video ${ad.title} failed:`, error)
    useNotificationStore().addNotification(`下載視頻失敗: ${ad.title}`, 'error')
    return { success: false, error: error }
  }
}

/**
 * 下载单个PDF文件
 * @param notice - 通知对象
 * @param PathName - 存储路径名称 ('common' 或 'adv')
 */
export const downloadAndStorePDF = async (notice, PathName) => {
  const noticeStore = useNoticeStore();
  
  try {
    // 下载PDF文件
    const response = await axios.get(notice.mess_file, {
      responseType: 'blob'
    })
    
    // 创建Blob对象和临时下载链接
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    
    // 使用通知ID作为文件名
    const filename = notice.id + '.pdf'
    const result = await window.api.downloadPDF(PathName, notice.mess_file, filename)

    if (result.success && result.path) {
      noticeStore.addDownloadedNotice(notice, result.path);
    } else {
      console.error(`下载 PDF "${notice.title}" 失败: ${result.error}`);
    }
  } catch (error) {
    useNotificationStore().addNotification(`下載PDF失敗: ${notice.title}`, 'error');
    console.error(`下載 PDF ${notice.title} 失敗:`, error);
  }
}

/**
 * 下载所有PDF文件
 * 包括普通通知和广告通知的PDF
 */
export const downloadAllPDFs = async () => {
  const noticeStore = useNoticeStore();
  
  // 获取所有通知
  const commonNotices = noticeStore.commonNotices;
  const governmentNotices = noticeStore.governmentNotices;
  const systemNotices = noticeStore.systemNotices;
  const urgentNotices = noticeStore.urgentNotices;

  // 合并所有需要下载PDF的通知
  const allNotices = [...commonNotices, ...governmentNotices, ...systemNotices, ...urgentNotices];

  // 下载所有通知的PDF
  for (const notice of allNotices) {
    // 检查是否已下载
    if (noticeStore.isNoticeDownloaded(notice.id)) {
      continue;
    }
    
    if (notice.fileId && notice.file) {
      await downloadAndStorePDF(notice, notice.type);
    }
  }
}

/**
 * 定时任务主函数
 * 执行以下操作:
 * 1. 登录并获取广告数据
 * 2. 下载所有广告
 * 3. 获取并下载所有通知
 */
export const timeTask = async () => {
  const adsStore = useAdsStore();
  const buildingStore = useBuildingStore();
  const noticeStore = useNoticeStore();
  const notificationStore = useNotificationStore();

  // 获取登录凭证
  const user_name = localStorage.getItem('ismartId') || '';
  const password = localStorage.getItem('password') || '';

  // 检查登录状态
  if (!user_name || !password) {
    notificationStore.addNotification('update failed: please login first', 'error')
    return
  }

//   登录并获取广告数据
//   let blg_id = localStorage.getItem('blg_id')
//   await loginBuilding({ user_name, password }).then((res) => {
    // adsStore.setAds(res.data.advertisements_buildings)
    // downloadAllAds()
    // buildingStore.setBuilding(adsStore.getAllAds[0].BuildingAdmin)
    // blg_id = buildingStore.getBuilding.blg_id
//   })

//   获取并处理通知数据
//   await getNotices()
    // .then((res) => {
    //   notificationStore.addNotification('更新成功', 'success');
    //   const notices = res.data;
    //   
    //   直接设置所有通知,store内部会根据类型进行分类
    //   noticeStore.setNotices(notices);
    //   
    //   下载所有PDF
    //   downloadAllPDFs();
    // })
    // .catch((error) => {
    //   console.error('auto update: get notices failed:', error);
    //   notificationStore.addNotification('更新失敗', 'error');
    // });
}
