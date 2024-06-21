import './assets/main.css'

import {createApp} from 'vue'
import App from './App.vue'
import router from './router'

import {createPinia} from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

import { plugin, defaultConfig } from '@formkit/vue'
import formKitConfig from '../formkit.config'

import VxeUITable from 'vxe-table'
import 'vxe-table/lib/style.css'

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
const options = {
    // You can set your default options here
    newestOnTop: true
};

import VueClipboard from 'vue-clipboard3'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(createPinia().use(piniaPluginPersist))
    .use(router)
    .use(plugin, defaultConfig(formKitConfig))
    .use(VxeUITable)
    .use(Toast, options)
    .use(ElementPlus)
    .use(VueClipboard)
    .mount('#app')
