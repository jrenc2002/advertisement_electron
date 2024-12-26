<!-- src/renderer/src/views/PdfPreview.vue -->
<template>
  <div class="flex w-full h-[calc(60vh-100px)] overflow-y-auto">
    <PDFThumbnails 
      :pdf-url="pdfSource" 
      @page-selected="handlePageSelected" 
      :class="[
        'border-r border-gray-200 px-6 transition-all duration-300',
        isNoticeMode ? 'w-0 opacity-0 overflow-hidden' : 'w-[200px]'
      ]"
    />
    
    <div class="flex-1 flex flex-col bg-gray-300">
  
      <div class="flex-1 px-8 pb-10 overflow-hidden">
        <PDFViewer 
          :pdf-url="pdfSource" 
          :current-page="currentPage" 
          @page-change="updatePage" 
          class="h-full overflow-y-auto"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeMount, computed } from 'vue'
import PDFViewer from '@renderer/components/PDF/PDFViewer.vue'
import PDFThumbnails from '@renderer/components/PDF/PDFThumbnails.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const handleReturn = () => {
  router.go(-1)
}

const pdfSource = ref('')

onBeforeMount(() => {
  pdfSource.value = router.currentRoute.value.query.pdfSource as string
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const currentPage = ref(1)

watch(
  () => pdfSource.value,
  () => {
    currentPage.value = 1
  }
)

const handlePageSelected = (page: number) => {
  currentPage.value = page
  emit('page-change', page)
}

const updatePage = (page: number) => {
  currentPage.value = page
  emit('page-change', page)
}

const isNoticeMode = computed(() => {
  return router.currentRoute.value.query.noticeId !== undefined
})
</script>
