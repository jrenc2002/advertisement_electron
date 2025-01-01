<!-- src/renderer/src/components/PDFViewer.vue -->
<template>
  <div class="w-full h-full">
    <PDF
      :src="pdfUrl"
      :page="currentPage"
      :pdf-width="'100%'"
      :show-progress="true"
      :show-page-number="true"
      :show-page-tooltip="true"
      :show-back-to-top-btn="true"
      :scroll-threshold="0"
      :row-gap="10"
      :use-system-fonts="false"
      :disable-stream="true"
      :disable-auto-fetch="true"
      @on-page-change="handlePageChange"
      @document-load="handleDocumentLoad"
      class="pdf-container"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, watch } from 'vue'
import PDF from 'pdf-vue3'
import { useFlowStore } from '@renderer/stores/flow_store'

const props = defineProps<{
  pdfUrl: string
  currentPage: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
  (e: 'total-pages', total: number): void
}>()

const flowStore = useFlowStore()

const handlePageChange = (page: number) => {
  emit('page-change', page)
}

// 处理文档加载完成事件
const handleDocumentLoad = (pdf: any) => {
  const totalPages = pdf.numPages
  flowStore.totalNoticePages = totalPages
  emit('total-pages', totalPages)
  console.log('[PDFViewer] PDF加载完成，总页数:', totalPages)
}

// 监听页码变化
watch(() => props.currentPage, (newPage) => {
  console.log('[PDFViewer] 页码变化:', newPage)
  flowStore.currentNoticePage = newPage
})
</script>

<style scoped>
.pdf-container :deep(.pdf-vue3-scroller::-webkit-scrollbar) {
  @apply w-2;
}

.pdf-container :deep(.pdf-vue3-scroller::-webkit-scrollbar-track) {
  @apply bg-gray-200 rounded;
}

.pdf-container :deep(.pdf-vue3-scroller::-webkit-scrollbar-thumb) {
  @apply bg-gray-400 rounded border border-gray-100 hover:bg-gray-500;
}
</style>
