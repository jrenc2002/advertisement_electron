<template>
  <div class="home">
    <div class="home-content">
      <div class="home-body">
        <div class="home-body-title">{{ title }}</div>
        <div class="home-body-nav">
          <div
            :class="currentRoute === '/urgentNotice' ? 'current-router-notice' : ''"
            @click="goTo('/urgentNotice')"
          >
            緊急通告
          </div>
          <div
            :class="currentRoute === '/generalNotice' ? 'current-router-notice' : ''"
            @click="goTo('/generalNotice')"
          >
            一般通告
          </div>
          <div
            :class="currentRoute === '/corporateNotice' ? 'current-router-notice' : ''"
            @click="goTo('/corporateNotice')"
          >
            法團通告
          </div>
          <div
            :class="currentRoute === '/governmentNotice' ? 'current-router-notice' : ''"
            @click="goTo('/governmentNotice')"
          >
            政府通告
          </div>
        </div>
        <div
          v-for="pdf in pdfSource"
          :key="pdf"
          class="pdf-card-container"
        >
          <div class="pdf-card">
            <p>{{ pdf }}</p>
            <div
              class="pdf-card-button"
              @click="viewPdf(pdf)"
            >查看详情</div>
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
// 定义组件的 props
const props = defineProps<{
  title: string
  pdfSource: string[]
  currentRoute: string
}>()
const router = useRouter()
function viewPdf(pdf: string) {
  router.push({ path: '/pdfPreview', query: { pdfSource: pdf } })
  console.log(pdf)
}
function goTo(route: string) {
  useRouterStore().setCurrentRouter(route as routerState)
  console.log(useRouterStore().getCurrentRouter)
  router.push(route)
}
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
        div {
          cursor: pointer;
        }
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
            line-height: 28px;
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
