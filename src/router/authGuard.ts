import { useAuthStore } from '@/stores/auth-store';
import type { NavigationGuard } from 'vue-router';

export const authGuard: NavigationGuard = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
};
