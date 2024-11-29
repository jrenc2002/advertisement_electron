<!-- src/renderer/src/views/governmentNotice.vue -->
<template>
  <NoticePage title="一般通告" :pdf-source="pdfSources" current-route="/generalNotice" />
</template>

<script setup lang="ts">
import NoticePage from '@renderer/components/page/NoticePage.vue'
import { noticeStore } from '@renderer/stores/notice_store'
import { onMounted, ref } from 'vue'

const pdfSources = ref<{ id: number; mess_title: string; mess_type: string; mess_file: string }[]>(
  []
)

onMounted(() => {
  if (noticeStore().getNotices_hasDownload_common.length !== 0) {
    pdfSources.value = noticeStore().getNotices_hasDownload_common
  } else {
    pdfSources.value = noticeStore().getNotices_common
  }
})
</script>
