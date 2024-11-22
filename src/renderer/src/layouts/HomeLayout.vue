<template>
  <div class="home-layout">
    <AdvertisementTop class="advertisement-top" />

    <!-- RouterView 组件用于渲染匹配的组件 -->
    <div class="layout">
      <div class="layout-content">
        <div class="layout-return-button">
          <button @click="handleReturn">
            <img src="@renderer/assets/button/button-left.svg" alt="" />
            <div>设置</div>
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

const router = useRouter()

const handleReturn = () => {
  // 判断当前路由是不是 /setting
  if (router.currentRoute.value.path === '/setting') {
    router.go(-1)
  } else {
    router.push('/setting')
  }
  console.log(router.currentRoute.value.path)
}

const fetch = async () => {
  const blg_id = buildingStore().getBuilding.blg_id
  console.log(blg_id)

  try {
    const res = await getNotices({ blg_id })
    console.log(res.data)

    // 筛选出 common 类型的通知
    const commonNotices = res.data.filter((notice) => notice.mess_type === 'common')
    // 筛选出 adv 类型的通知
    const advNotices = res.data.filter((notice) => notice.mess_type === 'adv')

    // 将筛选后的数据存储到对应的 store 中
    noticeStore().setNotices_common(commonNotices)
    noticeStore().setNotices_adv(advNotices)
    console.log(noticeStore().getNotices_common)
    console.log(noticeStore().getNotices_adv)
  } catch (error) {
    console.error('获取通知失败:', error)
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
