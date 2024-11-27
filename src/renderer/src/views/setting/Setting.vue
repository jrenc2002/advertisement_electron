<!-- src/renderer/src/views/setting/setting.vue -->
<template>
  <div class="settings-container">
    <!-- Login Form -->
    <form class="login-form" @submit.prevent="handleLogin">
      <h2>登录</h2>
      <div class="form-group">
        <label for="username">用户名:</label>
        <input id="username" v-model="loginData.username" type="text" required />
      </div>
      <div class="form-group">
        <label for="password">密码:</label>
        <input id="password" v-model="loginData.password" type="password" required />
      </div>
      <button type="submit">登录</button>
    </form>

    <!-- Building and Ads Selection -->
    <div class="selection-section">
      <h2>选择设置</h2>
      <div class="form-group">
        <label for="building">选择建筑:</label>
        <select id="building" v-model="selectedBuilding" @change="fetchAds">
          <option disabled value="">请选择一个建筑</option>
          <option v-for="building in buildingOptions" :key="building" :value="building">
            {{ building }}
          </option>
        </select>
      </div>

      <div v-if="ads.length" class="form-group">
        <label for="ads">选择广告:</label>
        <select id="ads" v-model="selectedAd">
          <option disabled value="">请选择一个广告</option>
          <option v-for="ad in ads" :key="ad.ID" :value="ad.ID">
            {{ ad.Advertisement.title }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getBuildings } from '../../utils/apis/building/buildings'
import { getBuildingById } from '../../utils/apis/building/buildings'
import { login } from '../../utils/apis/auth/auth'
import { buildingStore } from '../../stores/building_store'
import { adsStore } from '../../stores/ads_store'

import axios from 'axios'
import { noticeStore } from '../../stores/notice_store'

type PageData = {
  pageNum: number
  pageSize: number
}
const pageData = ref<PageData>({
  pageNum: 1,
  pageSize: 10
})
const buildings = ref<any[]>([])
const ads = ref<any[]>([])
const selectedBuilding = ref<string>('')
const selectedAd = ref<string>('')

// Login form data
const loginData = ref({
  username: 'admin',
  password: 'healthist'
})

// Fetch buildings on mount
const buildingOptions = ref<any[]>([])
const fetchBuildings = async () => {
  await getBuildings(pageData.value).then((res) => {
    buildings.value = res.data.data
    buildingOptions.value = buildings.value.map(
      (building) => `${building.ID} title: ${building.name} address: ${building.address}`
    )
    // console.log(buildingOptions.value)
  })
}
watch(selectedBuilding, () => {
  // console.log(selectedBuilding.value)
})

// Handle login
const handleLogin = async () => {
  await login(loginData.value)
    .then((res) => {
      localStorage.setItem('token', res.data.token)
      fetchBuildings()
    })
    .catch((err) => {
      console.log(err)
    })
}

// Fetch ads based on selected building
const fetchAds = async () => {
  if (selectedBuilding.value) {
    const buildingId = selectedBuilding.value.split(' ')[0]
    try {
      const res = await getBuildingById(buildingId)
      // 使用 filter 只保留状态为 'active' 的广告
      buildingStore().setBuilding(res.data)
      // console.log(buildingStore().getBuilding)
      ads.value = res.data.advertisements_buildings
      adsStore().setAds_image(ads.value.filter((ad) => ad.Advertisement.type === 'img'))
      adsStore().setAds_video(ads.value.filter((ad) => ad.Advertisement.type === 'video'))
      console.log(ads.value)
      console.log(adsStore().getAds_image)
      console.log(adsStore().getAds_video)
    } catch (error) {
      console.error('获取广告列表失败:', error)
      ads.value = []
    }
  } else {
    ads.value = []
  }
}
const downloadImage = async (image, PathName) => {
  try {
    const response = await axios.get(image.mess_file, {
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: 'image/jpeg' }) // 根据实际图片类型修改 MIME 类型
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const filename = image.id + '.jpg' // 根据实际图片格式修改扩展名
    const result = await window.api.downloadImage(PathName, image.mess_file, filename)

    if (result.success) {
      switch (PathName) {
        case 'common':
          noticeStore().addNotices_hasDownload_common({ ...image, path: result.path })
          console.log(noticeStore().getNotices_hasDownload_common)
          break
        case 'adv':
          noticeStore().addNotices_hasDownload_adv({ ...image, path: result.path })
          console.log(noticeStore().getNotices_hasDownload_adv)
          break
      }
      console.log(`图片 "${image.mess_title}" 存储成功 at ${result.path}`)
    } else {
      console.error(`下载图片 "${image.mess_title}" 失败: ${result.error}`)
    }
  } catch (error) {
    console.error(`下载图片 ${image.mess_title} 失败:`, error)
  }
}

const downloadAllImages = async () => {
  const allCommonImages = noticeStore().getNotices_common
  const allAdvImages = noticeStore().getNotices_adv
  for (const image of allCommonImages) {
    if (noticeStore().getNotices_hasDownload_common.find((item) => item.id === image.id)) {
      continue
    }
    if (image.mess_file) {
      await downloadImage(image, 'common')
    }
  }
  for (const image of allAdvImages) {
    if (noticeStore().getNotices_hasDownload_adv.find((item) => item.id === image.id)) {
      continue
    }
    if (image.mess_file) {
      await downloadImage(image, 'adv')
    }
  }
}

// 新增下载视频的方法
const downloadVideo = async (video, PathName) => {
  try {
    const response = await axios.get(video.mess_file, {
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: 'video/mp4' }) // 根据实际视频类型修改 MIME 类型
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    const filename = video.id + '.mp4' // 根据实际视频格式修改扩展名
    const result = await window.api.downloadVideo(PathName, video.mess_file, filename)

    if (result.success) {
      switch (PathName) {
        case 'common':
          noticeStore().addNotices_hasDownload_common({ ...video, path: result.path })
          console.log(noticeStore().getNotices_hasDownload_common)
          break
        case 'adv':
          noticeStore().addNotices_hasDownload_adv({ ...video, path: result.path })
          console.log(noticeStore().getNotices_hasDownload_adv)
          break
      }
      console.log(`视频 "${video.mess_title}" 存储成功 at ${result.path}`)
    } else {
      console.error(`下载视频 "${video.mess_title}" 失败: ${result.error}`)
    }
  } catch (error) {
    console.error(`下载视频 ${video.mess_title} 失败:`, error)
  }
}

const downloadAllVideos = async () => {
  const allCommonVideos = noticeStore().getNotices_common
  const allAdvVideos = noticeStore().getNotices_adv
  for (const video of allCommonVideos) {
    if (noticeStore().getNotices_hasDownload_common.find((item) => item.id === video.id)) {
      continue
    }
    if (video.mess_file) {
      await downloadVideo(video, 'common')
    }
  }
  for (const video of allAdvVideos) {
    if (noticeStore().getNotices_hasDownload_adv.find((item) => item.id === video.id)) {
      continue
    }
    if (video.mess_file) {
      await downloadVideo(video, 'adv')
    }
  }
}

onMounted(() => {
  fetchBuildings()
})
</script>

<style scoped>
.settings-container {
  padding: 200px;
  width: 100%;
  height: 100%;
  color: #000;
}

.login-form,
.selection-section {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
}

input,
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
}
</style>
