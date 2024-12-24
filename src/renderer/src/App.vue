<template>
  <router-view></router-view>
  <FooterDialog />
</template>

<script setup lang="ts">
import FooterDialog from './components/footer/FooterDIalog.vue';
import { useActivityMonitor } from './composables/useActivityMonitor';

// 初始化活动监控，设置3分钟无操作后跳转
useActivityMonitor(180000)
</script>

<style></style>
