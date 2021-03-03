import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import routes from './router/index.js';
import App from './app.vue';

import cloudbase from '@cloudbase/js-sdk';

Vue.config.productionTip = false

const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes,
});

router.beforeEach(async (to, from, next) => {
  const { company_id } = to.query;

  if (company_id) {
    const app = cloudbase.init({
      env: process.env.ENV_ID
    });
    const auth = app.auth();
    const loginState = await auth.getLoginState();
    console.log(loginState, loginUrl(company_id));

    if (!loginState) {
      window.location.href = loginUrl(company_id);
    }
  }
  
  next();
});

function loginUrl(company_id = null) {
  const redirect_uri = `${process.env.PAGE_URL}/auth-callback`;
  let params = `suite_id=${process.env.LX_SUITE_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=snsapi_userinfo`;

  if (company_id) {
    params = `${params}&company_id=${company_id}`;
  }

  return `${process.env.LX_AUTH_URL}?${params}`;
}

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
