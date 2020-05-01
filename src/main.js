import Vue from 'vue'
import App from './App.vue'
import router from "@/router"
import vuetify from './plugins/vuetify'
import axios from 'axios'
import Vuex from 'vuex'
import store from './vuex/store'

Vue.use(Vuex);
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');