import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import HomeLayout from '../layouts/HomeLayout.vue'
import PDFViewLayout from '../layouts/PDFViewLayout.vue'

// 定义路由的类型
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: HomeLayout,
    children: [
      { path: '', component: () => import('../views/notice/UrgentNotice.vue') },
      { path: 'urgentNotice', component: () => import('../views/notice/UrgentNotice.vue') },
      { path: 'generalNotice', component: () => import('../views/notice/GeneralNotice.vue') },
      { path: 'corporateNotice', component: () => import('../views/notice/CorporateNotice.vue') },
      { path: 'governmentNotice', component: () => import('../views/notice/GovernmentNotice.vue') },
      { path: 'setting', component: () => import('../views/setting/SettingBindBuilding.vue') },
      { path: 'buildingDetail', component: () => import('../views/setting/BuildingDetail.vue') }
    ]
  },
  {
    path: '/pdfPreview',
    component: PDFViewLayout,
    children: [{ path: '', component: () => import('../views/pdf/PdfPreview.vue') }]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes
})

export default router
