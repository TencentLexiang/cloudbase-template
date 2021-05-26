const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "pages/home/index" */ '../pages/home/index.vue'), 
  },
  {
    path: '/auth-callback',
    name: 'authCallback',
    component: () => import(/* webpackChunkName: "pages/auth-callback/index" */ '../pages/auth-callback/index.vue'), 
  },
  {
    path: '/admin',
    name: 'adminIndex',
    component: () => import(/* webpackChunkName: "pages/admin/index" */ '../pages/admin/index.vue'), 
  },
  {
    path: '*',
    name: 'notFound',
    component: () => import(/* webpackChunkName: "pages/errors/404.vue" */ '../pages/errors/404.vue'), 
  },
];

export default routes;