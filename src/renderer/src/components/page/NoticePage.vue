<template>
  <div class="h-full w-full flex flex-col p-4 overflow-visible">
    <!-- 导航区域 -->
    <nav class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-2 p-6 bg-white rounded-xl border border-gray-200 shadow-sm w-[calc(100%)]">
        <!-- 标题部分 -->
        <div class="flex flex-col px-6  w-60">
          <span class="text-2xl font-bold text-primary tracking-wider">{{ title }}</span>
          <span class="text-sm font-medium text-neutral tracking-widest uppercase">{{ titleEn }}</span>
        </div>

        <!-- 分隔符 -->
        <div class="h-12 w-px bg-gray-200 mx-4"></div>

        <!-- 导航按钮组 -->
        <div class="flex-1">
          <div class="flex items-center gap-2">
            <button
              v-for="nav in navigation"
              :key="nav.route"
              :class="[
                'px-6 py-3 rounded-lg text-lg font-medium transition-colors',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentRoute === nav.route
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              ]"
              @click="goTo(nav.route)"
              @keydown.enter="goTo(nav.route)"
              tabindex="0"
              :aria-label="`切換到${nav.label}`"
            >
              {{ nav.label }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 通知列表 -->
    <div class="flex-1 overflow-y-auto space-y-4 overflow-visible">
      <div
        v-for="(pdf, index) in paginatedNotices"
        :key="index"
        class="bg-white rounded-xl border border-gray-200 p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] 
               hover:shadow-lg transition-shadow cursor-pointer"
        @click="viewPdf(pdf)"
        @keydown.enter="viewPdf(pdf)"
        tabindex="0"
        :aria-label="`查看${pdf.mess_title}的詳情`"
      >
        <div class="flex justify-between items-center">
          <div class="space-y-2">
            <h3 class="text-xl font-semibold text-gray-900">{{ pdf.mess_title }}</h3>
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-500">
                類型: {{ getNoticeTypeName(pdf.mess_type) }}
              </span>
              <span v-if="pdf.created_at" class="text-sm text-gray-500">
                發布時間: {{ formatDate(pdf.created_at) }}
              </span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-blue-600 hover:text-blue-700">
              查看詳情
              <i class="fas fa-chevron-right ml-2"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- 添加分页控制按钮 -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-6 pb-4">
        <button
          class="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50
                 bg-white border border-gray-200 hover:bg-gray-50 disabled:hover:bg-white
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="handlePreviousPage"
          @keydown.enter="handlePreviousPage"
          :disabled="currentPage === 1"
          tabindex="0"
          aria-label="上一頁"
        >
          <i class="fas fa-chevron-left mr-2"></i>
          上一頁
        </button>

        <span class="text-gray-600">
          第 {{ currentPage }} 頁，共 {{ totalPages }} 頁
        </span>

        <button
          class="px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50
                 bg-white border border-gray-200 hover:bg-gray-50 disabled:hover:bg-white
                 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @click="handleNextPage"
          @keydown.enter="handleNextPage"
          :disabled="currentPage === totalPages"
          tabindex="0"
          aria-label="下一頁"
        >
          下一頁
          <i class="fas fa-chevron-right ml-2"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRouterStore } from '@renderer/stores/nav_store'
import { routerState } from '@renderer/stores/nav_store'
import { noticeStore } from '@renderer/stores/notice_store'
import { computed, ref } from 'vue'

interface Notice {
  id: number
  mess_title: string
  mess_type: string
  mess_file: string
  created_at?: string
}

const props = defineProps<{
  title: string
  titleEn: string
  pdfSource: Notice[]
  currentRoute: string
}>()

const router = useRouter()

const navigation = [
  { label: '全體通告', route: '/allNotice', titleEn: 'All Notices' },
  { label: '緊急通告', route: '/urgentNotice', titleEn: 'Urgent Notices' },
  { label: '一般通告', route: '/generalNotice', titleEn: 'General Notices' },
  { label: '法團通告', route: '/corporateNotice', titleEn: 'Corporate Notices' },
  { label: '政府通告', route: '/governmentNotice', titleEn: 'Government Notices' }
]

const getNoticeTypeName = (type: string): string => {
  const types: Record<string, string> = {
    common: '一般通告',
    adv: '緊急通告',
    corporate: '法團通告',
    government: '政府通告'
  }
  return types[type] || '其他'
}

const viewPdf = (pdf: any) => {
  if (pdf.mess_type === 'common') {
    const downloadedPdf = noticeStore().getNotices_hasDownload_common.find(
      (item) => item.id === pdf.id
    )
    if (downloadedPdf?.path) {
      router.push({ path: '/pdfPreview', query: { pdfSource: downloadedPdf.path } })
    } else {
      router.push({ path: '/pdfPreview', query: { pdfSource: pdf.mess_file } })
    }
  } else if (pdf.mess_type === 'adv') {
    const downloadedPdf = noticeStore().getNotices_hasDownload_adv.find(
      (item) => item.id === pdf.id
    )
    if (downloadedPdf?.path) {
      router.push({ path: '/pdfPreview', query: { pdfSource: downloadedPdf.path } })
    } else {
      router.push({ path: '/pdfPreview', query: { pdfSource: pdf.mess_file } })
    }
  } else {
    router.push({ path: '/pdfPreview', query: { pdfSource: pdf.mess_file } })
  }
}

const goTo = (route: string) => {
  useRouterStore().setCurrentRouter(route as routerState)
  router.push(route)
}

// 格式化日期
const formatDate = (dateStr?: string) => {
  if (!dateStr) return '無時間'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-HK', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 按时间排序的通知列表
const sortedPdfSource = computed(() => {
  return [...props.pdfSource].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
    return dateB - dateA
  })
})

// 添加分页相关的状态
const currentPage = ref(1)
const itemsPerPage = 3 // 每页显示10条通知

// 计算总页数和当前页的数据
const totalPages = computed(() => Math.ceil(sortedPdfSource.value.length / itemsPerPage))
const paginatedNotices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedPdfSource.value.slice(start, end)
})

// 分页控制函数
const handlePreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>
