<template>
  <div class="flex h-full w-full relative bg-[#ffffff] px-4">
    <div class="w-full">
      <!-- 信息卡片 -->
      <div class="bg-white rounded-xl border border-grey p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-6">
        <div class="flex items-center justify-between">
          <!-- 标题部分 -->
          <div class="flex flex-col">
            <span class="text-2xl font-bold text-primary tracking-wider mb-1">欠費查詢</span>
            <span class="text-sm font-medium text-neutral tracking-widest uppercase">Payment Query</span>
          </div>
          
          <!-- 信息部分 -->
          <div class="flex items-center gap-8">
            <!-- 年份信息 -->
            <div class="flex flex-col border-r border-gray-200 pr-8">
              <span class="text-sm text-neutral mb-1">年份</span>
              <span class="text-xl font-medium text-primary">{{ selectedYear }}</span>
            </div>
            
            <!-- 楼号信息 -->
            <div class="flex flex-col border-r border-gray-200 pr-8">
              <span class="text-sm text-neutral mb-1">樓號</span>
              <span class="text-xl font-medium text-primary">{{ selectedBuilding }}樓</span>
            </div>
            
            <!-- 户号信息 -->
            <div class="flex flex-col">
              <span class="text-sm text-neutral mb-1">戶號</span>
              <span class="text-xl font-medium text-primary">{{ selectedFloor }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 欠费记录表格 -->
      <div class="bg-white rounded-xl border border-grey p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] mb-6">
        <div class="grid grid-cols-4 gap-4 text-center">
          <template v-for="month in displayMonths" :key="month.label">
            <div class="flex flex-col p-3 bg-white rounded-xl border border-grey shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
              <span class="text-sm text-neutral mb-2">{{ month.label }}</span>
              <span class="font-medium" :class="getStatusClass(month.status)">
                {{ month.status }}
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- 选择器容器 -->
      <div class="bg-white rounded-xl border border-grey p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <!-- 年份选择器 -->
        <div class="relative flex items-center justify-center mb-6">
          <button 
            @click="handlePrevYear"
            class="absolute left-0 px-3 py-2 transition-colors"
            :class="yearPage === 0 ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            <span class="text-2xl">
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
                <g fill='none' fill-rule='evenodd'>
                  <path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/>
                  <path :fill="yearPage === 0 ? '#f1f5f9' : '#007AFF'" d='M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122L7.938 13.06Z'/>
                </g>
              </svg>
            </span>
          </button>
          
          <div class="flex justify-center gap-4 overflow-hidden w-[80%]">
            <div class="flex gap-4">
              <button 
                v-for="year in displayYears" 
                :key="year"
                v-show="year !== null"
                @click="selectedYear = year"
                class="px-6 py-2 rounded-full text-sm transition-colors duration-200 min-w-[80px]"
                :class="selectedYear === year ? 'bg-primary text-white' : 'bg-gray-100 text-neutral hover:bg-gray-200'"
              >
                {{ year }}
              </button>
            </div>
          </div>

          <button 
            @click="handleNextYear"
            class="absolute right-0 px-3 py-2 transition-colors"
            :class="yearPage >= maxYearPages - 1 ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            <span class="text-2xl">
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
                <g fill='none' fill-rule='evenodd'>
                  <path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/>
                  <path :fill="yearPage >= maxYearPages - 1 ? '#f1f5f9' : '#007AFF'" d='M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12 8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z'/>
                </g>
              </svg>
            </span>
          </button>
        </div>

        <!-- 楼号选择器 -->
        <div class="relative flex items-center justify-center mb-4">
          <button 
            @click="handlePrevBuilding"
            class="absolute left-0 px-3 py-2 transition-colors"
            :class="buildingPage === 0 ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            <span class="text-2xl">
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
                <g fill='none' fill-rule='evenodd'>
                  <path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/>
                  <path :fill="buildingPage === 0 ? '#f1f5f9' : '#007AFF'" d='M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122L7.938 13.06Z'/>
                </g>
              </svg>
            </span>
          </button>

          <div class="flex justify-center gap-2 overflow-hidden w-[80%]">
            <div class="flex gap-2">
              <button 
                v-for="building in displayBuildings" 
                :key="building"
                v-show="building !== null"
                @click="selectedBuilding = building"
                class="px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors duration-200 min-w-[60px]"
                :class="selectedBuilding === building ? 'bg-primary text-white' : 'bg-gray-100 text-neutral hover:bg-gray-200'"
              >
                {{ building }}樓
              </button>
            </div>
          </div>

          <button 
            @click="handleNextBuilding"
            class="absolute right-0 px-3 py-2 transition-colors"
            :class="buildingPage >= maxBuildingPages - 1 ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            <span class="text-2xl">
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
                <g fill='none' fill-rule='evenodd'>
                  <path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/>
                  <path :fill="buildingPage >= maxBuildingPages - 1 ? '#f1f5f9' : '#007AFF'" d='M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12 8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z'/>
                </g>
              </svg>
            </span>
          </button>
        </div>

        <!-- 楼层选择器 -->
        <div class="relative flex items-center justify-center">
          <button 
            @click="handlePrevFloor"
            class="absolute left-0 px-3 py-2 transition-colors"
            :class="floorPage === 0 ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            <span class="text-2xl">
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
                <g fill='none' fill-rule='evenodd'>
                  <path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/>
                  <path :fill="floorPage === 0 ? '#f1f5f9' : '#007AFF'" d='M7.94 13.06a1.5 1.5 0 0 1 0-2.12l5.656-5.658a1.5 1.5 0 1 1 2.121 2.122L11.122 12l4.596 4.596a1.5 1.5 0 1 1-2.12 2.122L7.938 13.06Z'/>
                </g>
              </svg>
            </span>
          </button>

          <div class="flex justify-center gap-2 overflow-hidden w-[80%]">
            <div class="flex gap-2">
              <button 
                v-for="floor in displayFloors" 
                :key="floor"
                v-show="floor !== null"
                @click="selectedFloor = floor"
                class="px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors duration-200 min-w-[60px]"
                :class="selectedFloor === floor ? 'bg-primary text-white' : 'bg-gray-100 text-neutral hover:bg-gray-200'"
              >
                {{ floor }}
              </button>
            </div>
          </div>

          <button 
            @click="handleNextFloor"
            class="absolute right-0 px-3 py-2 transition-colors"
            :class="floorPage >= maxFloorPages - 1 ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            <span class="text-2xl">
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
                <g fill='none' fill-rule='evenodd'>
                  <path d='M24 0v24H0V0h24ZM12.593 23.258l-.011.002-.071.035-.02.004-.014-.004-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01-.017.428.005.02.01.013.104.074.015.004.012-.004.104-.074.012-.016.004-.017-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113-.013.002-.185.093-.01.01-.003.011.018.43.005.012.008.007.201.093c.012.004.023 0 .029-.008l.004-.014-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014-.034.614c0 .012.007.02.017.024l.015-.002.201-.093.01-.008.004-.011.017-.43-.003-.012-.01-.01-.184-.092Z'/>
                  <path :fill="floorPage >= maxFloorPages - 1 ? '#f1f5f9' : '#007AFF'" d='M16.06 10.94a1.5 1.5 0 0 1 0 2.12l-5.656 5.658a1.5 1.5 0 1 1-2.121-2.122L12.879 12 8.283 7.404a1.5 1.5 0 0 1 2.12-2.122l5.658 5.657Z'/>
                </g>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ArrearageRecord } from '@/types/arrearage'

