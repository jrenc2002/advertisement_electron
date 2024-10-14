<template>
  <div class="pdf-viewer">
    <PDF
      :src="pdfUrl"
      :page="currentPage"
      :pdf-width="'100%'"
      :show-progress="false"
      @on-page-change="handlePageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import PDF from 'pdf-vue3'

// 定义组件接收的 props
const props = defineProps<{
  pdfUrl: string // PDF 文件的 URL
  currentPage: number // 当前页码
}>()

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
  width: 100%; /* 宽度占满父容器 */
  height: 100%; /* 高度占满父容器 */
  overflow-y: auto; /* 纵向滚动 */
}
</style>
