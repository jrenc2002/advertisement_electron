/*
 * 下载图片和视频的工具函数
 * 主要功能包括:
 * 1. 下载并存储广告图片
 * 2. 下载并存储广告视频
 * 3. 下载并存储PDF通知文件
 * 4. 定时任务执行函数
 */

import axios from 'axios';
import  api  from '@renderer/apis';
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
    // 使用file.path作为图片URL
    const imageUrl = ad.file?.path;
    if (!imageUrl) {
      throw new Error('No image URL available');
    }

    // 使用electron API直接下载
    const filename = `${ad.id}.${ad.file.mimeType.split('/').pop()}`;
    const result = await window.api.downloadImage(PathName, imageUrl, filename);

    if (result.success && result.path) {
      adsStore.addDownloadedAd(ad, result.path);
      return { success: true, path: result.path };
    } else {
      console.error(`download image failed: ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error(`download image ${ad.title} failed:`, error);
    useNotificationStore().addNotification(`下載圖片失敗: ${ad.title}`, 'error');
    return { success: false, error: error };
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
  console.log('adsToDownload',adsStore.getDownloadedAds ,adsToDownload)

  // 创建下载任务数组
  const downloadTasks = adsToDownload.map(async (ad) => {
    // 确保ad对象存在且有正确的结构
    if (!ad || !ad.id) {
      console.error('Invalid advertisement object:', ad);
      return { adId: null, status: 'error', error: 'Invalid advertisement data' };
    }

    const adId = ad.id; // 直接使用ad.id而不是ad.advertisement_id

    try {
      let result: any = null;
      let status = 'noskip';

      // 根据广告类型和状态决定下载方式
      if (ad.type === 'image') { // 修改这里，直接使用ad.type
        result = await downloadImage(ad, 'img');
      } else if (ad.type === 'video') {
        result = await downloadVideo(ad, 'video');
      } else {
        status = 'skip';
      }

      // 处理下载结果
      if (status === 'noskip') {
        if (result && result.success) {
          return { adId, status: 'success' };
        } else {
          console.log(`download ad ID=${adId} failed: ${result ? result.error : 'unknown error'}`);
          return { adId, status: 'failed', error: result ? result.error : 'unknown error' };
        }
      }

      return { adId, status: 'skipped' };
    } catch (error: any) {
      console.error(`download ad ID=${adId} failed:`, error);
      return { adId, status: 'error', error: error?.message || 'unknown error' };
    }
  });

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
    // 使用file.path作为视频URL
    const videoUrl = ad.file?.path;
    if (!videoUrl) {
      throw new Error('No video URL available');
    }

    // 使用electron API直接下载
    const filename = `${ad.id}.${ad.file.mimeType.split('/').pop()}`;
    const result = await window.api.downloadVideo(PathName, videoUrl, filename);

    if (result.success && result.path) {
      adsStore.addDownloadedAd(ad, result.path);
      return { success: true, path: result.path };
    } else {
      console.error(`download video failed: ${result.error}`);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error(`download video ${ad.title} failed:`, error);
    useNotificationStore().addNotification(`下載視頻失敗: ${ad.title}`, 'error');
    return { success: false, error: error };
  }
}

/**
 * 下载单个PDF文件
 * @param notice - 通知对象
 * @param PathName - 存储路径名称 ('common' 或 'adv')
 */
export const downloadAndStorePDF = async (notice, PathName) => {
  const noticeStore = useNoticeStore();
  const notificationStore = useNotificationStore();
  
  try {
    const pdfUrl = notice.file.path;
    const filename = `${notice.id}.pdf`;
    
    const result = await window.api.downloadPDF(PathName, pdfUrl, filename);

    if (result.success && result.path) {
      noticeStore.addDownloadedNotice(notice, result.path);
    } else {
      // 处理下载失败的情况
      const errorMessage = `下載PDF "${notice.title}" 失敗: ${result.error}`;
      console.error(errorMessage);
      notificationStore.addNotification(errorMessage, 'error');
    }
  } catch (error: any) {
    // 特别处理403错误
    if (error.response?.status === 403) {
      const errorMessage = `下載PDF "${notice.title}" 失敗: 無訪問權限 (403 Forbidden)`;
      console.error(errorMessage);
      notificationStore.addNotification(errorMessage, 'error');
    } else {
      const errorMessage = `下載PDF "${notice.title}" 失敗: ${error.message || '未知錯誤'}`;
      console.error(errorMessage);
      notificationStore.addNotification(errorMessage, 'error');
    }
  }
}

/**
 * 下载所有PDF文件
 * 包括普通通知和广告通知的PDF
 */
export const downloadAllPDFs = async () => {
  const noticeStore = useNoticeStore();
  const notificationStore = useNotificationStore();
  
  // 获取所有通知
  const allNotices = [
    ...noticeStore.commonNotices,
    ...noticeStore.governmentNotices,
    ...noticeStore.systemNotices,
    ...noticeStore.urgentNotices
  ];

  let errorCount = 0;

  // 下载所有通知的PDF
  for (const notice of allNotices) {
    try {
      // 检查是否已下载
      if (noticeStore.isNoticeDownloaded(notice.id)) {
        continue;
      }
      
      // 确保notice有file对象且有path
      if (notice.fileId && notice.file && notice.file.path) {
        await downloadAndStorePDF(notice, notice.type);
      }
    } catch (error: any) {
      errorCount++;
      console.error(`下載通知 ${notice.title} 的PDF失敗:`, error);
      continue;
    }
  }

  // 如果有错误，显示汇总通知
  if (errorCount > 0) {
    notificationStore.addNotification(
      `共有 ${errorCount} 個PDF文件下載失敗，請檢查網絡連接或訪問權限`,
      'warning',
      5000
    );
  }
}

/**
 * 定时任务主函数
 * 执行以下操作:
 * 1. 验证登录状态
 * 2. 更新广告数据
 * 3. 下载新的广告资源
 * 4. 更新通知数据
 * 5. 下载新的通知文件
 */
export const timeTask = async () => {
  const adsStore = useAdsStore();
  const noticeStore = useNoticeStore();
  const notificationStore = useNotificationStore();

  const user_name = localStorage.getItem('ismartId');
  const password = localStorage.getItem('password');

  if (!user_name || !password) {
    notificationStore.addNotification('請先登錄', 'error');
    throw new Error('未登录状态');
  }

  try {
    // 1. 更新广告数据
    adsStore.clearAds()
    const adsResponse = await api.getAdvertisements();
    adsStore.setAds(adsResponse.data);
    
    // 2. 下载新的广告资源
    await downloadAllAds();
    
    notificationStore.addNotification('資源更新成功', 'success');
  } catch (error) {
    console.error('資源更新失敗:', error);
    notificationStore.addNotification('資源更新失敗，請檢查網絡連接', 'error');
    throw error;
  }
};
