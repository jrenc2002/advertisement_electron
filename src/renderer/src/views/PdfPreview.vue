<template>
  <div class="pdf-preview">
    <PDFThumbnails
      :pdf-url="pdfSource"
      @page-selected="handlePageSelected"
    />
    <PDFViewer
      :pdf-url="pdfSource"
      :current-page="currentPage"
      @page-change="updatePage"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue'
import PDFViewer from '@renderer/components/PdfViewer.vue'
import PDFThumbnails from '@renderer/components/PDFThumbnails.vue'

// 定义组件接收的 props
const props = defineProps<{
  pdfSource: string // PDF 文件的 URL
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

// 定义当前页码的响应式变量，初始值为 1
const currentPage = ref(1)

// 当 pdfSource 变化时，重置当前页码到第一页
watch(
  () => props.pdfSource,
  () => {
    currentPage.value = 1
  }
)

// 处理来自 PDFThumbnails 组件的页码选择事件
const handlePageSelected = (page: number) => {
  currentPage.value = page
  emit('page-change', page) // 可选：向父组件传递页码变化事件
}

// 处理来自 PDFViewer 组件的页码变化事件
const updatePage = (page: number) => {
  currentPage.value = page
  emit('page-change', page) // 可选：向父组件传递页码变化事件
}
</script>

<style scoped lang="scss">
.pdf-preview {
  display: flex;
  width: 100%;
  height: 100%;

  .thumbnails-container {
    width: 340px; /* 调整宽度以适应布局需求 */
    border-right: 1px solid #ddd;
  }

  .pdf-viewer {
    flex: 1;
    overflow-y: auto;
  }
}
</style>
