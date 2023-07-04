import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/project/create',
    name: 'project-create',
    component: () => import(/* webpackChunkName: "project-create" */ '../views/project-create/ProjectCreate.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  routes
});

export default router;
