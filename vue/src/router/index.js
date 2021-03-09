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
  },
  {
    path: '/show-course',
    name: 'showCourse',
    component: () => import(/* webpackChunkName: "js/course" */ '../pages/course/show.vue'), 
  }
];

export default routes;