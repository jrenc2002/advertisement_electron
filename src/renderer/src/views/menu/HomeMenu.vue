<template>
    <div class="h-[calc(100%-1rem)] absolute w-full">
  <div class="flex w-full h-full relative bg-[#ffffff] px-4">
    <!-- 左侧导航菜单区域 -->
    <div class="w-[25%] min-w-[300px] flex flex-col mr-6 h-min-full relative">
      <!-- 欠费查询卡片 -->
      <button
        @click="handleMenuClick('fees')"
        @keydown.enter="handleMenuClick('fees')"
        class="h-1/3 bg-white rounded-xl border border-grey p-4
               shadow-[0_2px_8px_rgba(0,0,0,0.06)]
               hover:shadow-md hover:border-primary/20
               transition-all duration-200
               flex flex-col items-center justify-center
               mb-4"
        tabindex="0"
        aria-label="欠費查詢"
      >
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-primary tracking-wider mb-3">欠費查詢</span>
          <span class="text-sm font-medium text-[#8E8E93] tracking-widest uppercase">Payment Query</span>
        </div>
        <p class="text-sm text-neutral/70 mt-6 text-center">查詢物業費、水電費等費用信息</p>
      </button>

      <!-- 失物招领卡片 -->
      <button
        @click="handleMenuClick('lost-found')"
        @keydown.enter="handleMenuClick('lost-found')"
        class="h-1/3 bg-white rounded-xl border border-grey p-4
               shadow-[0_2px_8px_rgba(0,0,0,0.06)]
               hover:shadow-md hover:border-primary/20
               transition-all duration-200
               flex flex-col items-center justify-center
               mb-4"
        tabindex="0"
        aria-label="失物招領"
      >
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-primary tracking-wider mb-3">失物招領</span>
          <span class="text-sm font-medium text-[#8E8E93] tracking-widest uppercase">Lost & Found</span>
        </div>
        <p class="text-sm text-neutral/70 mt-6 text-center">查看小區失物招領信息</p>
      </button>

      <!-- 社区活动卡片 -->
      <button
        @click="handleMenuClick('activities')"
        @keydown.enter="handleMenuClick('activities')"
        class="h-1/3 bg-white rounded-xl border border-grey p-4
               shadow-[0_2px_8px_rgba(0,0,0,0.06)]
               hover:shadow-md hover:border-primary/20
               transition-all duration-200
               flex flex-col items-center justify-center"
        tabindex="0"
        aria-label="社區活動"
      >
        <div class="flex flex-col items-center">
          <span class="text-3xl font-bold text-primary tracking-wider mb-3">社區活動</span>
          <span class="text-sm font-medium text-[#8E8E93] tracking-widest uppercase">Community Events</span>
        </div>
        <p class="text-sm text-neutral/70 mt-6 text-center">了解社區最新活動資訊</p>
      </button>
    </div>

    <!-- 右侧公告区域 -->
    <div class="flex-1 min-w-0 bg-white rounded-xl border border-grey 
                shadow-[0_2px_8px_rgba(0,0,0,0.06)] p-4
                hover:shadow-md hover:border-primary/20 
                transition-all duration-200 cursor-pointer"
         @click="handleNoticeHeaderClick"
         @keydown.enter="handleNoticeHeaderClick"
         tabindex="0"
         aria-label="社區公告區域">
      <div class="flex flex-col mb-6">
        <span class="text-3xl font-bold text-primary tracking-wider mb-3">社區公告</span>
        <span class="text-sm font-medium text-[#8E8E93] tracking-widest uppercase">Community Notice</span>
      </div>
      
      <div class="flex flex-col gap-4">
        <div 
          v-for="(notice, index) in notices" 
          :key="index"
          class="bg-neutral/5 rounded-lg p-5 transition-all duration-200 
                 hover:shadow-md border border-neutral/10 
                 hover:border-primary/20 cursor-pointer"
          @click.stop="handleNoticeClick(notice)"
          @keydown.enter="handleNoticeClick(notice)"
          tabindex="0"
          :aria-label="notice.title"
        >
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-3">
              <h2 class="text-base font-semibold text-primary">{{ notice.title }}</h2>
              <div 
                v-if="notice.isUrgent" 
                class="px-3 py-1 rounded-full text-xs 
                       text-white bg-[#F44336] flex items-center gap-2"
              >
                <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                紧急通知
              </div>
            </div>
            <span class="text-sm text-neutral/70">{{ notice.date }}</span>
          </div>
          <p class="text-sm text-neutral/80 leading-relaxed">{{ notice.description }}</p>
          
          <!-- 添加金色强调的重要信息标记 -->
          <div 
            v-if="notice.important" 
            class="mt-3 text-[#FFA000] text-sm font-medium flex items-center gap-2"
          >
            <span class="material-icons text-base">star</span>
            重要信息
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { noticeStore } from '@renderer/stores/notice_store'

const router = useRouter()

interface Notice {
  title: string
  date: string
  description: string
  isUrgent: boolean
  important: boolean
  mess_file?: string // 添加可选的文件链接字段
}

const notices = ref<Notice[]>([
  {
    title: '缴取暖费优惠通知',
    date: '2024-12-23',
    description: '即日起至月底，预缴纳取暖费可享受8折优惠，欢迎各位业主把握机会。',
    isUrgent: true,
    important: true,
    mess_file: 'path/to/heating-notice.pdf' // 添加对应的文件路径
  },
  // ... 其他通知保持不变，添加 mess_file 字段
])

const handleMenuClick = (route: string) => {
  if (route === 'fees') {
    router.push('/arrearage-find')
    return
  }
  
  ElMessage({
    message: '該功能正在開發中，敬請期待',
    type: 'info',
    duration: 2000,
    center: true
  })
}

// 添加点击公告标题的处理函数
const handleNoticeHeaderClick = () => {
  router.push('/generalNotice')
}

// 添加点击具体公告的处理函数
const handleNoticeClick = (notice: Notice) => {
  if (notice.mess_file) {
    router.push({
      path: '/pdfPreview',
      query: {
        pdfSource: notice.mess_file
      }
    })
  } else {
    ElMessage({
      message: '該通知暫無詳細文件',
      type: 'info',
      duration: 2000,
      center: true
    })
  }
}
</script>

<style scoped>
/* 优化动条样式 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #8E8E93;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #007AFF;
}
</style>
