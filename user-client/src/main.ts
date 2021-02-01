import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {store} from './store/store'
import vuetify from './plugins/vuetify'
import axios from "axios"
import Pusher from "pusher-js"
import Message from "@/data/message"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL

Vue.config.productionTip = false

dayjs.extend(relativeTime)

// todo move to some kind of eventBus class, which can also be called from actions
const pusher = new Pusher(process.env.PUSHER_APP_KEY, {
  // auth: {headers: {'Session-Token': this.sessionToken}},
  cluster: 'ap3',
  forceTLS: true
})

const channel = pusher.subscribe('my-channel')
channel.bind('message-sent', async (msg: Message) => {
  await store.dispatch('messages/addMessage', {msg})
})

const callback = (eventName: string, data: any) => {
  console.log(`bind global: The event ${eventName} was triggered with data ${JSON.stringify(data)}`);
}
//bind to all events on the connection
pusher.bind_global(callback)

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Support Messenger'
  next()
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
