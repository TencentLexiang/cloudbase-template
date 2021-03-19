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
  }
];

export default routes;