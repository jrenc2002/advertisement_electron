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
      class="pdf-container"
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
