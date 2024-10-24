<!-- src/renderer/src/views/governmentNotice.vue -->
<template>
  <NoticePage title="緊急通告" :pdf-source="pdfSource" current-route="/urgentNotice" />
</template>

<script setup lang="ts">
import NoticePage from '@renderer/components/Page/NoticePage.vue'

const pdfSource = [
  {
    url: 'https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation_tc.pdf',
    name: '香港天文台',
    date: '2024-01-01'
  },
  {
    url: 'https://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf',
    name: '2023年政府公开目录',
    date: '2023-01-01'
  },
  {
    url: 'https://www.gov.cn/zhengce/pdfFile/2022_PDF.pdf',
    name: '2022年政府公开目录',
    date: '2022-01-01'
  }
]
</script>