// 模拟数据
const years = [2024, 2023, 2022,2021,2020,2019,2018,2017,2016,2015,2014,2013]
const buildings = ['01', '02', '03', '04', '05', '14', '15', '16', '17', '18', '19', '20']
const floors = ['G', 'E', '1', '2', '3', '4', '5','q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm']

// 选中的值
const selectedYear = ref(2024)
const selectedBuilding = ref('01')
const selectedFloor = ref('G')

// 分页状态
const yearPage = ref(0)
const buildingPage = ref(0)
const floorPage = ref(0)

// 每页显示的数量
const ITEMS_PER_PAGE = {
  year: 5,
  building: 8,
  floor: 8
}

// 计算分页后的显示数据
const displayYears = computed(() => {
  const start = yearPage.value * ITEMS_PER_PAGE.year
  const end = start + ITEMS_PER_PAGE.year
  const items = years.slice(start, end)
  while (items.length < ITEMS_PER_PAGE.year) {
    items.push(null)
  }
  return items
})

const displayBuildings = computed(() => {
  const start = buildingPage.value * ITEMS_PER_PAGE.building
  const end = start + ITEMS_PER_PAGE.building
  const items = buildings.slice(start, end)
  while (items.length < ITEMS_PER_PAGE.building) {
    items.push(null)
  }
  return items
})

