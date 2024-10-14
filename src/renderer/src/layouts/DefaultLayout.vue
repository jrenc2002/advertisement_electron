<template>
  <div class="default-layout">
    <AdvertisementTop class="advertisement-top" />

    <!-- RouterView 组件用于渲染匹配的组件 -->
    <div class="layout">
      <div class="layout-content">
        <div class="layout-return-button">
          <button @click="handleReturn">
            <img
              src="@renderer/assets/button/button-left.svg"
              alt=""
            />
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
import AdvertisementTop from '../components/AdvertisementTop.vue'
import WeatherFooter from '../components/WeatherFooter.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const handleReturn = () => {
  router.go(-1)
  console.log(router.currentRoute.value.path)
}
</script>

<style scoped lang="scss">
/* 添加一些基本样式 */
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  height: 100vh;
  justify-content: space-between;
  .advertisement-top {
    height: 20%;
  }
  .main {
    min-height: 60%;
  }
  .weather-footer {
    height: 20%;
  }
}
.layout {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  .layout-content {
    display: flex;
    flex-direction: column;
    background-color: #ccc;
    height: 100%;
    width: 100%;
    .layout-return-button {
      display: flex;
      justify-content: start;
      align-items: start;
      gap: 3px;
      border-radius: 3px;
      background: #ccc;

      button {
        display: flex;
        background-color: #fff;
        flex-direction: row;
        z-index: 100;
        justify-content: center;
        align-items: center;
        padding: 3px 4px;
        gap: 3px;
        border: none;
        margin-left: 20px;
        margin-top: 10px;

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
      // background-color: rgb(128, 128, 224);
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
    }
  }
}
</style>
