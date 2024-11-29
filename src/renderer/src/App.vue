<template>
  <router-view></router-view>
  <FooterDialog />
</template>

<script setup>
import FooterDialog from './components/Footer/FooterDIalog.vue'
import { watch } from 'vue'
import { useTaskStore } from './stores/task_store'

const taskStore = useTaskStore()
watch(taskStore.timerId, (newVal) => {
  console.log('timerId changed:', newVal)
})
</script>

<style></style>
