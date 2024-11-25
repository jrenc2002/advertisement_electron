<!-- src/renderer/src/views/governmentNotice.vue -->
<template>
  <NoticePage title="緊急通告" :pdf-source="pdfSources" current-route="/urgentNotice" />
</template>

<script setup lang="ts">
import NoticePage from '@renderer/components/Page/NoticePage.vue'
import { noticeStore } from '@renderer/stores/notice_store'
import { onBeforeMount, ref } from 'vue'
const pdfSources = ref<{ id: number; mess_title: string; mess_type: string; mess_file: string }[]>(
  []
)

onBeforeMount(() => {
  if (noticeStore().getNotices_hasDownload_adv.length !== 0) {
    pdfSources.value = noticeStore().getNotices_hasDownload_adv
  } else {
    pdfSources.value = noticeStore().getNotices_adv
  }
})
</script>
