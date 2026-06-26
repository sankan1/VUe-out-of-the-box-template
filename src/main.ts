import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/assets/css/app.css'
import App from '@/App.vue'
import router from '@/router'
import { configureAxios } from '@/config/axiosConfig'
import { i18n } from '@/config/i18nConfig'
import * as permissions from '@/directives/permissions'
import { plugin as unleashPlugin } from '@unleash/proxy-client-vue'
import { unleashClient } from '@/config/unleashConfig'

configureAxios()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)

app.use(unleashPlugin, { unleashClient })

app.directive('visible-to-head-user-group', permissions.visibleToHeadUserGroup)
app.directive('visible-to-end-user-group', permissions.visibleToEndUserGroup)
app.directive('visible-to-admin-group', permissions.visibleToAdminGroup)

app.mount('#app')