import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

window._tcbEnv = window._tcbEnv || {};

import routes from './router/index.js';
import App from './app.vue';

import cloudbase from '@cloudbase/js-sdk';
import { lxStorage } from './utils';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.prototype.$tcbEnvID = window._tcbEnv.TCB_ENV_ID || process.env.ENV_ID;
const app = cloudbase.init({
  env: Vue.prototype.$tcbEnvID,
  region: window._tcbEnv.TCB_REGION,
  timeout: 60000
});
const auth = app.auth({
  persistence: window._tcbEnv.PERSISTENCE || process.env.PERSISTENCE
});
Vue.prototype.$app = app;
Vue.prototype.$auth = auth;

const router = new VueRouter({
  base: '/',
  mode: 'hash',
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.name == 'authCallback') {
    next();
    return;
  }

  const { company_id: companyId } = to.query;
  
  const loginCompany = JSON.parse(lxStorage.getItem('company') || '{}');
  const loginCompanyId = loginCompany.company_id;

  Vue.prototype.$company = loginCompany;

  const loginState = await Vue.prototype.$auth.getLoginState();
  console.log('loginState, loginUrl', loginState, loginUrl(companyId));

  if (companyId) {
    if (loginCompanyId && companyId !== loginCompanyId) {
      lxStorage.clear();
    }

    if (!loginState) {
      window.location.href = loginUrl(companyId);
      return;
    }
  } else if (!loginState && to.name !== 'home') {
    next('/');
  }
  
  next();
});

function loginUrl(company_id = null) {
  const redirect_uri = `${location.origin}/#/auth-callback`;
  let params = `suite_id=${window._tcbEnv.LX_SUITE_ID || process.env.LX_SUITE_ID}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=snsapi_userinfo`;

  if (company_id) {
    params = `${params}&company_id=${company_id}`;
  }

  sessionStorage.setItem('intendUrl', encodeURIComponent(window.location));

  return `${window._tcbEnv.LX_AUTH_URL || process.env.LX_AUTH_URL}?${params}`;
}

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
