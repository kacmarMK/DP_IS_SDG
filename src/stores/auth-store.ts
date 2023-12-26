import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { User, UserLogin } from '@/models/User';
import AuthService from '@/services/AuthService';
import { computed, nextTick, ref, watch } from 'vue';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'vue3-toastify';

export const useAuthStore = defineStore('authStore', () => {
  const jwt = useStorage('jwt', '');
  const user = ref<User | null>(null);

  const isAuthenticated = computed(() => jwt.value !== '');

  async function login(user: UserLogin) {
    const res = await AuthService.login(user);
    jwt.value = res;
  }

  function logout(this: AuthUserStore, silent: boolean = false) {
    jwt.value = '';
    this.router.push('/login');
    if (!silent) {
      toast.success('You have been logged out');
    }
  }

  async function getUser() {
    if (!userId.value) return null;
    const user = await AuthService.getUserById(userId.value);
    return user;
  }

  const userId = computed(() => {
    if (!jwt.value) return null;

    const decodedToken = jwtDecode(jwt.value);
    return decodedToken.sub;
  });

  const isTokenExpired = computed(() => {
    if (!jwt.value) return true;

    const decodedToken = jwtDecode(jwt.value);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (!decodedToken.exp) return true;

    return decodedToken.exp < currentTime;
  });

  watch(
    userId,
    async () => {
      await nextTick(); // Ensures the JWT is set before the user is fetched
      user.value = await getUser();
    },
    { immediate: true },
  );
  return { jwt, login, logout, isAuthenticated, isTokenExpired, user };
});

type AuthUserStore = ReturnType<typeof useAuthStore>;
