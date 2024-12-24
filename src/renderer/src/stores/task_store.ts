import { defineStore } from 'pinia';
import { timeTask } from '@renderer/utils/time-task';
import { useNotificationStore } from './noticefication_store';

export const useTaskStore = defineStore('task', {
  state: () => ({
    isRunning: false as boolean,
    retryCount: 0 as number,
    maxRetries: 3 as number,
  }),

  getters: {
    canRetry(state): boolean {
      return state.retryCount < state.maxRetries;
    }
  },

  actions: {
    async executeTask() {
      if (this.isRunning) return;

      try {
        this.isRunning = true;
        await timeTask();
        this.retryCount = 0;
      } catch (error) {
        console.error('Task execution failed:', error);
        const notificationStore = useNotificationStore();
        
        if (this.canRetry) {
          this.retryCount++;
          notificationStore.addNotification(
            `任務執行失敗，正在重試 (${this.retryCount}/${this.maxRetries})`,
            'warning'
          );
          // 5秒后重试
          setTimeout(() => this.executeTask(), 5000);
        } else {
          notificationStore.addNotification('任務執行失敗，已達到最大重試次數', 'error');
          this.retryCount = 0;
        }
      } finally {
        this.isRunning = false;
      }
    },

    // 初始化任务
    initialize() {
      const isLoggedIn = localStorage.getItem('ismartId') && localStorage.getItem('password');
      if (isLoggedIn) {
        this.executeTask();
      }
    }
  }
});
