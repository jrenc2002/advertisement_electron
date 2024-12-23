import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';

import { useRouter } from 'vue-router';

export function useActivityMonitor(
  idleTime: number = 300000,
  onIdle?: () => void,
  fullscreenTime: number = 10000
) {
  const router = useRouter()
  let idleTimer: NodeJS.Timeout | null = null
  let fullscreenTimer: NodeJS.Timeout | null = null
  const isFullscreen = ref(false)

  const resetTimer = () => {
    // 重置空闲计时器
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      onIdle?.()
      router.push('/idle-page')
    }, idleTime)

    // 重置全屏计时器
    if (fullscreenTimer) clearTimeout(fullscreenTimer)
    if (isFullscreen.value) {
      isFullscreen.value = false
    }
    fullscreenTimer = setTimeout(() => {
      isFullscreen.value = true
    }, fullscreenTime)
  }

  const setupActivityListeners = () => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      window.addEventListener(event, resetTimer)
    })
    resetTimer()
  }

  const cleanupActivityListeners = () => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      window.removeEventListener(event, resetTimer)
    })
    if (idleTimer) clearTimeout(idleTimer)
    if (fullscreenTimer) clearTimeout(fullscreenTimer)
  }

  onMounted(() => {
    setupActivityListeners()
  })

  onUnmounted(() => {
    cleanupActivityListeners()
  })

  return {
    resetTimer,
    cleanupActivityListeners,
    isFullscreen
  }
} 