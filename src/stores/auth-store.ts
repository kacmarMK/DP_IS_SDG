import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { UserLogin } from '@/models/User';
import AuthService from '@/services/AuthService';
import { computed } from 'vue';

export const useAuthStore = defineStore('authStore', () => {
  const jwt = useStorage('jwt', '');

  const isAuthenticated = computed(() => jwt.value !== '');

  async function login(user: UserLogin) {
    const res = await AuthService.login(user);
    jwt.value = res;
  }

  function logout(this: AuthUserStore) {
    jwt.value = '';
    this.router.push('/login');
  }

  return { jwt, login, logout, isAuthenticated };
});

type AuthUserStore = ReturnType<typeof useAuthStore>;
