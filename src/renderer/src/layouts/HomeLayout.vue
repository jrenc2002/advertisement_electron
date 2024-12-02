<template>
  <div class="home-layout">
    <AdvertisementTop class="advertisement-top" />

    <!-- RouterView 组件用于渲染匹配的组件 -->
    <div class="layout">
      <div class="layout-content">
        <div class="layout-return-button">
          <button @click="handleReturn">
            <img src="@renderer/assets/button/button-left.svg" alt="" />
            <div v-if="router.currentRoute.value.path !== '/setting'">设置</div>
            <div v-else>返回</div>
          </button>
        </div>

        <div class="layout-body">
          <RouterView />
        </div>
      </div>
    </div>

    <WeatherFooter class="weather-footer" />
  </div>
</template>

<script setup>
import AdvertisementTop from '@renderer/components/top/AdvertisementTop.vue'
import WeatherFooter from '@renderer/components/footer/WeatherFooter.vue'
import { useRouter } from 'vue-router'
import { getNotices } from '@renderer/apis/notice/notice'
import { noticeStore } from '@renderer/stores/notice_store'
import { onBeforeMount } from 'vue'
import { buildingStore } from '@renderer/stores/building_store'
import axios from 'axios'
import { downloadAllPDFs } from '@renderer/utils/time-task'
import { useTaskStore } from '@renderer/stores/task_store'
import { useNotificationStore } from '@renderer/stores/noticefication_store'

const router = useRouter()

const handleReturn = () => {
  if (router.currentRoute.value.path === '/setting') {
    router.push('/urgentNotice')
  } else if (router.currentRoute.value.path === '/buildingDetail') {
    router.push('/setting')
  } else {
    router.push('/setting')
  }
  // console.log(router.currentRoute.value.path)
}

// fetch notices data
const fetch = async () => {
  if (noticeStore().getAllNotices.length > 0) {
    console.log(noticeStore().getAllNotices.length)
    return
  }
  let blg_id = buildingStore().getBuilding.blg_id
  // console.log(blg_id)
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
    // console.log(noticeStore().getNotices_common)
    // console.log(noticeStore().getNotices_adv)
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

<style scoped lang="scss">
.home-layout {
  // min-height: 100vh;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: center;
  align-items: center;
  .advertisement-top {
    height: calc(438 / 1920 * 100%);
  }
  .layout {
    // 占据剩余高度
    height: calc(100vh - 438 / 1920 * 100% - 214px);
  }
  .weather-footer {
    height: 214px;
  }
}

.layout {
  width: 100%;
  justify-content: center;
  align-items: center;
  .layout-content {
    display: flex;
    flex-direction: column;
    background-color: #eee;
    height: 100%;
    width: 100%;
    .layout-return-button {
      display: flex;
      justify-content: start;
      align-items: start;
      width: 100%;
      height: 75px;
      padding: 16px 20px 0px 20px;

      button {
        width: 128px;
        height: 59px;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 3px;
        align-self: stretch;
        border-radius: 3px;
        background: #fff;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
        cursor: pointer;
        color: #ffa500;
        font-family: 'Adelle Sans Devanagari';
        font-size: 28px;
        font-style: normal;
        font-weight: 400;
        line-height: 28px; /* 100% */
        letter-spacing: 2.8px;
        border-radius: 3px;
        border: 1px solid white;
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
      }
    }
    .layout-body {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
