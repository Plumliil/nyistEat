import {
    createApp
} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from './router'
import axios from 'axios'

// axios.defaults.baseURL = 'http://localhost:3366/api/'
axios.defaults.baseURL = 'http://180.76.195.252:3366/api/'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const app = createApp(App)


app.use(router)
app.use(ElementPlus)
app.mount('#app')