<template>
  <NoticePage 
    title="所有通告" 
    titleEn="All Notices"
    :pdf-source="pdfSources" 
    current-route="/allNotice" 
  />
</template>

<script setup lang="ts">
import NoticePage from '@renderer/components/page/NoticePage.vue'
import { noticeStore } from '@renderer/stores/notice_store'
import { onMounted, ref, watch } from 'vue'

interface Notice {
  id: number
  mess_title: string
  mess_type: string
  mess_file: string
  created_at?: string
}

const pdfSources = ref<Notice[]>([])

const updateSources = () => {
  // 获取所有通知
  const commonNotices = noticeStore().getNotices_common.map(notice => ({
    ...notice,
    created_at: notice.created_at || undefined
  }))
  
  const advNotices = noticeStore().getNotices_adv.map(notice => ({
    ...notice,
    created_at: notice.created_at || undefined
  }))
  
  const downloadedCommon = noticeStore().getNotices_hasDownload_common.map(notice => ({
    ...notice,
    created_at: notice.created_at || undefined
  }))
  
  const downloadedAdv = noticeStore().getNotices_hasDownload_adv.map(notice => ({
    ...notice,
    created_at: notice.created_at || undefined
  }))

  // 合并所有通知并去重
  const allNotices = [...commonNotices, ...advNotices, ...downloadedCommon, ...downloadedAdv]
  
  // 使用Map去重，保留最新的版本
  const noticeMap = new Map()
  allNotices.forEach(notice => {
    const existing = noticeMap.get(notice.id)
    if (!existing || (notice.created_at && (!existing.created_at || new Date(notice.created_at) > new Date(existing.created_at)))) {
      noticeMap.set(notice.id, notice)
    }
  })
  
  // 转换回数组并按时间排序
  pdfSources.value = Array.from(noticeMap.values())
}

// 监听store变化
watch(
  [
    () => noticeStore().getNotices_common,
    () => noticeStore().getNotices_adv,
    () => noticeStore().getNotices_hasDownload_common,
    () => noticeStore().getNotices_hasDownload_adv
  ],
  () => {
    updateSources()
  }
)

onMounted(() => {
  updateSources()
})
</script> 