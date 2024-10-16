<!-- src/renderer/src/components/PDFViewer.vue -->
<template>
  <div class="pdf-viewer">
    <PDF
      :src="pdfUrl"
      :page="currentPage"
      :pdf-width="'90%'"
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
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import PDF from 'pdf-vue3'

defineProps<{
  pdfUrl: string
  currentPage: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const handlePageChange = (page: number) => {
  emit('page-change', page)
}
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  height: 56%;
}

.pdf-viewer :deep(.pdf-vue3-scroller::-webkit-scrollbar) {
  width: 8px; /* 滚动条宽度 */
}

.pdf-viewer :deep(.pdf-vue3-scroller::-webkit-scrollbar-track) {
  background: #ccc; /* 滚动条轨道背景色 */
  border-radius: 4px;
}

.pdf-viewer :deep(.pdf-vue3-scroller::-webkit-scrollbar-thumb) {
  background-color: #888; /* 滚动条滑块颜色 */
  border-radius: 4px;
  border: 1px solid #f1f1f1; /* 滚动条滑块边框，模拟轨道间距 */
}

.pdf-viewer :deep(.pdf-vue3-scroller::-webkit-scrollbar-thumb:hover) {
  background-color: #555; /* 滚动条滑块悬停颜色 */
}
</style>
