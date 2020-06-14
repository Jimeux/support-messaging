import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import {store} from './store/store'
import vuetify from './plugins/vuetify'
import Pusher from "pusher-js"
import Message from "@/data/message"
import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

Vue.config.productionTip = false

dayjs.extend(relativeTime)

// todo move to some kind of eventBus class, which can also be called from actions
const pusher = new Pusher('c817752eaaf09a554620', {
  // auth: {headers: {'Session-Token': this.sessionToken}},
  cluster: 'ap3',
  forceTLS: true
})

const channel = pusher.subscribe('my-channel')
channel.bind('message-sent', async (m: Message) => {
  await store.dispatch('messages/addMessage', m)
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