const displayFloors = computed(() => {
  const start = floorPage.value * ITEMS_PER_PAGE.floor
  const end = start + ITEMS_PER_PAGE.floor
  const items = floors.slice(start, end)
  while (items.length < ITEMS_PER_PAGE.floor) {
    items.push(null)
  }
  return items
})

// 计算最大页数
const maxYearPages = Math.ceil(years.length / ITEMS_PER_PAGE.year)
const maxBuildingPages = Math.ceil(buildings.length / ITEMS_PER_PAGE.building)
const maxFloorPages = Math.ceil(floors.length / ITEMS_PER_PAGE.floor)

// 监听选中值的变化，确保选中项在可视区域内
watch(selectedYear, (newYear) => {
  const yearIndex = years.indexOf(newYear)
  if (yearIndex !== -1) {
    yearPage.value = Math.floor(yearIndex / ITEMS_PER_PAGE.year)
  }
})

watch(selectedBuilding, (newBuilding) => {
  const buildingIndex = buildings.indexOf(newBuilding)
  if (buildingIndex !== -1) {
    buildingPage.value = Math.floor(buildingIndex / ITEMS_PER_PAGE.building)
  }
})

watch(selectedFloor, (newFloor) => {
  const floorIndex = floors.indexOf(newFloor)
  if (floorIndex !== -1) {
    floorPage.value = Math.floor(floorIndex / ITEMS_PER_PAGE.floor)
  }
})

// 简化页面切换函数
const handlePageChange = (direction: 'prev' | 'next', type: 'year' | 'building' | 'floor') => {
  const pageRef = type === 'year' ? yearPage : type === 'building' ? buildingPage : floorPage
  const maxPages = type === 'year' ? maxYearPages : type === 'building' ? maxBuildingPages : maxFloorPages

  if (direction === 'prev' && pageRef.value > 0) {
    pageRef.value--
  } else if (direction === 'next' && pageRef.value < maxPages - 1) {
    pageRef.value++
  }
}

// 替换原有的处理函数
const handlePrevYear = () => handlePageChange('prev', 'year')
const handleNextYear = () => handlePageChange('next', 'year')
const handlePrevBuilding = () => handlePageChange('prev', 'building')
const handleNextBuilding = () => handlePageChange('next', 'building')
const handlePrevFloor = () => handlePageChange('prev', 'floor')
const handleNextFloor = () => handlePageChange('next', 'floor')

// 模拟获取数据的函数
const fetchArrearageData = () => {
  // 这里应该是从本地JSON文件读取数据的逻辑
  return [
    { month: 12, status: '已付' },
    { month: 11, status: '-2003' },
    { month: 10, status: '已付' },
    { month: 9, status: '已付' },
    // ... 更多月份数据
    { month: 8, status: '已付' },
    { month: 7, status: '已付' },
    { month: 6, status: '已付' },
    { month: 5, status: '已付' },
    { month: 4, status: '已付' },
    { month: 3, status: '已付' },
    { month: 2, status: '已付' },
    { month: 1, status: '已付' },
  ]
}

const displayMonths = computed(() => {
  const records = fetchArrearageData()
  return records.map(record => ({
    label: `${record.month}月`,
    status: record.status
  }))
})

const getStatusClass = (status: string) => {
  switch (status) {
    case '已付':
      return 'text-green-500'
    case '-2003':
      return 'text-red-500'
    default:
      return 'text-neutral'
  }
}
</script>

