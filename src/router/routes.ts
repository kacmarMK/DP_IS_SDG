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
      {
        path: '/devices/:id/jobs',
        component: () => import('pages/JobsOnDevicePage.vue'),
      },
      {
        path: '/devices/:id/edit',
        component: () => import('pages/UpdateDevicePage.vue'),
      },
      {
        path: '/jobs',
        component: () => import('pages/AllJobsPage.vue'),
      },
      {
        path: '/jobs/:id/',
        component: () => import('pages/JobDetailPage.vue'),
      },
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
