import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { useGlobalTheme } from './composables/useGlobalTheme'

import App from './App.vue'
import router from './router'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/main.css'
import { loadSlim } from '@tsparticles/slim'
import Particles from '@tsparticles/vue3'


const app = createApp(App)
useGlobalTheme()

app.use(createPinia())
app.use(router)
app.use(Particles,{
    init: async(engine)=>{
        await loadSlim(engine)
    }
})

app.mount('#app')
