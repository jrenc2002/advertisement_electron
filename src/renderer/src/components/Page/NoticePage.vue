<template>
  <div class="home">
    <div class="home-content">
      <div class="home-body">
        <div class="home-body-title">{{ title }}</div>
        <div class="home-body-nav">
          <div
            :class="
              currentRoute === '/urgentNotice'
                ? 'current-router-notice'
                : 'home-body-nav-notcurrent '
            "
            @click="goTo('/urgentNotice')"
          >
            緊急通告
          </div>
          <div
            :class="
              currentRoute === '/generalNotice'
                ? 'current-router-notice'
                : 'home-body-nav-notcurrent '
            "
            @click="goTo('/generalNotice')"
          >
            一般通告
          </div>
          <div
            :class="
              currentRoute === '/corporateNotice'
                ? 'current-router-notice'
                : 'home-body-nav-notcurrent '
            "
            @click="goTo('/corporateNotice')"
          >
            法團通告
          </div>
          <div
            :class="
              currentRoute === '/governmentNotice'
                ? 'current-router-notice'
                : 'home-body-nav-notcurrent '
            "
            @click="goTo('/governmentNotice')"
          >
            政府通告
          </div>
        </div>
        <div class="pdf-card-container">
          <div v-for="(pdf, index) in pdfSource" :key="index" class="pdf-card">
            <div class="pdf-card-div">
              <p>{{ pdf.mess_title }}</p>
              <!-- <div class="pdf-card-date">發布日期： {{ pdf.date }}</div> -->
            </div>

            <div class="pdf-card-button-detail" @click="viewPdf(pdf)">查看详情</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useRouterStore } from '@renderer/stores/nav_store'
import { routerState } from '@renderer/stores/nav_store'
import { noticeStore } from '@renderer/stores/notice_store'
// 定义组件的 props
defineProps<{
  title: string
  pdfSource: { id: number; mess_title: string; mess_type: string; mess_file: string }[]
  currentRoute: string
}>()
const router = useRouter()
//TODO:添加其他两种类型的pdf
function viewPdf(pdf: any) {
  console.log('pdf', pdf)
  if (pdf.mess_type === 'common') {
    console.log('common')
    if (noticeStore().getNotices_hasDownload_common.find((item) => item.id === pdf.id)) {
      const pdfs = noticeStore().getNotices_hasDownload_common.find(
        (item) => item.id === pdf.id
      )?.path
      if (pdfs) {
        router.push({
          path: '/pdfPreview',
          query: {
            pdfSource: pdfs
          }
        })
      }
    } else {
      router.push({ path: '/pdfPreview', query: { pdfSource: pdf.mess_file } })
    }
  } else if (pdf.mess_type === 'adv') {
    console.log('adv')
    if (noticeStore().getNotices_hasDownload_adv.find((item) => item.id === pdf.id)) {
      const pdfs = noticeStore().getNotices_hasDownload_adv.find((item) => item.id === pdf.id)
      if (pdfs) {
        router.push({ path: '/pdfPreview', query: { pdfSource: pdfs.path } })
        console.log(pdfs.path)
      }
    } else {
      router.push({ path: '/pdfPreview', query: { pdfSource: pdf.mess_file } })
    }
  } else {
    console.log('没有下载')
    router.push({ path: '/pdfPreview', query: { pdfSource: pdf.mess_file } })
  }
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
    padding: 15px 32px 90px 32px;
    .home-body {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      // justify-content: center;
      align-items: center;
      gap: 20px;
      .home-body-title {
        color: #000;
        font-family: 'Adelle Sans Devanagari';
        font-size: 38px;
        font-style: normal;
        font-weight: 700;
        line-height: 44px;
        letter-spacing: 4.8px;
        height: 44px;
      }
      .home-body-nav {
        display: flex;
        width: 574px;
        justify-content: center;
        align-items: center;
        gap: 32px;
        height: 72px;

        border-radius: 3px;
        border: 1px solid #ccc;
        div {
          cursor: pointer;
        }
      }
      .pdf-card-container {
        display: flex;
        flex-direction: column;
        width: 100%;
        // max-height: 100%;
        height: 575px;
        gap: 20px;
        overflow-y: scroll;

        /* Hide scrollbar for WebKit browsers */
        &::-webkit-scrollbar {
          display: none;
        }

        /* Hide scrollbar for Firefox */
        scrollbar-width: none;
        .pdf-card {
          display: flex;
          padding: 32px 48px;
          justify-content: space-between;
          align-items: center;
          align-self: stretch;
          background: #fff;
          box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);

          cursor: pointer;
          .pdf-card-div {
            height: 74px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: flex-start;
            gap: 16px;

            p {
              color: #000;
              font-family: 'Adelle Sans Devanagari';
              font-size: 32px;
              font-style: normal;
              font-weight: 700;
              line-height: 28px; /* 87.5% */
            }
            .pdf-card-date {
              color: #bbb;
              font-family: 'Adelle Sans Devanagari';
              font-size: 24px;
              font-style: normal;
              font-weight: 700;
              line-height: 28px; /* 116.667% */
            }
          }

          .pdf-card-button-detail {
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
  font-family: 'Adelle Sans Devanagari';
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 28px; /* 107.692% */
}
.home-body-nav-notcurrent {
  color: #888;
  font-family: 'Adelle Sans Devanagari';
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 28px; /* 116.667% */
  text-decoration-line: underline;
}
</style>
