<!-- src/renderer/src/views/governmentNotice.vue -->
<template>
  <NoticePage title="緊急通告" :pdfSource="pdfSource" currentRoute="/urgentNotice" />
</template>

<script setup lang="ts">
import NoticePage from '@renderer/components/Page/NoticePage.vue'

const pdfSource = [
  'https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation_tc.pdf',
  'https://www.gov.cn/zhengce/pdfFile/2023_PDF.pdf',
  'https://www.gov.cn/zhengce/pdfFile/2022_PDF.pdf'
]
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;

  .home-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;

    .home-body {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin-top: 10px;

      .home-body-title {
        color: #000;
        font-family: 'Adelle Sans Devanagari';
        font-size: 38px;
        font-style: normal;
        font-weight: 700;
        line-height: 44px;
        letter-spacing: 4.8px;
      }

      .home-body-nav {
        display: flex;
        flex-direction: row;
        width: 50%;
        justify-content: space-between;
        align-items: center;
        border: 1px solid rgb(66, 57, 57);
        padding: 10px;
        margin-top: 10px;
      }

      .current-router-notice {
        color: #ffa500;
      }

      .pdf-card-container {
        display: flex;
        flex-direction: column;
        height: auto;
        width: 80%;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border: 1px solid #fff;
        margin-top: 10px;

        .pdf-card {
          height: 100px;
          width: 100%;
          border: 1px solid rgb(66, 57, 57);
          color: #000;
          border-radius: 1px;
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
          display: flex;
          padding: 10px;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;

          p {
            text-align: center;
            word-break: break-all;
          }
          .pdf-card-button {
            color: #ffa500;
            font-family: 'Adelle Sans Devanagari';
            font-size: 24px;
            font-style: normal;
            font-weight: 400;
            line-height: 28px; /* 116.667% */
          }
        }
      }
    }
  }
}

.current-router-notice {
  color: #ffa500;
}
</style>
