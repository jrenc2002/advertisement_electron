<template>
  <nav class="w-full h-full px-6 bg-white">
    <div class="flex justify-between items-center h-full">
      <!-- 左侧返回/设置按钮 -->
      <button 
        @click="handleNavigation"
        class="h-[52px] px-6 flex justify-center items-center gap-2 rounded-lg
               bg-[#007AFF] text-white text-xl tracking-wider
               shadow-sm hover:bg-[#0066CC] 
               transition-all duration-200 ease-in-out
               focus:outline-none focus:ring-2 focus:ring-blue-300
               active:transform active:scale-95"
        :aria-label="buttonText"
        tabindex="0"
      >
        <img 
          :src="getButtonIcon"
          :alt="buttonText + '图标'"
          class="w-5 h-5 filter brightness-0 invert"
        />
        <span class="font-medium">{{ buttonText }}</span>
      </button>

      <!-- 右侧可选的其他导航元素 -->
      <slot name="right"></slot>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 根据当前路由计算按钮文本
const buttonText = computed(() => {
  const path = router.currentRoute.value.path
  if (path === '/') return '设置'
  if (path === '/setting') return '返回'
  if (path === '/buildingDetail') return '返回'
  return '返回'
})

// 获取按钮图标
const getButtonIcon = computed(() => {
  return new URL('@renderer/assets/button/button-left.svg', import.meta.url).href
})

// 处理导航逻辑
const handleNavigation = () => {
  const path = router.currentRoute.value.path
  
  if (path === '/') {
    router.push('/setting')
  } else if (path === '/setting') {
    router.push('/')
  } else if (path === '/buildingDetail') {
    router.push('/setting')
  } else {
    router.push('/')
  }
}
</script>
