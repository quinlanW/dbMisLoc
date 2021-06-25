import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import ElementUi from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import axios from "axios";
// import axios from 'axios'
// import VueAxios from "vue-axios";
 


Vue.config.productionTip = false
Vue.use(ElementUi);
Vue.prototype.$axios = axios;
// Vue.use(VueAxios, axios)

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
