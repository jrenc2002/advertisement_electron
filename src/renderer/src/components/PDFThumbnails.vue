<!-- src/renderer/src/components/PDFThumbnails.vue -->
<template>
  <div class="thumbnails-container">
    <PDF
      :src="pdfUrl"
      :page="currentPage"
      :pdf-width="'100%'"
      :show-progress="true"
      :show-page-number="true"
      :show-page-tooltip="true"
      :show-back-to-top-btn="false"
      :scroll-threshold="0"
      :row-gap="10"
      :use-system-fonts="false"
      :disable-stream="true"
      :disable-auto-fetch="true"
      @click="selectPage(currentPage)"
      @on-page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import PDF from 'pdf-vue3'
// import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
defineProps<{
  pdfUrl: string
}>()

const currentPage = ref(1)
const emit = defineEmits<{
  (event: 'page-selected', page: number): void
}>()

const selectPage = (page: number) => {
  console.log('selectPage', page)
  currentPage.value = page
  emit('page-selected', page)
}

const handlePageChange = (page: number) => {
  console.log('handlePageChange', page)
  currentPage.value = page
}
// const handlePdfInit = (pdf: PDFDocumentProxy) => {
//   // totalPages.value = pdf.numPages
//   console.log(pdf)
// }
</script>

<style scoped>
.thumbnails-container {
  display: flex;
  flex-direction: column;
  height: 60%;
  overflow-y: auto;
  width: 150px;
  border-right: 1px solid #ddd;
}

.thumbnails-container :deep(.pdf-vue3-scroller::-webkit-scrollbar) {
  width: 8px; /* 滚动条宽度 */
}

.thumbnails-container :deep(.pdf-vue3-scroller::-webkit-scrollbar-track) {
  background: #f1f1f1; /* 滚动条轨道背景色 */
  border-radius: 4px;
}

.thumbnails-container :deep(.pdf-vue3-scroller::-webkit-scrollbar-thumb) {
  background-color: #888; /* 滚动条滑块颜色 */
  border-radius: 4px;
  border: 1px solid #f1f1f1; /* 滚动条滑块边框，模拟轨道间距 */
}

.thumbnails-container:deep(.pdf-vue3-scroller::-webkit-scrollbar-thumb:hover) {
  background-color: #555; /* 滚动条滑块悬停颜色 */
}
</style>
