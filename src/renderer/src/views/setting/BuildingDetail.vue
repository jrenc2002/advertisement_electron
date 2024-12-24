<!-- src/renderer/src/views/setting/setting.vue -->
<template>
  <div class="h-full  p-6 flex flex-col">
    <!-- 資訊列表卡片 -->
    <div class="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
      <div class="flex items-center gap-4 mb-4">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="currentTab = tab.key"
          class="px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm"
          :class="currentTab === tab.key ? 
            'bg-blue-100 text-blue-800' : 
            'hover:bg-gray-100 text-gray-600'"
        >
          <span class="material-icons-outlined text-sm">{{ tab.icon }}</span>
          {{ tab.label }}
          <span class="px-2 py-0.5 text-xs rounded-full bg-gray-100">
            {{ tab.key === 'ads' ? advertisements.length : notices.length }}
          </span>
        </button>
      </div>

      <div class="h-[20vh] overflow-y-auto">
        <!-- 廣告列表 -->
        <div v-if="currentTab === 'ads'" class="space-y-3">
          <div v-for="ad in advertisements" :key="ad.id" 
            class="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <h3 class="font-medium text-gray-800 text-sm">{{ ad.title }}</h3>
                <div class="flex items-center gap-4 text-xs text-gray-600">
                  <span>類型：{{ ad.type === 'video' ? '影片' : '圖片' }}</span>
                  <span>顯示位置：{{ displayTypeMap[ad.display] }}</span>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs"
                :class="ad.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                {{ ad.status === 'active' ? '展示中' : '未展示' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 通知列表 -->
        <div v-else class="space-y-3">
          <div v-for="notice in notices" :key="notice.id"
            class="p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
            <div class="flex items-center justify-between">
              <div class="space-y-1">
                <h3 class="font-medium text-gray-800 text-sm">{{ notice.title }}</h3>
                <p class="text-xs text-gray-600">{{ notice.description }}</p>
              </div>
              <span class="px-2.5 py-1 rounded-full text-xs" :class="getNoticeTypeStyle(notice.type)">
                {{ noticeTypeMap[notice.type] }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 卡片网格 -->
    <div class="grid grid-cols-3 gap-6">
      <!-- 大廈資料卡片 -->
      <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-icons-outlined text-gray-600">apartment</span>
          <h2 class="text-xl font-bold text-gray-800">大廈資料</h2>
        </div>
        <div class="space-y-3">
          <div class="flex items-center text-sm">
            <span class="text-gray-600 w-20">大廈名稱</span>
            <span class="text-gray-800 font-medium">{{ building?.name || '未設置' }}</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-600 w-20">大廈編號</span>
            <span class="text-gray-800 font-medium">{{ building?.id || '未設置' }}</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="text-gray-600 w-20">iSmart ID</span>
            <span class="text-gray-800 font-medium">{{ building?.ismartId || '未設置' }}</span>
          </div>
        </div>
      </div>

      <!-- 統計資訊卡片 -->
      <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-icons-outlined text-gray-600">analytics</span>
          <h2 class="text-xl font-bold text-gray-800">統計資訊</h2>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-blue-50 rounded-lg">
            <div class="text-sm text-blue-600 mb-1">廣告數量</div>
            <div class="text-2xl font-bold text-blue-700">{{ advertisements.length }}</div>
          </div>
          <div class="p-3 bg-purple-50 rounded-lg">
            <div class="text-sm text-purple-600 mb-1">通知數量</div>
            <div class="text-2xl font-bold text-purple-700">{{ notices.length }}</div>
          </div>
        </div>
      </div>

      <!-- 系統設置卡片 -->
      <div class="bg-white rounded-xl border border-gray-200 p-5 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
        <div class="flex items-center gap-2 mb-4">
          <span class="material-icons-outlined text-gray-600">settings</span>
          <h2 class="text-xl font-bold text-gray-800">系統設置</h2>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <label class="text-sm text-gray-600">更新間隔</label>
            <input
              v-model.number="updateInterval"
              type="number"
              min="1"
              class="w-24 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              @blur="handleIntervalChange"
              @keyup.enter="handleIntervalChange"
            />
            <span class="text-sm text-gray-600">分鐘</span>
          </div>
          <button 
            @click="handleUnbind"
            class="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors duration-200 flex items-center justify-center gap-2">
            <span class="material-icons-outlined text-sm">link_off</span>
            解除綁定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  ref,
} from 'vue';
import { useRouter } from 'vue-router';
import type { Advertisement, Notice } from '@renderer/apis';
import { useAdsStore } from '@renderer/stores/ads_store';
import { useBuildingStore } from '@renderer/stores/building_store';
import { useNoticeStore } from '@renderer/stores/notice_store';
import { useNotificationStore } from '@renderer/stores/noticefication_store';
import { useTaskStore } from '@renderer/stores/task_store';

const router = useRouter();
const notificationStore = useNotificationStore();
const adsStore = useAdsStore();
const buildingStore = useBuildingStore();
const noticeStore = useNoticeStore();
const taskStore = useTaskStore();

// Tab 配置
const tabs = [
  { key: 'ads', label: '廣告資訊', icon: 'ads_click' },
  { key: 'notices', label: '通知資訊', icon: 'notifications' }
] as const;
const currentTab = ref<typeof tabs[number]['key']>('ads');

// 计算属性
const building = computed(() => buildingStore.getBuilding);
const advertisements = computed(() => adsStore.getAllAds);
const notices = computed(() => noticeStore.notices);

// 更新间隔
const updateInterval = ref<number>(1);

// 显示类型映射
const displayTypeMap: Record<Advertisement['display'], string> = {
  'full': '全屏',
  'top': '頂部',
  'topfull': '頂部全屏'
};

// 通知类型映射
const noticeTypeMap: Record<Notice['type'], string> = {
  'urgent': '緊急',
  'common': '一般',
  'government': '政府',
  'system': '系統'
};

// 通知类型样式
const getNoticeTypeStyle = (type: Notice['type']) => {
  const styles = {
    'urgent': 'bg-red-100 text-red-800',
    'common': 'bg-gray-100 text-gray-800',
    'government': 'bg-blue-100 text-blue-800',
    'system': 'bg-purple-100 text-purple-800'
  };
  return styles[type];
};

// 处理更新间隔变更
const handleIntervalChange = () => {
  if (updateInterval.value < 1) {
    updateInterval.value = 1;
  }
  taskStore.setUpdateInterval(updateInterval.value);
  taskStore.startScheduledTask();
  notificationStore.addNotification('更新間隔設置成功', 'success');
};

// 处理解绑
const handleUnbind = async () => {
  adsStore.clearAds();
  buildingStore.clearBuilding();
  noticeStore.clearNotices();
  taskStore.stopScheduledTask();
  localStorage.removeItem('ismartId');
  localStorage.removeItem('password');
  notificationStore.addNotification('解除綁定成功', 'success');
  router.push('/setting');
};

onBeforeMount(() => {
  updateInterval.value = taskStore.updateInterval;
});
</script>
