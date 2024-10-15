<!-- src/renderer/src/components/PDFThumbnails.vue -->
<template>
  <div class="thumbnails-container">
    <div
      v-for="pa in totalPages"
      :key="pa"
      class="thumbnail"
      @click="selectPage(pa)"
    >
      <PDF
        :src="pdfUrl"
        :page="pa"
        :pdf-width="'100%'"
        :row-gap="0"
        :scroll-threshold="0"
        :disable-auto-fetch="true"
        :disable-range="true"
        :disable-stream="true"
        :stop-at-errors="false"
        :use-system-fonts="false"
        class="thumbnail-pdf"
        @on-pdf-init="handlePdfInit"
      />
      <div class="page-number">第 {{ pa }} 页</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'
import PDF from 'pdf-vue3'
defineProps<{
  pdfUrl: string
}>()

const handlePdfInit = (pdf: PDFDocumentProxy) => {
  // totalPages.value = pdf.numPages
  console.log(pdf)
}

const emits = defineEmits<{
  (e: 'page-selected', page: number): void
}>()

const totalPages = ref(1) // 实际情况应通过 PDF.js 获取

const selectPage = (page: number) => {
  emits('page-selected', page)
}
</script>

<style scoped>
.thumbnails-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  height: 100%;
  width: 150px;
  border-right: 1px solid #ddd;
}

.thumbnail {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
  cursor: pointer;
}

.thumbnail-pdf {
  width: 100%;
  height: 100px;
  object-fit: contain;
  border: 1px solid #ddd;
  margin-bottom: 5px;
}

.page-number {
  text-align: center;
  font-size: 12px;
  margin-top: 5px;
}
</style>
