<!-- src/renderer/src/components/PDFThumbnails.vue -->
<template>
  <div
    ref="thumbnailsContainer"
    class="thumbnails-container"
  >
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
      @on-pdf-init="handlePdfInit"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, nextTick } from 'vue'
import PDF from 'pdf-vue3'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

interface Props {
  pdfUrl: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (event: 'page-selected', page: number): void
}>()

const currentPage = ref<number>(1)

const selectPage = (page: number) => {
  console.log('selectPage', page)
  currentPage.value = page
  emit('page-selected', page)
}

const handlePageChange = (page: number) => {
  console.log('handlePageChange', page)
  currentPage.value = page
}

const handlePdfInit = async (pdf: PDFDocumentProxy) => {
  console.log('PDF Initialized:', pdf)
  await nextTick()
  addPageNumbersAndEvents()
}

const thumbnailsContainer = ref<HTMLElement | null>(null)

/**
 * 通过 DOM 操作为每个 canvas 元素添加页码和点击事件
 */
const addPageNumbersAndEvents = () => {
  if (!thumbnailsContainer.value) return

  // 获取所有 canvas 元素
  const canvases = thumbnailsContainer.value.querySelectorAll('canvas')

  canvases.forEach((canvas, index) => {
    const pageNumber = index + 1

    // 添加点击事件监听器
    canvas.addEventListener('click', () => {
      console.log(`Canvas clicked: Page ${pageNumber}`)
      selectPage(pageNumber)
    })

    // 检查是否已经存在页码元素
    const existingP = canvas.nextElementSibling
    if (existingP && existingP.tagName.toLowerCase() === 'p') {
      existingP.textContent = `第 ${pageNumber} 页`
      return
    }

    // 创建一个 p 元素来显示页码
    const p = document.createElement('p')
    p.textContent = `第 ${pageNumber} 页`
    p.style.textAlign = 'center'
    p.style.marginTop = '5px'
    p.style.fontSize = '14px'
    p.style.color = '#555'

    // 插入 p 元素到 canvas 后面
    canvas.parentNode?.insertBefore(p, canvas.nextSibling)
  })
}

/**
 * 清理事件监听器和添加的 p 元素
 */
const cleanup = () => {
  if (!thumbnailsContainer.value) return

  const canvases = thumbnailsContainer.value.querySelectorAll('canvas')
  canvases.forEach((canvas, index) => {
    const pageNumber = index + 1

    // 移除点击事件监听器
    canvas.replaceWith(canvas.cloneNode(true))

    // 移除页码 p 元素
    const nextSibling = canvas.nextElementSibling
    if (nextSibling && nextSibling.tagName.toLowerCase() === 'p') {
      nextSibling.remove()
    }
  })
}

// 在组件卸载时进行清理
onMounted(() => {
  // 可选：如果需要处理组件更新时的情况，可以监听 props.pdfUrl 的变化并重新加载
})
</script>

<style scoped>
.thumbnails-container {
  display: flex;
  flex-direction: column;
  height: 60%;
  overflow-y: auto;
  width: 150px;
  border-right: 1px solid #ddd;
  padding: 10px;
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

.thumbnails-container :deep(.pdf-vue3-scroller::-webkit-scrollbar-thumb:hover) {
  background-color: #555; /* 滚动条滑块悬停颜色 */
}
</style>
