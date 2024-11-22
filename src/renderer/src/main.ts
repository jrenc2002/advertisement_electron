import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import * as pdfjslib from 'pdfjs-dist'
import piniaPersistedState from 'pinia-plugin-persistedstate'
pdfjslib.GlobalWorkerOptions.workerSrc = 'node_modules/pdfjs-dist/build/pdf.worker.js'
const pinia = createPinia()
pinia.use(piniaPersistedState)

createApp(App).use(router).use(pinia).mount('#app')
