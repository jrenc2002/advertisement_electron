<template>
  <div class="home-layout">
    <AdvertisementTop class="advertisement-top" />
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
import AdvertisementTop from '@renderer/components/ADtop/AdvertisementTop.vue'
import WeatherFooter from '@renderer/components/footer/WeatherFooter.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const handleReturn = () => {
  router.push('/PdfPreview')
  // console.log(router.currentRoute.value.path)
}
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
