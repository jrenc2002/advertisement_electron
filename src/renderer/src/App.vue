<template>
  <router-view></router-view>
  <FooterDialog />
</template>

<script setup lang="ts">
import FooterDialog from './components/footer/FooterDIalog.vue';
import { useActivityMonitor } from './composables/useActivityMonitor';
import { useTaskStore } from './stores/task_store';
import { onMounted } from 'vue';

// 初始化活动监控，设置3分钟无操作后跳转
useActivityMonitor(180000);

// 在应用启动时执行一次下载任务
onMounted(() => {
  const taskStore = useTaskStore();
  taskStore.initialize();
});
</script>

<style></style>
