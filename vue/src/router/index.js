const routes = [
  {
    path: '/auth-callback',
    name: 'authCallback',
    component: () => import(/* webpackChunkName: "js/auth-callback" */ '../pages/auth-callback/index.vue'), 
  }
];

export default routes;