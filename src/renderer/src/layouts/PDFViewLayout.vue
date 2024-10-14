<template>
  <div class="default-layout">
    <AdvertisementTop class="advertisement-top" />

    <!-- RouterView 组件用于渲染匹配的组件 -->
    <div class="layout">
      <div class="layout-content">
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
