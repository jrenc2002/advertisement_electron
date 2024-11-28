<!-- src/renderer/src/views/setting/setting.vue -->
<template>
  <div class="settings-container">
    <!-- Login Form -->
    <div class="form-groups">
      <div class="form-title">大廈資料</div>
      <div class="form-group">
        <div class="form-line">
          <label class="form-label">大廈名稱</label>
        </div>
      </div>
      <div class="form-group">
        <div class="form-line">
          <label>{{ BuildingStore.getBuilding.name }}</label>
        </div>
      </div>
      <div class="form-group">
        <div class="form-line">
          <label class="form-label">廣告輪播</label>
        </div>
      </div>
      <div class="form-scroll">
        <div v-for="ad in adsStore().getAds" :key="ad.ID" class="form-line">
          <div class="ad-url-text">{{ ad.Advertisement.title }}</div>
          <div v-if="ad.Advertisement.type === 'img'" class="ad-url">
            - {{ ad.Advertisement.image_url }}
          </div>
          <div v-if="ad.Advertisement.type === 'video'" class="ad-url">
            - {{ ad.Advertisement.video_url }}
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="form-line">
          <label class="form-label">更新間隔（分鐘）</label>
        </div>
      </div>
      <div class="form-group">
        <div class="form-line">
          <input v-model="updateInterval" class="form-input" type="number" />
        </div>
      </div>
      <div class="form-group">
        <button class="form-button" @click="handleUnbind">解除綁定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { adsStore } from '../../stores/ads_store'
import { useRouter } from 'vue-router'
import { buildingStore } from '../../stores/building_store'
import { useNotificationStore } from '../../stores/noticefication_store'
const router = useRouter()
const notificationStore = useNotificationStore()
const AdsStore = adsStore()
const BuildingStore = buildingStore()

const updateInterval = ref<number>(0)
// Fetch buildings on mount
// Handle unbind
const handleUnbind = async () => {
  AdsStore.setAds([])
  AdsStore.setAds_hasDownload([])
  AdsStore.setAds_hasDownload_path([])
  BuildingStore.setBuilding('')
  notificationStore.addNotification('解除綁定成功', 'success')
  router.push('/setting')
}
</script>

<style lang="scss" scoped>
.settings-container {
  padding: 15px 32px 90px 32px;
  width: 100%;
  height: 100%;
  color: #000;
}
.form-button {
  color: #000;
  font-family: 'Adelle Sans Devanagari';
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 116.667% */
  letter-spacing: 24px;

  width: 468px;
  height: 60px;
  border-radius: 3px;
  border: 1px solid #000;
  background: #fff;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-title {
  color: #000;
  font-family: 'Adelle Sans Devanagari';
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 64px; /* 133.333% */
  letter-spacing: 4.8px;
}
.form-line {
  width: 720px;
  display: flex;
  flex-direction: row;
  justify-content: start;
}
.ad-url {
  width: 508px;
  max-width: 508px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #000;
  font-family: 'Adelle Sans Devanagari';
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 120% */
  letter-spacing: 2px;
}
.ad-url-text {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  // white-space: nowrap;
  width: 200px;
  overflow: hidden;
  color: #000;
  text-overflow: ellipsis;
  font-family: 'Adelle Sans Devanagari';
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 120% */
  letter-spacing: 2px;
}
.form-label {
  color: #000;
  font-family: 'Adelle Sans Devanagari';
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 24px; /* 100% */
  letter-spacing: 2.4px;
}

.form-groups {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
}
.form-group {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
}
.form-input {
  display: flex;
  width: 720px;
  padding: 5.5px 13px 5.5px 13px;
  align-items: center;
  border: 1px solid #000;
  color: #000;
  font-family: 'Adelle Sans Devanagari';
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 116.667% */
}
.form-scroll {
  overflow-y: auto;
  width: 730px;
  height: 200px;
  margin-left: 2px;
  display: flex;
  flex-direction: column;
  gap: 28px;

  /* 为Webkit浏览器（Chrome, Safari）自定义滚动条 */
  /* 滚动条轨道 */
  &::-webkit-scrollbar {
    width: 8px; /* 滚动条的宽度 */
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* 轨道背景色 */
    border-radius: 6px; /* 轨道圆角 */
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background-color: #888; /* 滑块颜色 */
    border-radius: 3px; /* 滑块圆角 */
    border: 3px solid #f1f1f1; /* 滑块与轨道的间距 */
  }

  /* 滚动条滑块悬停时的样式 */
  &::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* 悬停时滑块颜色 */
  }
}
button {
  padding: 10px 15px;
}
</style>
