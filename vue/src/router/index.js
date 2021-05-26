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
    path: '/courses',
    name: 'courseIndex',
    component: () => import(/* webpackChunkName: "pages/course/index" */ '../pages/course/index.vue'), 
  },
  {
    path: '/courses/create',
    name: 'courseCreate',
    component: () => import(/* webpackChunkName: "pages/course/create" */ '../pages/course/create.vue'), 
  },
  {
    path: '/courses/:courseId/preview',
    name: 'coursePreview',
    component: () => import(/* webpackChunkName: "pages/course/preview" */ '../pages/course/preview.vue'), 
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