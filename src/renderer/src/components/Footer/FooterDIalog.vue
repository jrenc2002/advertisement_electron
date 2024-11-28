<template>
  <div class="notification-container">
    <transition-group name="fade" tag="div">
      <div v-for="notification in notifications" :key="notification.id" class="notification">
        {{ notification.message }}
        <!-- <span class="close-btn" @click="remove(notification.id)">&times;</span> -->
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useNotificationStore } from '../../stores/noticefication_store'

const notificationStore = useNotificationStore()
const notifications = computed(() => notificationStore.notifications)

const remove = (id: number) => {
  notificationStore.removeNotification(id)
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 225px;
  width: 100%;
  height: 120px;
  flex-shrink: 0;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  z-index: 9999;
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 10px;
  padding: 10px;
}

.notification {
  bottom: 10px;
  background-color: #fff;
  padding: 18px 25px;
  border-radius: 5px;
  width: 741px;
  height: 63px;
  color: #008000;
  font-family: 'Adelle Sans Devanagari';
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 116.667% */

  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  display: flex;
  align-items: center;
}

.close-btn {
  cursor: pointer;
  font-weight: bold;
  margin-left: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
