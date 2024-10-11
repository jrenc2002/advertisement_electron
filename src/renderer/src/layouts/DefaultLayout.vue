<template>
  <div class="default-layout">
    <AdvertisementTop class="advertisement-top" />
    <main class="main">
      <!-- RouterView 组件用于渲染匹配的组件 -->
      <RouterView />
    </main>
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
</style>
