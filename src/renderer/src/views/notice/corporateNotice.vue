<!-- src/renderer/src/views/governmentNotice.vue -->
<template>
  <NoticePage title="法團通告" :pdf-source="pdfSources" current-route="/corporateNotice" />
</template>

<script setup lang="ts">
import NoticePage from '@renderer/components/page/NoticePage.vue'

const pdfSources = [
  {
    id: 1,
    mess_file: 'https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation_tc.pdf',
    mess_title: '香港天文台',
    mess_type: 'commo'
  },
  {
    id: 2,
    mess_file: 'https://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf',
    mess_title: '2024年政府公开目录',
    mess_type: 'commn'
  },
  {
    id: 3,
    mess_file: 'https://www.gov.cn/zhengce/pdfFile/2022_PDF.pdf',
    mess_title: '2024年10月18日国务院通告',
    mess_type: 'commn'
  }
]
</script>
