import { useAuthStore } from '@/stores/auth-store';
import type { NavigationGuard } from 'vue-router';

export const adminGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAdmin) {
    next('/');
  } else if (!authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
};
