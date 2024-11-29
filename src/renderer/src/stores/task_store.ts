import { defineStore } from 'pinia'
import { useNotificationStore } from './noticefication_store'
import { timeTask } from '../utils/time-task'

export const useTaskStore = defineStore('task', {
  state: () => ({
    // 定时任务的时间间隔（以分钟为单位）
    updateInterval: 1 as number,
    // 定时任务的定时器 ID
    timerId: null as NodeJS.Timeout | null,

    // 倒计时定时器 ID
    countdownTimer: null as NodeJS.Timeout | null,
    // 倒计时剩余时间（以秒为单位）
    countdown: 60 as number,
    // 标志任务是否正在运行，防止重叠执行
    isRunning: false as boolean
  }),
  getters: {
    // 格式化后的倒计时显示
    formattedCountdown(state): string {
      const minutes = Math.floor(state.countdown / 60)
      const seconds = state.countdown % 60
      return `${minutes}分 ${seconds}秒`
    }
  },
  actions: {
    // set time task interval
    setUpdateInterval(interval: number) {
      this.updateInterval = interval
      localStorage.setItem('updateInterval', interval.toString())
    },
    // set time task timer id
    setTimerId(id: NodeJS.Timeout | null) {
      this.timerId = id
    },
    // start time task
    startScheduledTask() {
      const notificationStore = useNotificationStore()
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }

      if (this.updateInterval > 0) {
        const intervalMs = this.updateInterval * 60 * 1000
        this.timerId = setInterval(async () => {
          if (!this.isRunning) {
            this.isRunning = true
            await timeTask()
            this.isRunning = false
            this.resetCountdown()
          }
        }, intervalMs)
        // notificationStore.addNotification('task adsStore: update success', 'success')

        this.resetCountdown()
        this.startCountdown(this.updateInterval * 60)
      } else {
        notificationStore.addNotification('请输入有效的时间间隔', 'error')
      }
    },
    // stop time task
    stopScheduledTask() {
      const notificationStore = useNotificationStore()

      if (this.timerId) {
        clearInterval(this.timerId) // clear time task timer
        this.timerId = null
        notificationStore.addNotification('定时任务已停止', 'success')
      }
      // stop countdown
      this.stopCountdown()
    },
    // start countdown
    startCountdown(duration: number) {
      this.countdown = duration
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
      }
      this.countdownTimer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--
        } else {
          this.resetCountdown()
        }
      }, 1000)
    },
    // reset countdown
    resetCountdown() {
      this.countdown = this.updateInterval * 60
    },
    // stop countdown
    stopCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
      this.countdown = 0
    },
    // initialize time task (call when app start)
    initialize() {
      const savedInterval = localStorage.getItem('updateInterval')
      if (savedInterval) {
        this.updateInterval = Number(savedInterval)
      }
      if (this.updateInterval > 0) {
        this.startScheduledTask()
        useNotificationStore().addNotification('重啓定時任務成功', 'success')
      }
    }
  }
})
