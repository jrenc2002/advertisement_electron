<!-- src/renderer/src/views/governmentNotice.vue -->
<template>
  <NoticePage title="政府通告" :pdf-source="pdfSource" current-route="/governmentNotice" />
</template>

<script setup lang="ts">
import NoticePage from '@renderer/components/Page/NoticePage.vue'

const pdfSource = [
  {
    mess_file: 'https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation_tc.pdf',
    mess_title: '香港天文台',
    mess_type: 'common',
    date: '2024-01-01'
  },
  {
    mess_file: 'https://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf',
    mess_title: '2023年政府公开目录',
    mess_type: 'common',
    date: '2023-01-01'
  },
  {
    mess_file: 'https://www.gov.cn/zhengce/pdfFile/2022_PDF.pdf',
    mess_title: '2022年政府公开目录',
    mess_type: 'common',
    date: '2022-01-01'
  }
]
</script>
