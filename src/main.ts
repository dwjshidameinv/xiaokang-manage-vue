
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "./assets/style.css"
import App from './App.vue'
import router from './router'

import piniaPersist from "pinia-plugin-persistedstate";
import components from './components'

//单独引入样式 
import "element-plus/es/components/message/style/css";

import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)

app.use(createPinia())
const pinia = createPinia();
pinia.use(piniaPersist);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
app.use(router).use(components)

app.mount('#app')
