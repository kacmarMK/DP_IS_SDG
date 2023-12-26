import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/devices',
        component: () => import('pages/devices/DevicesPage.vue'),
      },
      {
        path: '/devices/create',
        component: () => import('pages/devices/CreateDevicePage.vue'),
      },
      {
        path: '/devices/:id',
        component: () => import('pages/devices/DevicePage.vue'),
      },
      {
        path: '/devices/:id/jobs',
        component: () => import('pages/jobs/JobsOnDevicePage.vue'),
      },
      {
        path: '/devices/:id/edit',
        component: () => import('pages/devices/UpdateDevicePage.vue'),
      },
      {
        path: '/jobs',
        component: () => import('pages/jobs/AllJobsPage.vue'),
      },
      {
        path: '/jobs/:id/',
        component: () => import('pages/jobs/JobDetailPage.vue'),
      },
      {
        path: '/commands',
        component: () => import('pages/commands/CommandsPage.vue'),
      },
      {
        path: '/recipes',
        component: () => import('pages/recipes/RecipesPage.vue'),
      },
      {
        path: '/collections',
        component: () => import('pages/collections/CollectionsPage.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('pages/auth/LoginPage.vue'),
  },
  {
    path: '/register',
    component: () => import('pages/auth/RegisterPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
