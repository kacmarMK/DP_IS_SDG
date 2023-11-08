import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/devices', component: () => import('pages/DevicesPage.vue') },
      {
        path: '/devices/create',
        component: () => import('pages/CreateDevicePage.vue'),
      },
      { path: '/devices/:id', component: () => import('pages/DevicePage.vue') },
      { path: '/commands', component: () => import('pages/CommandsPage.vue') },
      { path: '/recipes', component: () => import('pages/RecipesPage.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue'),
  },
  {
    path: '/register',
    component: () => import('pages/RegisterPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
