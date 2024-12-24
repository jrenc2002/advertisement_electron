import {
  onMounted,
  onUnmounted,
  ref,
} from 'vue';

import { useRouter } from 'vue-router';

/**
 * 用户活动监控组合式函数
 * @param idleTime - 空闲超时时间（毫秒），默认5分钟
 * @param onIdle - 空闲时触发的回调函数
 * @param fullscreenTime - 进入全屏的等待时间（毫秒），默认10秒
 */
export function useActivityMonitor(
  idleTime: number = 10000,
  onIdle?: () => void,
  fullscreenTime: number = 10000
) {
  // 初始化路由实例
  const router = useRouter()
  // 声明空闲定时器
  let idleTimer: NodeJS.Timeout | null = null
  // 声明全屏定时器
  let fullscreenTimer: NodeJS.Timeout | null = null
  // 全屏状态响应式引用
  const isFullscreen = ref(false)

  /**
   * 重置定时器
   * 当用户有任何活动时调用此函数，重新开始计时
   */
  const resetTimer = () => {
    // 重置空闲计时器
    // if (idleTimer) clearTimeout(idleTimer)
    // idleTimer = setTimeout(() => {
      // 触发空闲回调（如果存在）
      // onIdle?.()
      // 导航到空闲页面
      // router.push('/idle-page')
    // }, idleTime)

    // 重置全屏计时器
    if (fullscreenTimer) clearTimeout(fullscreenTimer)
    // 如果当前是全屏状态，退出全屏
    if (isFullscreen.value) {
      isFullscreen.value = false
    }
    // 设置进入全屏的定时器
    fullscreenTimer = setTimeout(() => {
      isFullscreen.value = true
    }, fullscreenTime)
  }

  /**
   * 设置活动监听器
   * 监听用户的各种交互事件
   */
  const setupActivityListeners = () => {
    // 需要监听的用户交互事件列表
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    // 为每个事件添加监听器
    events.forEach(event => {
      window.addEventListener(event, resetTimer)
    })
    // 初始化定时器
    resetTimer()
  }

  /**
   * 清理活动监听器
   * 在组件卸载时移除所有事件监听器和定时器
   */
  const cleanupActivityListeners = () => {
    // 需要移除监听的事件列表
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    // 移除每个事件的监听器
    events.forEach(event => {
      window.removeEventListener(event, resetTimer)
    })
    // 清除所有定时器
    if (idleTimer) clearTimeout(idleTimer)
    if (fullscreenTimer) clearTimeout(fullscreenTimer)
  }

  // 组件挂载时设置监听器
  onMounted(() => {
    setupActivityListeners()
  })

  // 组件卸载时清理监听器
  onUnmounted(() => {
    cleanupActivityListeners()
  })

  // 返回可供外部使用的方法和状态
  return {
    resetTimer,            // 手动重置定时器的方法
    cleanupActivityListeners, // 清理监听器的方法
    isFullscreen          // 全屏状态的响应式引用
  }
} 