<!-- src/renderer/src/views/setting/setting.vue -->
<template>
  <div class="settings-container">
    <!-- Login Form -->
    <div class="form-groups">
      <div class="auth-bind-label">账户绑定</div>
      <div class="form-group">
        <label class="form-label">用户名:</label>
        <input
          id="username"
          v-model="loginData.user_name"
          class="form-input"
          type="text"
          required
        />
      </div>
      <div class="form-group">
        <label class="form-label">密码:</label>
        <input
          id="password"
          v-model="loginData.password"
          class="form-input"
          type="password"
          required
        />
      </div>
      <div class="form-group">
        <button class="form-button" @click="handleLogin">绑定</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { loginBuilding } from '@renderer/apis/building/buildings'
import { adsStore } from '@renderer/stores/ads_store'
import { useRouter } from 'vue-router'
import { useNotificationStore } from '@renderer/stores/noticefication_store'
import { buildingStore } from '@renderer/stores/building_store'
import { downloadAllAds } from '@renderer/utils/time-task'
import { useTaskStore } from '@renderer/stores/task_store'
import { noticeStore } from '@renderer/stores/notice_store'
import { getNotices } from '@renderer/apis/notice/notice'
import { downloadAllPDFs } from '@renderer/utils/time-task'
const notificationStore = useNotificationStore()

const router = useRouter()
const selectedBuilding = ref<string>('')
// Login form data
const loginData = ref({
  user_name: 'admin',
  password: 'admin123'
})

// Fetch buildings on mount
watch(selectedBuilding, () => {
  // console.log(selectedBuilding.value)
})

// Handle login
const handleLogin = async () => {
  await loginBuilding(loginData.value)
    .then((res) => {
      // 数据初始化
      adsStore().setAds([])
      adsStore().setAds_hasDownload([])
      adsStore().setAds_hasDownload_path([])
      buildingStore().setBuilding('')
      noticeStore().clearNotices()
      useTaskStore().stopScheduledTask()
      localStorage.removeItem('login-username')
      localStorage.removeItem('login-password')

      // 数据初始化完成
      // console.log(res.data)
      localStorage.setItem('login-username', loginData.value.user_name)
      localStorage.setItem('login-password', loginData.value.password)
      adsStore().setAds(res.data.advertisements_buildings)
      // console.log(adsStore().getAds)
      downloadAllAds()
      buildingStore().setBuilding(adsStore().getAds[0].BuildingAdmin)
      notificationStore.addNotification('綁定成功', 'success')
      useTaskStore().setUpdateInterval(1)
      useTaskStore().startScheduledTask()

      router.push('/buildingDetail')
    })
    .catch((err) => {
      console.log(err)
      notificationStore.addNotification('綁定失敗', 'error')
    })
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
    // useNotificationStore().addNotification('獲取通知成功', 'success')
  } catch (error) {
    console.error('獲取通知失敗:', error)
    // useNotificationStore().addNotification('獲取通知失敗', 'error')
  }
}
</script>

<style lang="scss" scoped>
.auth-bind-label {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  font-family: 'Adelle Sans Devanagari';
  font-size: 48px;
  font-style: normal;
  font-weight: 700;
  line-height: 64px; /* 133.333% */
  letter-spacing: 4.8px;
}
.form-label {
  width: 72px;
  height: 57px;
  color: #000;
  font-family: 'Adelle Sans Devanagari';
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 116.667% */
  display: flex;
  align-items: center;

  white-space: nowrap;
  position: absolute;
  top: 0px;
  left: 178px;
}
.form-input {
  width: 467px;
  height: 57px;
  border: 1px solid #000;
  font-family: 'Adelle Sans Devanagari';
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
}
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

button {
  padding: 10px 15px;
}
</style>
