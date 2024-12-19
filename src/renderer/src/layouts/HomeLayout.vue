<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- 顶部广告区域 -->
    <div class="w-full h-[25rem] shadow-md">
      <AdvertisementTop class="w-full h-full" />
    </div>

    <!-- 导航栏区域 -->
    <div class="w-full h-[5rem] shadow-sm bg-white sticky top-0 z-50">
      <NavBar class="w-full h-full" />
    </div>

    <!-- 主内容区域 -->
    <div class="flex-1 w-full py-4  h-full relative">
      <RouterView />
    </div>

    <!-- 底部天气区域 -->
    <div class="w-full h-[15vh] shadow-inner">
      <WeatherFooter class="w-full h-full" />
    </div>
  </div>
</template>

<script setup>
import AdvertisementTop from '@renderer/components/ADtop/AdvertisementTop.vue'
import WeatherFooter from '@renderer/components/footer/WeatherFooter.vue'
import NavBar from '@renderer/components/NavBar/NavBar.vue'
import { onBeforeMount } from 'vue'
import { getNotices } from '@renderer/apis/notice/notice'
import { noticeStore } from '@renderer/stores/notice_store'
import { buildingStore } from '@renderer/stores/building_store'
import { downloadAllPDFs } from '@renderer/utils/time-task'
import { useTaskStore } from '@renderer/stores/task_store'
import { useNotificationStore } from '@renderer/stores/noticefication_store'

const fetch = async () => {
  if (noticeStore().getAllNotices.length > 0) {
    console.log(noticeStore().getAllNotices.length)
    return
  }

  let blg_id = buildingStore().getBuilding.blg_id
  if (!blg_id) {
    blg_id = '314100'
    localStorage.setItem('blg_id', blg_id)
  }

  try {
    const res = await getNotices({ blg_id: blg_id })
    const notices = res.data
    const commonNotices = notices.filter((notice) => notice.mess_type === 'common')
    const advNotices = notices.filter((notice) => notice.mess_type === 'adv')
    noticeStore().setNotices_common(commonNotices)
    noticeStore().setNotices_adv(advNotices)
    noticeStore().setNotices(notices)
    downloadAllPDFs()
    useNotificationStore().addNotification('獲取通知成功', 'success')
  } catch (error) {
    console.error('獲取通知失敗:', error)
    useNotificationStore().addNotification('獲取通知失敗', 'error')
  }
}

onBeforeMount(() => {
  fetch()
  if (localStorage.getItem('updateInterval')) {
    useTaskStore().initialize()
  }
})
</script>
