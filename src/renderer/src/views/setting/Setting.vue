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
import { adsStore } from '../../stores'
import { buildingStore } from '../../stores/building_store'
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
  // Implement your login logic here
  await login(loginData.value)
    .then((res) => {
      // console.log(res.data.token)
      localStorage.setItem('token', res.data.token)
      // console.log(localStorage.getItem('token'))
      fetchBuildings()
    })
    .catch((err) => {
      console.log(err)
    })
  // After successful login, you might fetch additional data or navigate
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
      ads.value = res.data.advertisements_buildings.filter(
        (ad: any) => ad.Advertisement.status === 'active'
      )
      // console.log('过滤后的广告列表:', ads.value)
      adsStore().setAds(ads.value)
    } catch (error) {
      console.error('获取广告列表失败:', error)
      ads.value = []
    }
  } else {
    ads.value = []
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
  background: #fff;
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
