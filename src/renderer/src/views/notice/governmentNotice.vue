<!-- src/renderer/src/views/governmentNotice.vue -->
<template>
  <NoticePage title="政府通告" :pdf-source="pdfSource" current-route="/governmentNotice" />
</template>

<script setup lang="ts">
import NoticePage from '@renderer/components/Page/NoticePage.vue'

const pdfSource = [
  'https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation_tc.pdf',
  'https://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf',
  'https://www.gov.cn/zhengce/pdfFile/2022_PDF.pdf'
]
</script>
