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
import { loginBuilding } from '../../utils/apis/building/buildings'
import { adsStore } from '../../stores/ads_store'
import { useRouter } from 'vue-router'
const router = useRouter()
const selectedBuilding = ref<string>('')
import axios from 'axios'
// Login form data
const loginData = ref({
  user_name: '石桥',
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
      adsStore().setAds(res.data.advertisements_buildings)
      console.log(adsStore().getAds)
      downloadAllAds()
      router.push('/setting/setting_ads')
    })
    .catch((err) => {
      console.log(err)
    })
}

/*
 *download image
 */
const downloadImage = async (ad, PathName) => {
  try {
    const response = await axios.get(ad.image_url, {
      responseType: 'blob',
      timeout: 1000
    })

    const contentType = response.headers['content-type']
    const extension = contentType.split('/').pop()

    const blob = new Blob([response.data], { type: contentType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    const filename = `${ad.ID}.${extension}`
    console.log('filename image', filename)
    const result = await window.api.downloadImage(PathName, ad.image_url, filename)

    if (result.success) {
      console.log(`image ${filename} download success, path: ${result.path}`)
      return { success: true, path: result.path }
    } else {
      console.error(`download image failed: ${result.error}`)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error(`download image ${ad.title} failed:`, error)
    return { success: false, error: error }
  }
}

const downloadAllAds = async () => {
  const allAds = JSON.parse(JSON.stringify(adsStore().getAds))
  console.log('allAds', allAds)

  // create all download tasks array
  const downloadTasks = allAds.map(async (ad) => {
    const adId = ad.advertisement_id

    try {
      let result: any = null

      if (ad.Advertisement.type === 'img') {
        result = await downloadImage(ad.Advertisement, 'img')
      } else if (ad.Advertisement.type === 'video') {
        result = await downloadVideo(ad.Advertisement, 'video')
      }

      if (result && result.success) {
        adsStore().addAds_hasDownload({ ad: ad, path: result.path })
        adsStore().addAds_hasDownload_path({ adId: ad.ID, path: result.path })
        return { adId, status: 'success' }
      } else {
        console.error(`download ad ID=${adId} failed: ${result ? result.error : 'unknown error'}`)
        return { adId, status: 'failed', error: result ? result.error : 'unknown error' }
      }
    } catch (error: any) {
      console.error(`download ad ID=${adId} failed:`, error)
      return { adId, status: 'error', error: error || 'unknown error' }
    }
  })

  // execute all download tasks in parallel and wait for all tasks to complete
  const results = await Promise.allSettled(downloadTasks)

  // handle each task result
  results.forEach((result) => {
    if (result.status === 'fulfilled') {
      const { adId, status, error } = result.value
      if (status === 'success') {
        // already handled in task, no need extra operation
      } else if (status === 'failed') {
        // optional: record failed ad ID
        console.warn(`download ad ID=${adId} failed: ${error}`)
      }
    } else {
      // Promise rejected, record error
      console.error('download ad task error:', result.reason)
    }
  })

  console.log('all ads download tasks completed')
}

/*
 *download video
 */
const downloadVideo = async (ad, PathName) => {
  try {
    const response = await axios.get(ad.video_url, {
      responseType: 'blob',
      timeout: 10000
    })

    const contentType = response.headers['content-type']
    const extension = contentType.split('/').pop()

    const blob = new Blob([response.data], { type: contentType })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)

    const filename = `${ad.ID}.${extension}`
    console.log('filename video', filename)
    const result = await window.api.downloadVideo(PathName, ad.video_url, filename)

    if (result.success) {
      console.log(`video ${filename} download success, path: ${result.path}`)
      return { success: true, path: result.path }
    } else {
      console.error(`download video failed: ${result.error}`)
      return { success: false, error: result.error }
    }
  } catch (error) {
    console.error(`download video ${ad.title} failed:`, error)
    return { success: false, error: error }
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
