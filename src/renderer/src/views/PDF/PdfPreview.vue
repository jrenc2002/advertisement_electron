<!-- src/renderer/src/views/PdfPreview.vue -->
<template>
  <div class="pdf-preview">
    <PDFThumbnails :pdf-url="pdfSource" @page-selected="handlePageSelected" />
    <div class="pdf-viewer-right">
      <div class="layout-return-button">
        <button @click="handleReturn">
          <img src="@renderer/assets/button/button-left.svg" alt="" />
          <div>返回</div>
        </button>
      </div>
      <PDFViewer :pdf-url="pdfSource" :current-page="currentPage" @page-change="updatePage" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue'
import PDFViewer from '@renderer/components/PDF/PDFViewer.vue'
import PDFThumbnails from '@renderer/components/PDF/PDFThumbnails.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleReturn = () => {
  router.go(-1)
  console.log('router.currentRoute.value.path', router.currentRoute.value.path)
}
const pdfSource = ref('')
// 定义组件接收的 props
onBeforeMount(() => {
  pdfSource.value = router.currentRoute.value.query.pdfSource as string
  console.log(pdfSource.value)
})
// 定义事件
const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

// 定义当前页码的响应式变量，初始值为 1
const currentPage = ref(1)

// 当 pdfSource 变化时，重置当前页码到第一页
watch(
  () => pdfSource.value,
  () => {
    console.log(pdfSource.value)
    currentPage.value = 1
  }
)

// 处理来自 PDFThumbnails 组件的页码选择事件
const handlePageSelected = (page: number) => {
  currentPage.value = page
  emit('page-change', page)
}

// 处理来自 PDFViewer 组件的页码变化事件
const updatePage = (page: number) => {
  currentPage.value = page
  emit('page-change', page)
}
</script>

<style scoped lang="scss">
.pdf-preview {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  // gap: 10px;
  .thumbnails-container {
    width: 200px; /* 调整宽度以适应布局需求 */
    padding: 0px 28.62px 0px 25.48px;
    border-right: 1px solid #ddd;
  }

  .pdf-viewer-right {
    flex: 1;
    flex-direction: column;
    position: relative;
    background-color: #ccc;
    padding: 0px 32px 39px 32px;
    .layout-return-button {
      position: relative;
      display: flex;
      justify-content: start;
      align-items: center;
      gap: 3px;
      border-radius: 3px;
      background: #ccc;
      height: 87px;
      padding: 16px 0px 12px 1px;

      button {
        display: flex;
        background-color: #fff;
        flex-direction: row;
        z-index: 100;
        justify-content: center;
        align-items: center;
        padding: 3px 4px;
        height: 59px;
        width: 128px;
        gap: 3px;
        border: none;
        cursor: pointer;
        color: #ffa500;
        font-family: 'Adelle Sans Devanagari';
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px;
        letter-spacing: 2.8px;
        border-radius: 3px;
        background: #fff;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
        img {
          width: 24px;
          height: 24px;
        }
      }
    }
    .pdf-viewer {
      overflow-y: auto;
      position: relative;
      height: calc(100% - 87px);
    }
  }
}
// .pdf-preview :deep(.pdf-vue3-scroller) {
//   height: 100%;
// }
// .pdf-preview :deep(.pdf-vue3-main .thumbnail-pdf) {
//   height: 100%;
// }
// .pdf-preview :deep(.pdf-vue3-container) {
//   height: 100%;
// }
</style>
