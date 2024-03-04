<template>
  <GoogleLogin :callback="login" prompt />
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const loading = defineModel('loading', {
  type: Boolean,
  required: true,
});

const authStore = useAuthStore();
const router = useRouter();

async function login(response: { credential: string }) {
  try {
    loading.value = true;
    await authStore.loginByGoogle(response.credential);
    toast.success('Prihlásenie prebehlo úspešne');
    router.push('/');
  } catch (error) {
    toast.error('Prihlásenie sa nepodarilo');
  } finally {
    loading.value = false;
  }
}
</script>
