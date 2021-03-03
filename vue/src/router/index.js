const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "js/home" */ '../pages/home/index.vue'), 
  },
  {
    path: '/auth-callback',
    name: 'authCallback',
    component: () => import(/* webpackChunkName: "js/auth-callback" */ '../pages/auth-callback/index.vue'), 
  }
];

export default routes;