<template>
  <div class="home">
    <div class="home-content">
      <div class="home-body">
        <div class="home-body-title">緊急通告</div>
        <div class="home-body-nav">
          <div @click="goTo('/urgentNotice')">緊急通告</div>
          <div @click="goTo('/generalNotice')">一般通告</div>
          <div @click="goTo('/corporateNotice')">法團通告</div>
          <div @click="goTo('/governmentNotice')">政府通告</div>
        </div>
        <div class="home-body-content">
          <div class="pdf-container">
            <PDFPreview
              :pdf-source="pdfSource"
              @page-change="updatePage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRouterStore } from '@renderer/stores/index'
import { routerState } from '@renderer/stores/index'
import { ref, onBeforeUnmount } from 'vue'
import axios from 'axios'
import PDFPreview from '@renderer/views/PdfPreview.vue'

const router = useRouter()
const currentPage = ref(1)

const pdfSource =
  'https://data.weather.gov.hk/weatherAPI/doc/HKO_Open_Data_API_Documentation_tc.pdf' // 可替换为不同的 PDF URL

function goTo(route: string) {
  useRouterStore().setCurrentRouter(route as routerState)
  console.log(useRouterStore().getCurrentRouter)
  router.push(route)
}

function updatePage(page: number) {
  currentPage.value = page
  console.log('当前页码:', page)
}

onBeforeUnmount(() => {
  axios
    .get(pdfSource)
    .then((res) => {
      console.log(res)
    })
    .catch((error) => console.error('Error fetching PDF:', error))
})
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: #ccc;

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

      .home-body-content {
        width: 100%;
        height: 80vh; /* 调整高度以适应内容 */
        margin-top: 20px;
        display: flex;
        background-color: blue;

        .pdf-container {
          display: flex;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
