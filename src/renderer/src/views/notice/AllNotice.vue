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

const pdfSources = ref<{ id: number; mess_title: string; mess_type: string; mess_file: string; created_at?: string }[]>([])

const updateSources = () => {
  // 合并所有类型的通知
  const allNotices = [
    ...noticeStore().getNotices_hasDownload_common,
    ...noticeStore().getNotices_hasDownload_adv,
    ...noticeStore().getNotices_common,
    ...noticeStore().getNotices_adv
  ].map(notice => ({
    ...notice,
    created_at: notice.created_at || new Date().toISOString() // 确保有创建时间
  }))

  // 使用 Map 去重，以 id 为键，保留最新的记录
  const uniqueNotices = new Map()
  allNotices.forEach(notice => {
    const existing = uniqueNotices.get(notice.id)
    if (!existing || (notice.created_at && (!existing.created_at || new Date(notice.created_at) > new Date(existing.created_at)))) {
      uniqueNotices.set(notice.id, notice)
    }
  })

  pdfSources.value = Array.from(uniqueNotices.values())
}

// 监听 store 变化
watch(
  [
    () => noticeStore().getNotices_hasDownload_common,
    () => noticeStore().getNotices_hasDownload_adv,
    () => noticeStore().getNotices_common,
    () => noticeStore().getNotices_adv
  ],
  () => {
    updateSources()
  },
  { immediate: true } // 确保首次加载时也执行
)

onMounted(() => {
  updateSources()
})
</script> 