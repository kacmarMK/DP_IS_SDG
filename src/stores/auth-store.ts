import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { UserLogin } from '@/models/User';
import AuthService from '@/services/AuthService';
import { computed } from 'vue';
import { jwtDecode } from 'jwt-decode';

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

  const isTokenExpired = computed(() => {
    if (!jwt.value) return true;

    const decodedToken = jwtDecode(jwt.value);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (!decodedToken.exp) return true;

    return decodedToken.exp < currentTime;
  });

  return { jwt, login, logout, isAuthenticated, isTokenExpired };
});

type AuthUserStore = ReturnType<typeof useAuthStore>;
