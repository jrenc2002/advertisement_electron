<template>
  <div class="router-notice">
    <div class="router-notice-item">
      <router-link to="/urgentNotice">緊急通告</router-link>
    </div>
    <div class="router-notice-item">
      <router-link to="/generalNotice">一般通告</router-link>
    </div>
    <div class="router-notice-item">
      <router-link to="/corporateNotice">法團通告</router-link>
    </div>
    <div class="router-notice-item">
      <router-link to="/governmentNotice">政府通告</router-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<style scoped lang="scss">
.router-notice {
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
