import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import routes from './router/index.js';
import App from './app.vue';

Vue.config.productionTip = false

const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes,
});

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
