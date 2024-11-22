<!-- src/renderer/src/views/governmentNotice.vue -->
<template>
  <NoticePage title="一般通告" :pdf-source="pdfSource" current-route="/generalNotice" />
</template>

<script setup lang="ts">
import NoticePage from '@renderer/components/Page/NoticePage.vue'
import { noticeStore } from '@renderer/stores/notice_store'
import { onMounted, ref } from 'vue'

const pdfSource = ref<{ id: number; mess_title: string; mess_type: string; mess_file: string }[]>(
  []
)

onMounted(() => {
  console.log(noticeStore().getNotices_common)
  pdfSource.value = noticeStore().getNotices_common
})
</script>
