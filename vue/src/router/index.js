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
    path: '/courses/create',
    name: 'courseCreate',
    component: () => import(/* webpackChunkName: "pages/course/create" */ '../pages/course/create.vue'), 
  },
  {
    path: '/courses/:courseId',
    name: 'courseShow',
    component: () => import(/* webpackChunkName: "pages/course/show" */ '../pages/course/show.vue'), 
  }
];

export default routes;