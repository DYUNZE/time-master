import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useGlobalTheme } from './composables/useGlobalTheme'
import { usePreferenceStore } from './stores/usePreferenceStore'

import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/es/components/message/style/css'
import './styles/main.css'
import { loadSlim } from '@tsparticles/slim'
import Particles from '@tsparticles/vue3'

const app = createApp(App)
useGlobalTheme()

app.use(createPinia())

// 初始化偏好设置
const preferenceStore = usePreferenceStore()
preferenceStore.init()

app.use(router)
app.use(Particles,{
    init: async(engine)=>{
        await loadSlim(engine)
    }
})

app.mount('#app')
