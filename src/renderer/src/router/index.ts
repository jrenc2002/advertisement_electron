import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import PDFViewLayout from '../layouts/PDFViewLayout.vue'

// 定义路由的类型
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      { path: '', component: () => import('../views/home.vue') },
      { path: 'urgentNotice', component: () => import('../views/urgentNotice.vue') },
      { path: 'generalNotice', component: () => import('../views/generalNotice.vue') },
      { path: 'corporateNotice', component: () => import('../views/corporateNotice.vue') },
      { path: 'governmentNotice', component: () => import('../views/governmentNotice.vue') }
    ]
  },
  {
    path: '/pdfPreview',
    component: PDFViewLayout,
    children: [{ path: '', component: () => import('../views/PdfPreview.vue') }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
