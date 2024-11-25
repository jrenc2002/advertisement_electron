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
import AdvertisementTop from '../components/Top/AdvertisementTop.vue'
import WeatherFooter from '../components/Footer/WeatherFooter.vue'
import { useRouter } from 'vue-router'
import { getNotices } from '../utils/apis/notice/notice'
import { noticeStore } from '../stores/notice_store'
import { onBeforeMount } from 'vue'
import { buildingStore } from '../stores/building_store'
import axios from 'axios'

const router = useRouter()

const handleReturn = () => {
  if (router.currentRoute.value.path === '/setting') {
    router.go(-1)
  } else {
    router.push('/setting')
  }
  console.log(router.currentRoute.value.path)
}

// 获取通知数据
const fetch = async () => {
  const blg_id = buildingStore().getBuilding.blg_id
  console.log(blg_id)

  try {
    const res = await getNotices({ blg_id })
    const notices = res.data
    const commonNotices = notices.filter((notice) => notice.mess_type === 'common')
    const advNotices = notices.filter((notice) => notice.mess_type === 'adv')
    noticeStore().setNotices_common(commonNotices)
    noticeStore().setNotices_adv(advNotices)
    noticeStore().setNotices(notices)
    console.log(noticeStore().getNotices_common)
    console.log(noticeStore().getNotices_adv)
    downloadAllPDFs()
  } catch (error) {
    console.error('获取通知失败:', error)
  }
}

// 下载单个PDF
const downloadAndStorePDF = async (notice, PathName) => {
  try {
    const response = await axios.get(notice.mess_file, {
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const filename = notice.id + '.pdf'
    const result = await window.api.downloadPDF(PathName, notice.mess_file, filename)

    if (result.success) {
      switch (PathName) {
        case 'common':
          noticeStore().addNotices_hasDownload_common({ ...notice, path: result.path })
          console.log(noticeStore().getNotices_hasDownload_common)
          break
        case 'adv':
          noticeStore().addNotices_hasDownload_adv({ ...notice, path: result.path })
          console.log(noticeStore().getNotices_hasDownload_adv)
          break
      }
      console.log(`PDF "${notice.mess_title}" 存储成功 at ${result.path}`)
    } else {
      console.error(`下载 PDF "${notice.mess_title}" 失败: ${result.error}`)
    }
  } catch (error) {
    console.error(`下载 PDF ${notice.mess_title} 失败:`, error)
  }
}

// 下载所有 PDF
//TODO:添加其他两种类型的pdf
const downloadAllPDFs = async () => {
  const allCommonNotices = noticeStore().getNotices_common
  const allAdvNotices = noticeStore().getNotices_adv
  for (const notice of allCommonNotices) {
    if (noticeStore().getNotices_hasDownload_common.find((item) => item.id === notice.id)) {
      return
    }
    if (notice.mess_file) {
      await downloadAndStorePDF(notice, 'common')
    }
  }
  for (const notice of allAdvNotices) {
    if (noticeStore().getNotices_hasDownload_adv.find((item) => item.id === notice.id)) {
      return
    }
    if (notice.mess_file) {
      await downloadAndStorePDF(notice, 'adv')
    }
  }
}
onBeforeMount(() => {
  fetch()
})
</script>

<style scoped lang="scss">
/* 添加一些基本样式 */
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
