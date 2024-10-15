<!-- src/renderer/src/views/PdfPreview.vue -->
<template>
  <div class="pdf-preview">
    <PDFThumbnails
      :pdf-url="pdfSource"
      @page-selected="handlePageSelected"
    />
    <div class="pdf-viewer-right">
      <div class="layout-return-button">
        <button @click="handleReturn">
          <img
            src="@renderer/assets/button/button-left.svg"
            alt=""
          />
          <div>返回</div>
        </button>
      </div>
      <PDFViewer
        :pdf-url="pdfSource"
        :current-page="currentPage"
        @page-change="updatePage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount } from 'vue'
import PDFViewer from '@renderer/components/PDFViewer.vue'
import PDFThumbnails from '@renderer/components/PDFThumbnails.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleReturn = () => {
  router.go(-1)
  console.log(router.currentRoute.value.path)
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
  gap: 10px;
  .thumbnails-container {
    width: 240px; /* 调整宽度以适应布局需求 */
    padding: 10px;
    border-right: 1px solid #ddd;
  }

  .pdf-viewer-right {
    flex: 1;
    flex-direction: column;
    position: relative;
    background-color: #ccc;
    .layout-return-button {
      position: relative;
      display: flex;
      justify-content: start;
      align-items: center;
      gap: 3px;
      border-radius: 3px;
      background: #ccc;

      button {
        top: 10px;
        left: 20px;
        margin-left: 5%;
        margin-top: 10px;
        display: flex;
        background-color: #fff;
        flex-direction: row;
        z-index: 100;
        justify-content: center;
        align-items: center;
        padding: 3px 4px;
        gap: 3px;
        border: none;
        cursor: pointer;
        color: #ffa500;
        font-family: 'Adelle Sans Devanagari';
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px; /* 100% */
        letter-spacing: 1px;
        border-radius: 3px;
        border: 1px solid white;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
      }
    }
    .pdf-viewer {
      overflow-y: auto;
      position: relative;
      top: 10px;
    }
  }
}
.pdf-preview :deep(.pdf-vue3-scroller) {
  height: 60%;
}
.pdf-preview :deep(.pdf-vue3-main .thumbnail-pdf) {
  height: 80%;
}
.pdf-preview :deep(.pdf-vue3-container) {
  height: 80%;
}
</style>
