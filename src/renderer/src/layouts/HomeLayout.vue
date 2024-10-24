<template>
  <div class="home-layout">
    <AdvertisementTop class="advertisement-top" />

    <!-- RouterView 组件用于渲染匹配的组件 -->
    <div class="layout">
      <div class="layout-content">
        <div class="layout-return-button">
          <button @click="handleReturn">
            <img src="@renderer/assets/button/button-left.svg" alt="" />
            <div>返回</div>
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
const router = useRouter()
const handleReturn = () => {
  router.push('/PdfPreview')
  console.log(router.currentRoute.value.path)
}
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
