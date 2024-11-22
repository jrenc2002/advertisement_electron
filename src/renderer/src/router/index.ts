import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeLayout from '../layouts/HomeLayout.vue'
import PDFViewLayout from '../layouts/PDFViewLayout.vue'

// 定义路由的类型
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: HomeLayout,
    children: [
      { path: '', component: () => import('../views/notice/urgentNotice.vue') },
      { path: 'urgentNotice', component: () => import('../views/notice/urgentNotice.vue') },
      { path: 'generalNotice', component: () => import('../views/notice/generalNotice.vue') },
      { path: 'corporateNotice', component: () => import('../views/notice/corporateNotice.vue') },
      { path: 'governmentNotice', component: () => import('../views/notice/governmentNotice.vue') },
      { path: 'setting', component: () => import('../views/setting/setting.vue') }
    ]
  },
  {
    path: '/pdfPreview',
    component: PDFViewLayout,
    children: [{ path: '', component: () => import('../views/PDF/PdfPreview.vue') }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
