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
      :use-system-fonts="false"
      :disable-stream="true"
      :disable-auto-fetch="true"
      @on-page-change="handlePageChange"
      @on-pdf-init="handlePdfInit"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
import PDF from 'pdf-vue3'
import { PDFDocumentProxy } from 'pdfjs-dist/types/src/display/api'

interface Props {
  pdfUrl: string
}

const props = defineProps<Props>()

const currentPage = ref<number>(1)
const emit = defineEmits<{
  (event: 'page-selected', page: number): void
}>()

const selectPage = (page: number) => {
  console.log('selectPage', page)
  // currentPage.value = page
  emit('page-selected', page)
}

const handlePageChange = (page: number) => {
  console.log('handlePageChange', page)
  currentPage.value = page
}

const thumbnailsContainer = ref<HTMLElement | null>(null)
/**
 * 通过 DOM 操作为每个 canvas 元素添加页码
 */
const addPageNumbersAndEvents = () => {
  if (!thumbnailsContainer.value) return
  // 获取所有 canvas 元素
  const canvases = thumbnailsContainer.value.querySelectorAll('canvas')
  canvases.forEach((canvas, index) => {
    const pageNumber = index + 1

    // 设置 data-page-number 属性，便于事件代理获取页码
    canvas.setAttribute('data-page-number', pageNumber.toString())

    // 检查是否已经存在页码元素
    const existingP = canvas.nextElementSibling
    if (existingP && existingP.tagName.toLowerCase() === 'p') {
      existingP.textContent = ` ${pageNumber} `
      return
    }

    // 创建一个 p 元素来显示页码
    const p = document.createElement('p')
    p.textContent = ` ${pageNumber} `
    Object.assign(p.style, {
      textAlign: 'center',
      marginTop: '5px',
      fontSize: '14px',
      color: '#555',
      cursor: 'pointer',
      marginBottom: '10px'
    })

    // 插入 p 元素到 canvas 后面
    canvas.parentNode?.insertBefore(p, canvas.nextSibling)
  })
}

/**
 * 在父容器上绑定点击事件监听器，实现事件委托
 */
const attachEventListener = () => {
  if (!thumbnailsContainer.value) return

  // 确保只绑定一次事件监听器
  if ((thumbnailsContainer.value as any).__eventListenerAttached) return
  ;(thumbnailsContainer.value as any).__eventListenerAttached = true

  thumbnailsContainer.value.addEventListener('click', handleContainerClick)
}

/**
 * 事件处理函数，处理父容器上的点击事件
 */
const handleContainerClick = (event: Event) => {
  const target = event.target as HTMLElement
  if (target.tagName.toLowerCase() === 'canvas') {
    const pageNumberAttr = target.getAttribute('data-page-number')
    if (pageNumberAttr) {
      const pageNumber = parseInt(pageNumberAttr, 10)
      selectPage(pageNumber)
    }
  }
}

/**
 * 清理事件监听器和添加的 p 元素
 */
const cleanup = () => {
  if (!thumbnailsContainer.value) return

  // 移除事件监听器
  thumbnailsContainer.value.removeEventListener('click', handleContainerClick)
  ;(thumbnailsContainer.value as any).__eventListenerAttached = false

  // 移除 data-page-number 属性和页码 p 元素
  const canvases = thumbnailsContainer.value.querySelectorAll('canvas')
  canvases.forEach((canvas) => {
    // 移除 data-page-number 属性
    canvas.removeAttribute('data-page-number')

    // 移除页码 p 元素
    const nextSibling = canvas.nextElementSibling
    if (nextSibling && nextSibling.tagName.toLowerCase() === 'p') {
      nextSibling.remove()
    }
  })
}

const handlePdfInit = async (pdf: PDFDocumentProxy) => {
  console.log('PDF Initialized:', pdf)
  await nextTick()
  addPageNumbersAndEvents()
  attachEventListener()
}

// 在组件卸载时进行清理
onBeforeUnmount(() => {
  cleanup()
})

// 如果需要处理组件更新时的情况，可以在这里添加监听 props.pdfUrl 的变化并重新加载
onMounted(() => {
  // 例如：
  // watch(() => props.pdfUrl, () => {
  //   cleanup()
  //   // 重新初始化或其他操作
  // })
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
  background: #fff; /* 滚动条轨道背景色 */
  border-radius: 4px;
}

.thumbnails-container :deep(.pdf-vue3-scroller::-webkit-scrollbar-thumb) {
  background-color: #ccc; /* 滚动条滑块颜色 */
  border-radius: 4px;
  border: 1px solid #f1f1f1; /* 滚动条滑块边框，模拟轨道间距 */
}

.thumbnails-container :deep(.pdf-vue3-scroller::-webkit-scrollbar-thumb:hover) {
  background-color: #555; /* 滚动条滑块悬停颜色 */
}
</style>
