<template>
  <div class="pdf-viewer">
    <PDF
      :src="pdfUrl"
      :page="currentPage"
      :pdf-width="'100%'"
      :show-progress="true"
      :show-page-number="true"
      :show-page-tooltip="true"
      :show-back-to-top-btn="true"
      :scroll-threshold="200"
      :row-gap="10"
      :use-system-fonts="false"
      :disable-stream="true"
      :disable-auto-fetch="true"
      @on-page-change="handlePageChange"
      @on-pdf-init="handlePdfInit"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import PDF from 'pdf-vue3'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

// 定义组件接收的 props
defineProps<{
  pdfUrl: string // PDF 文件的 URL
  currentPage: number // 当前页码
}>()

const totalPages = ref(1)
function handlePdfInit(pdf: PDFDocumentProxy) {
  totalPages.value = pdf.numPages
}
// 定义组件触发的事件
const emit = defineEmits<{
  (e: 'page-change', page: number): void // 当页码变化时触发 'page-change' 事件，传递新页码
}>()

// 处理页码变化的方法
const handlePageChange = (page: number) => {
  emit('page-change', page) // 触发 'page-change' 事件，并传递新页码
}
</script>

<style scoped>
.pdf-viewer {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.pdf-viewer :deep(.pdf-vue3-scroller::-webkit-scrollbar) {
  width: 8px; /* 滚动条宽度 */
}

.pdf-viewer :deep(.pdf-vue3-scroller::-webkit-scrollbar-track) {
  background: #f1f1f1; /* 滚动条轨道背景色 */
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
